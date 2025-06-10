#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <algorithm>
#include <sstream>
#include <unordered_map>
#include <iomanip>
#include <cstdlib>
#include <nlohmann/json.hpp>

// insertion-ordered JSON
using ordered_json = nlohmann::ordered_json;

struct PublicationItem {
    std::string imageName;
    std::string title;
    std::string type;
    std::string category;
    std::string isbn;
    std::string publisher;
    std::string publicationDate;
    std::string journal;
    std::string source;
};

static const std::unordered_map<std::string,int> monthMap = {
    {"January", 1}, {"February", 2}, {"March", 3}, {"April", 4},
    {"May", 5}, {"June", 6}, {"July", 7}, {"August", 8},
    {"September", 9}, {"October", 10}, {"November", 11}, {"December", 12}
};

// parse "Month Year" in English or "YYYY年M月" in Chinese
static std::pair<int,int> parseMonthYear(const std::string& str) {
    if (str.find("年") != std::string::npos) {
        // Chinese format
        int year = 0, month = 0;
        size_t idx = 0;
        // parse year
        while (idx < str.size() && isdigit(str[idx])) {
            year = year * 10 + (str[idx] - '0');
            idx++;
        }
        // skip non-digits
        while (idx < str.size() && !isdigit(str[idx])) idx++;
        // parse month
        while (idx < str.size() && isdigit(str[idx])) {
            month = month * 10 + (str[idx] - '0');
            idx++;
        }
        return { year, month };
    } else {
        // English format
        std::istringstream ss(str);
        std::string monthWord;
        int year = 0;
        ss >> monthWord >> year;
        auto it = monthMap.find(monthWord);
        int month = (it != monthMap.end()) ? it->second : 0;
        return { year, month };
    }
}

static bool compareByDateDesc(const PublicationItem& a, const PublicationItem& b) {
    auto da = parseMonthYear(a.publicationDate);
    auto db = parseMonthYear(b.publicationDate);
    if (da.first != db.first) return da.first > db.first;
    return da.second > db.second;
}

int main() {
    const std::vector<std::string> langs = { "en", "zh" };
    const std::string inDir  = R"(C:\Users\20027\Local Desktop\AW002\artist-website\manage\input\)";
    const std::string outDir = R"(C:\Users\20027\Local Desktop\AW002\artist-website\src\app\data\publications\json\)";

    for (const auto& lang : langs) {
        const std::string inPath       = inDir + "publicationinfo_" + lang + ".json";
        const std::string outAll       = outDir + lang + ".json";
        const std::string outArticles  = outDir + lang + "_articles.json";
        const std::string outEditions  = outDir + lang + "_editions.json";
        const std::string outInterviews= outDir + lang + "_interviews.json";
        const std::string outMonographs= outDir + lang + "_monographs.json";

        std::ifstream inFile(inPath);
        if (!inFile) {
            std::cerr << "Failed to open input file: " << inPath << std::endl;
            return 1;
        }
        ordered_json raw;
        inFile >> raw;
        inFile.close();

        if (!raw.is_array()) {
            std::cerr << "Input JSON is not an array: " << inPath << std::endl;
            return 1;
        }

        std::vector<PublicationItem> items;
        for (size_t i = 1; i < raw.size(); ++i) {
            const auto& arr = raw[i];
            if (!arr.is_array() || arr.size() < 9) {
                std::cerr << "Invalid row at index " << i << " in " << inPath << std::endl;
                return 1;
            }
            items.push_back({
                arr[0].get<std::string>(), // Image Name
                arr[1].get<std::string>(), // Title
                arr[2].get<std::string>(), // Type
                arr[3].get<std::string>(), // Category
                arr[4].get<std::string>(), // ISBN?
                arr[5].get<std::string>(), // Publisher?
                arr[6].get<std::string>(), // Publication Date
                arr[7].get<std::string>(), // Journal?
                arr[8].get<std::string>()  // Source Publication?
            });
        }

        std::sort(items.begin(), items.end(), compareByDateDesc);

        ordered_json jAll        = ordered_json::object();
        ordered_json jArticles   = ordered_json::object();
        ordered_json jEditions   = ordered_json::object();
        ordered_json jInterviews = ordered_json::object();
        ordered_json jMonographs = ordered_json::object();

        for (const auto& it : items) {
            // Alt text
            std::string alt;
            if (lang == "zh") {
                alt = "张子康 《" + it.title + "》";
            } else {
                alt = it.title + " by Zhang Zikang";
            }

            // Date output format
            auto [yr, mo] = parseMonthYear(it.publicationDate);
            std::string dateOut;
            if (lang == "zh") {
                dateOut = std::to_string(yr) + "年" + std::to_string(mo) + "月";
            } else {
                // reconstruct Month Year from map (reverse lookup)
                for (const auto& kv : monthMap) {
                    if (kv.second == mo) {
                        dateOut = kv.first + " " + std::to_string(yr);
                        break;
                    }
                }
            }

            ordered_json obj = ordered_json::object();
            obj["title"]    = it.title;
            obj["src"]      = "/assets/publications/image/" + it.imageName + ".webp";
            obj["alt"]      = alt;
            if (!it.isbn.empty())      obj["ISBN"]             = it.isbn;
            if (!it.publisher.empty()) obj["publisher"]        = it.publisher;
            if (!it.journal.empty())   obj["journal"]          = it.journal;
            if (!it.source.empty())    obj["sourcePublication"] = it.source;
            obj["date"]     = dateOut;
            obj["category"] = it.category;

            jAll[it.imageName]        = obj;
            if      (it.type == "Article")   jArticles  [it.imageName] = obj;
            else if (it.type == "Edition")   jEditions  [it.imageName] = obj;
            else if (it.type == "Interview") jInterviews[it.imageName] = obj;
            else if (it.type == "Monograph") jMonographs[it.imageName] = obj;
            else {
                std::cerr << "Unknown type: " << it.type << " in " << inPath << std::endl;
                return 1;
            }
        }

        auto writeJson = [&](const std::string& path, const ordered_json& j) {
            std::ofstream out(path);
            if (!out) {
                std::cerr << "Failed to write to: " << path << std::endl;
                std::exit(1);
            }
            out << std::setw(2) << j << std::endl;
        };

        writeJson(outAll,        jAll);
        writeJson(outArticles,   jArticles);
        writeJson(outEditions,   jEditions);
        writeJson(outInterviews, jInterviews);
        writeJson(outMonographs, jMonographs);
    }

    return 0;
}
