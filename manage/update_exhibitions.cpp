
// to build:
// g++ -std=c++17 update_exhibitions.cpp -I"C:\Users\20027\Local Desktop\AW002\artist-website\manage\include" -L"C:\Users\20027\Local Desktop\AW002\artist-website\manage\lib" -lwebp -lssp -o bin\update_exhibitions.exe

// to run:
// bin\update_exhibitions.exe




#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <algorithm>
#include <sstream>
#include <iomanip>
#include <map>
#include <ctime>
#include <nlohmann/json.hpp>
#include <webp/decode.h>

using ordered_json = nlohmann::ordered_json;

struct ExhibitionItem {
    std::string imageName, title, startDate, endDate, location;
    ordered_json detailImgs;
};

// Parse English "Month day, year"
static std::tm parseEnDate(const std::string& s) {
    std::tm tm{};
    std::istringstream ss(s);
    std::string monthName;
    int day, year;
    char comma;
    ss >> monthName >> day >> comma >> year;
    static const std::map<std::string,int> monthMap = {
        {"January",1},{"February",2},{"March",3},{"April",4},
        {"May",5},{"June",6},{"July",7},{"August",8},
        {"September",9},{"October",10},{"November",11},{"December",12}
    };
    auto it = monthMap.find(monthName);
    if (it == monthMap.end()) { std::cerr<<"Invalid month: "<<monthName; std::exit(1); }
    tm.tm_year = year - 1900;
    tm.tm_mon  = it->second - 1;
    tm.tm_mday = day;
    return tm;
}

// Parse Chinese "YYYY年M月D日"
static std::tm parseZhDate(const std::string& s) {
    std::tm tm{};
    size_t yEnd = s.find("年");
    int year = std::stoi(s.substr(0, yEnd));
    size_t mEnd = s.find("月", yEnd+3);
    int month = std::stoi(s.substr(yEnd+3, mEnd - (yEnd+3)));
    size_t dEnd = s.find("日", mEnd+3);
    int day = std::stoi(s.substr(mEnd+3, dEnd - (mEnd+3)));
    tm.tm_year = year - 1900;
    tm.tm_mon  = month - 1;
    tm.tm_mday = day;
    return tm;
}

// Format English date
static std::string formatEnDate(const std::tm& tm) {
    static const char* months[] = {"January","February","March","April","May","June",
                                   "July","August","September","October","November","December"};
    std::ostringstream oss;
    oss << months[tm.tm_mon] << " " << tm.tm_mday << ", " << (tm.tm_year+1900);
    return oss.str();
}

// Format Chinese date
static std::string formatZhDate(const std::tm& tm) {
    std::ostringstream oss;
    oss << (tm.tm_year+1900) << "年" << (tm.tm_mon+1) << "月" << tm.tm_mday << "日";
    return oss.str();
}

static time_t toTimeT(std::tm tm) {
    return std::mktime(&tm);
}

