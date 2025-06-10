// #include <iostream>
// #include <fstream>
// #include <string>
// #include <vector>
// #include <algorithm>
// #include <sstream>
// #include <iomanip>
// #include <cstdlib>
// #include <nlohmann/json.hpp>

// // use the insertion‐ordered variant
// using ordered_json = nlohmann::ordered_json;

// struct NewsItem {
//     std::string imageName, title, time, location, publicationDate, type, link, description;
// };

// static std::tm parseDate(const std::string& dateStr) {
//     // expects "MM/DD/YYYY"
//     std::tm tmDate = {};
//     std::istringstream ss(dateStr);
//     char slash;
//     int m, d, y;
//     ss >> m >> slash >> d >> slash >> y;
//     tmDate.tm_year = y - 1900;
//     tmDate.tm_mon  = m - 1;
//     tmDate.tm_mday = d;
//     return tmDate;
// }

// static bool compareByDateDesc(const NewsItem& a, const NewsItem& b) {
//     std::tm ta = parseDate(a.publicationDate);
//     std::tm tb = parseDate(b.publicationDate);
//     if (ta.tm_year != tb.tm_year)  return ta.tm_year > tb.tm_year;
//     if (ta.tm_mon  != tb.tm_mon)   return ta.tm_mon  > tb.tm_mon;
//     return ta.tm_mday > tb.tm_mday;
// }

// int main() {
//     const std::string inPath       = R"(C:\Users\20027\Local Desktop\AW002\artist-website\manage\input\newsinfo_en.json)";
//     const std::string outAll       = R"(C:\Users\20027\Local Desktop\AW002\artist-website\src\app\data\news\json\en.json)";
//     const std::string outCurations = R"(C:\Users\20027\Local Desktop\AW002\artist-website\src\app\data\news\json\en_curations.json)";
//     const std::string outExhibs    = R"(C:\Users\20027\Local Desktop\AW002\artist-website\src\app\data\news\json\en_exhibitions.json)";
//     const std::string outInterv    = R"(C:\Users\20027\Local Desktop\AW002\artist-website\src\app\data\news\json\en_interviews.json)";

//     // load input
//     std::ifstream inFile(inPath);
//     if (!inFile) {
//         std::cerr << "Failed to open input file: " << inPath << "\n";
//         return 1;
//     }
//     ordered_json raw;
//     inFile >> raw;
//     inFile.close();

//     if (!raw.is_array()) {
//         std::cerr << "Input JSON is not an array\n";
//         return 1;
//     }

//     // parse into vector, skipping header row
//     std::vector<NewsItem> items;
//     for (size_t i = 1; i < raw.size(); ++i) {
//         auto& arr = raw[i];
//         if (!arr.is_array() || arr.size() < 8) {
//             std::cerr << "Invalid row at index " << i << "\n";
//             return 1;
//         }
//         items.push_back({
//             arr[0].get<std::string>(),
//             arr[1].get<std::string>(),
//             arr[2].get<std::string>(),
//             arr[3].get<std::string>(),
//             arr[4].get<std::string>(),
//             arr[5].get<std::string>(),
//             arr[6].get<std::string>(),
//             arr[7].get<std::string>()
//         });
//     }

//     // sort descending by publicationDate
//     std::sort(items.begin(), items.end(), compareByDateDesc);

//     ordered_json jAll       = ordered_json::object();
//     ordered_json jCuration  = ordered_json::object();
//     ordered_json jExhibit   = ordered_json::object();
//     ordered_json jInterview = ordered_json::object();

//     for (auto& it : items) {
//         std::string alt = "News - Zhang Zikang's " + it.type + " - " + it.title + " - " + it.publicationDate;

//         // build each object with explicit insertion order
//         ordered_json obj = ordered_json::object();
//         obj["title"]       = it.title;
//         obj["src"]         = "/assets/news/" + it.imageName + ".webp";
//         obj["alt"]         = alt;
//         if (!it.time.empty())     obj["time"]     = it.time;
//         if (!it.location.empty()) obj["location"] = it.location;
//         obj["description"] = it.description;
//         obj["metadata"]    = ordered_json::object({
//                                {"title", alt},
//                                {"description", alt}
//                              });
//         obj["link"]        = it.link;

//         jAll[it.imageName] = obj;

//         if      (it.type == "Curation")   jCuration[it.imageName] = obj;
//         else if (it.type == "Exhibition") jExhibit  [it.imageName] = obj;
//         else if (it.type == "Interview")  jInterview[it.imageName] = obj;
//         else {
//             std::cerr << "Unknown type: " << it.type << "\n";
//             return 1;
//         }
//     }

//     auto write = [&](const std::string& path, const ordered_json& j) {
//         std::ofstream out(path);
//         if (!out) {
//             std::cerr << "Failed to write to: " << path << "\n";
//             std::exit(1);
//         }
//         out << std::setw(2) << j << "\n";
//     };

//     write(outAll,       jAll);
//     write(outCurations, jCuration);
//     write(outExhibs,    jExhibit);
//     write(outInterv,    jInterview);