int main() {
    const std::vector<std::string> langs = {"en","zh"};
    const std::string inDir  = R"(C:\Users\20027\Local Desktop\AW002\artist-website\manage\input\)";
    const std::string outDir = R"(C:\Users\20027\Local Desktop\AW002\artist-website\src\app\data\exhibitions\json\)";

    for (const auto& lang : langs) {
        std::string inPath = inDir + "exhibitioninfo_" + lang + ".json";
        std::ifstream inFile(inPath);
        if (!inFile) { std::cerr<<"Cannot open "<<inPath<<std::endl; return 1; }
        ordered_json raw; inFile>>raw; inFile.close();
        if (!raw.is_array()) { std::cerr<<"Invalid input array: "<<inPath<<std::endl; return 1; }

        std::vector<ExhibitionItem> items;
        for (size_t i = 1; i < raw.size(); ++i) {
            auto& a = raw[i];
            ExhibitionItem it;
            it.imageName = a[0].get<std::string>();
            it.title     = a[1].get<std::string>();
            it.startDate = a[2].get<std::string>();
            it.endDate   = a[3].get<std::string>();
            it.location  = a[4].get<std::string>();
            if (a[5].is_array() && !a[5].empty() && !a[5][0].get<std::string>().empty())
                it.detailImgs = a[5];
            items.push_back(std::move(it));
        }

        // Sort by start date descending
        if (lang == "en") {
            std::sort(items.begin(), items.end(), [](const ExhibitionItem& x, const ExhibitionItem& y) {
                return toTimeT(parseEnDate(x.startDate)) > toTimeT(parseEnDate(y.startDate));
            });
        } else {
            std::sort(items.begin(), items.end(), [](const ExhibitionItem& x, const ExhibitionItem& y) {
                return toTimeT(parseZhDate(x.startDate)) > toTimeT(parseZhDate(y.startDate));
            });
        }

        ordered_json jAll = ordered_json::object();
        std::map<int, ordered_json, std::greater<int>> yearGroups;

        for (const auto& it : items) {
            std::tm ts, te; std::string sStart, sEnd;
            if (lang == "en") {
                ts = parseEnDate(it.startDate);
                te = parseEnDate(it.endDate);
                sStart = formatEnDate(ts);
                sEnd   = formatEnDate(te);
            } else {
                ts = parseZhDate(it.startDate);
                te = parseZhDate(it.endDate);
                sStart = formatZhDate(ts);
                sEnd   = formatZhDate(te);
            }
            int year = ts.tm_year + 1900;

            ordered_json entry = ordered_json::object();
            entry["title"] = it.title;
            entry["src"]   = "/assets/exhibitions/image/" + it.imageName + ".webp";
            entry["alt"]   = it.title;

            {   // ---------- Compute background color ---------- //
                // build full .webp path
                std::string imagePath =
                R"(C:\Users\20027\Local Desktop\AW002\artist-website\public\assets\exhibitions\image\)"
                + it.imageName + ".webp";

                // read file into memory
                std::ifstream ifs(imagePath, std::ios::binary);
                std::vector<uint8_t> fileData{
                    std::istreambuf_iterator<char>(ifs),
                    std::istreambuf_iterator<char>()
                };

                int w = 0, h = 0;
                // decode RGBA pixels
                uint8_t* rgba = WebPDecodeRGBA(
                fileData.data(),
                fileData.size(),
                &w, &h
                );

                if (!rgba) {
                    entry["bgcolor"] = "#ffffff";
                } else {
                    uint64_t rSum = 0, gSum = 0, bSum = 0;
                    int pxCount = w * h;
                    for (int i = 0; i < pxCount; ++i) {
                        rSum += rgba[4*i + 0];
                        gSum += rgba[4*i + 1];
                        bSum += rgba[4*i + 2];
                    }
                    WebPFree(rgba);

                    auto inv = [&](uint64_t sum) {
                        int avg = int(sum / pxCount);
                        avg = std::clamp(avg, 0, 255);
                        return 255 - avg;
                    };

                    int r = inv(rSum), g = inv(gSum), b = inv(bSum);

                    // reduce saturation by blending toward gray
                    float grey = r * 0.299f + g * 0.587f + b * 0.114f;
                    float satFactor = 0.5f; // 0 = full gray, 1 = original color
                    int rSat = std::clamp<int>(int(grey + (r - grey) * satFactor + 0.5f), 0, 255);
                    int gSat = std::clamp<int>(int(grey + (g - grey) * satFactor + 0.5f), 0, 255);
                    int bSat = std::clamp<int>(int(grey + (b - grey) * satFactor + 0.5f), 0, 255);
                    r = rSat; g = gSat; b = bSat;

                    std::ostringstream oss;
                    oss << '#' 
                        << std::hex << std::setw(2) << std::setfill('0') << (r & 0xFF)
                        << std::setw(2) << (g & 0xFF)
                        << std::setw(2) << (b & 0xFF);
                    entry["bgcolor"] = oss.str();
                }
            }   // ---------- End of background color computation ---------- //

            ordered_json meta = ordered_json::object();
            if (lang == "en") {
                meta["title"]       = std::string("Zhang Zikang ") + it.title;
                meta["description"] = std::string("Zhang Zikang presented his artworks at ") + it.title +
                                        " in " + it.location + " from " + sStart + " to " + sEnd;
                meta["keywords"]    = std::string("Zhang, Zikang, exhibition, ") + it.title;
            } else {
                meta["title"]       = std::string("张子康 ") + it.title;
                meta["description"] = std::string("张子康于") + sStart + "至" + sEnd +
                                        "在" + it.location + "参加" + it.title + "并展出其艺术作品";
                meta["keywords"]    = std::string("张子康, 展览, ") + it.title;
            }
            entry["metadata"] = meta;

            ordered_json detailObj = ordered_json::object();
            detailObj["title"]    = it.title;
            detailObj["img"]      = "/assets/exhibitions/image/" + it.imageName + ".webp";
            detailObj["alt"]      = it.title;
            detailObj["location"] = it.location;
            detailObj["dates"]    = sStart + " - " + sEnd;
            if (!it.detailImgs.is_null()) detailObj["detailImgs"] = it.detailImgs;
            entry["detail"] = ordered_json::array({ detailObj });

            jAll[it.imageName] = entry;
            yearGroups[year][it.imageName] = entry;
        }

        auto writeJson = [&](const std::string& path, const ordered_json& j) {
            std::ofstream out(path);
            if (!out) { std::cerr<<"Failed to write: "<<path<<std::endl; std::exit(1);}  
            out << std::setw(2) << j;
        };

        writeJson(outDir + lang + ".json", jAll);
        for (auto& [yr, group] : yearGroups) {
            writeJson(outDir + lang + "_" + std::to_string(yr) + ".json", group);
        }
    }
    return 0;
}