//     return 0;
// }
#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <algorithm>
#include <sstream>
#include <iomanip>
#include <cstdlib>
#include <nlohmann/json.hpp>

// use insertion-ordered variant
using ordered_json = nlohmann::ordered_json;

struct NewsItem {
    std::string imageName;
    std::string title;
    std::string time;
    std::string location;
    std::string publicationDate;
    std::string type;
    std::string link;
    std::string description;
};

static std::tm parseDate(const std::string& dateStr) {
    std::tm tmDate = {};
    std::istringstream ss(dateStr);
    char slash;
    int m, d, y;
    ss >> m >> slash >> d >> slash >> y;
    tmDate.tm_year = y - 1900;
    tmDate.tm_mon  = m - 1;
    tmDate.tm_mday = d;
    return tmDate;
}

static bool compareByDateDesc(const NewsItem& a, const NewsItem& b) {
    std::tm ta = parseDate(a.publicationDate);
    std::tm tb = parseDate(b.publicationDate);
    if (ta.tm_year != tb.tm_year) return ta.tm_year > tb.tm_year;
    if (ta.tm_mon  != tb.tm_mon ) return ta.tm_mon  > tb.tm_mon;
    return ta.tm_mday > tb.tm_mday;
}

int main() {
    const std::vector<std::string> langs = {"en", "zh"};
    for (const auto& lang : langs) {
        const std::string inPath       = R"(C:\Users\20027\Local Desktop\AW002\artist-website\manage\input\newsinfo_)" + lang + ".json";
        const std::string outDir       = R"(C:\Users\20027\Local Desktop\AW002\artist-website\src\app\data\news\json\)";
        const std::string outAll       = outDir + lang + ".json";
        const std::string outCurations = outDir + lang + "_curations.json";
        const std::string outExhibs    = outDir + lang + "_exhibitions.json";
        const std::string outInterv    = outDir + lang + "_interviews.json";

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

        std::vector<NewsItem> items;
        for (size_t i = 1; i < raw.size(); ++i) {
            const auto& arr = raw[i];
            if (!arr.is_array() || arr.size() < 8) {
                std::cerr << "Invalid row at index " << i << " in " << inPath << std::endl;
                return 1;
            }
            items.push_back({
                arr[0].get<std::string>(),
                arr[1].get<std::string>(),
                arr[2].get<std::string>(),
                arr[3].get<std::string>(),
                arr[4].get<std::string>(),
                arr[5].get<std::string>(),
                arr[6].get<std::string>(),
                arr[7].get<std::string>()
            });
        }

        std::sort(items.begin(), items.end(), compareByDateDesc);

        ordered_json jAll       = ordered_json::object();
        ordered_json jCuration  = ordered_json::object();
        ordered_json jExhibit   = ordered_json::object();
        ordered_json jInterview = ordered_json::object();

        for (const auto& it : items) {
            // Determine alt text and metadata based on language
            std::string alt;
            if (lang == "zh") {
                // translate prefix and type
                std::string prefix = "新闻 - 张子康的";
                std::string typeZh;
                if (it.type == "Curation")    typeZh = "策展";
                else if (it.type == "Exhibition") typeZh = "展览";
                else if (it.type == "Interview")  typeZh = "访谈";
                else {
                    std::cerr << "Unknown type: " << it.type << " in " << inPath << std::endl;
                    return 1;
                }
                // extract year only
                std::string year = it.publicationDate.substr(it.publicationDate.find_last_of('/') + 1);
                alt = prefix + typeZh + " - " + it.title + " - " + year;
            } else {
                alt = "News - Zhang Zikang's " + it.type + " - " + it.title + " - " + it.publicationDate;
            }

            ordered_json obj = ordered_json::object();
            obj["title"]       = it.title;
            obj["src"]         = "/assets/news/" + it.imageName + ".webp";
            obj["alt"]         = alt;
            if (!it.time.empty())     obj["time"]     = it.time;
            if (!it.location.empty()) obj["location"] = it.location;
            obj["description"] = it.description;
            obj["metadata"]    = ordered_json::object({
                                   {"title", alt},
                                   {"description", alt}
                                 });
            obj["link"]        = it.link;

            jAll[it.imageName] = obj;
            if      (it.type == "Curation")   jCuration[it.imageName] = obj;
            else if (it.type == "Exhibition") jExhibit  [it.imageName] = obj;
            else if (it.type == "Interview")  jInterview[it.imageName] = obj;
        }

        auto writeJson = [&](const std::string& path, const ordered_json& j) {
            std::ofstream out(path);
            if (!out) {
                std::cerr << "Failed to write to: " << path << std::endl;
                std::exit(1);
            }
            out << std::setw(2) << j << std::endl;
        };

        writeJson(outAll,       jAll);
        writeJson(outCurations, jCuration);
        writeJson(outExhibs,    jExhibit);
        writeJson(outInterv,    jInterview);
    }

    return 0;
}
