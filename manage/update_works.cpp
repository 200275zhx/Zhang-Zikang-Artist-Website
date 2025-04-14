// File: manage/generate_all.cpp

#include <filesystem>
#include <fstream>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>
#include <map>
#include <set>
#include <algorithm>
#include <cctype>

// nlohmann ordered_json for preserving insertion order
#include <nlohmann/json.hpp>
using ordered_json = nlohmann::ordered_json;

namespace fs = std::filesystem;

// --- Utility functions ---

// Read entire file into a string
std::string readFile(const fs::path& p) {
    std::ifstream in(p, std::ios::in);
    if (!in) throw std::runtime_error("Cannot open " + p.string());
    std::ostringstream ss;
    ss << in.rdbuf();
    return ss.str();
}

// Write string to file (creating parent dirs if needed)
void writeFile(const fs::path& p, const std::string& content) {
    fs::create_directories(p.parent_path());
    std::ofstream out(p, std::ios::out);
    if (!out) throw std::runtime_error("Cannot write " + p.string());
    out << content;
}

// Replace all occurrences of `from` in `str` with `to`
void replaceAll(std::string& str,
                const std::string& from,
                const std::string& to) {
    size_t pos = 0;
    while ((pos = str.find(from, pos)) != std::string::npos) {
        str.replace(pos, from.length(), to);
        pos += to.length();
    }
}

// --- Main ---

int main() {
    // Paths are relative to manage/bin when running
    const fs::path INPUT_EN_JSON        = "../input/workinfo_en.json";
    const fs::path INPUT_ZH_JSON        = "../input/workinfo_zh.json";
    const fs::path OUTPUT_JSON_DIR      = "../../src/app/data/works/json";
    const fs::path TEMPLATE_DIR         = "../input/sample_year_page";
    const fs::path WORKS_OUTPUT_DIR     = "../../src/app/[locale]/(content)/works";
    const fs::path NAVBAR_PATH          = "../../src/components/Navbar.tsx";
    const fs::path ROUTING_PATH         = "../../src/i18n/routing.ts";

    // We'll collect all years across both locales
    std::set<std::string, std::greater<>> allYearsSet;

    // Helper lambda to process one locale
    auto processLocale = [&](const std::string& locale) {
        // 1) Read input JSON (array) into ordered_json
        fs::path inPath = (locale == "en" ? INPUT_EN_JSON : INPUT_ZH_JSON);
        std::ifstream inFile(inPath);
        if (!inFile) {
            std::cerr << "Error opening " << inPath << "\n";
            std::exit(1);
        }
        ordered_json inputData;
        inFile >> inputData;
        inFile.close();

        // 2) Write default <locale>.json
        ordered_json defaultOut = ordered_json::object();
        size_t startIndex = 0;
        if (!inputData.empty() && inputData[0].is_array()) startIndex = 1;
        for (size_t i = startIndex; i < inputData.size(); ++i) {
            auto& project = inputData[i];
            if (!project.is_array() || project.size() != 5) continue;
            std::string imageName = project[0].get<std::string>();
            std::string workName  = project[1].get<std::string>();
            std::string year      = project[2].get<std::string>();
            std::string media     = project[3].get<std::string>();
            std::string sizeStr   = project[4].get<std::string>();

            std::string imgPath = "/assets/works/image/" + imageName + ".webp";
            std::string altText = workName + " by Zhang Zikang";
            std::string keywords = "Zhang Zikang, artworks, " + workName + ", traditional painting, Eastern and Western art";

            ordered_json projObj = ordered_json::object();
            projObj["title"] = workName;
            projObj["src"]   = imgPath;
            projObj["alt"]   = altText;

            ordered_json meta = ordered_json::object();
            meta["title"]       = altText;
            meta["description"] = altText;
            meta["keywords"]    = keywords;
            projObj["metadata"] = meta;

            ordered_json detailObj = ordered_json::object();
            detailObj["title"] = workName;
            detailObj["img"]   = imgPath;
            detailObj["year"]  = year;
            detailObj["media"] = media;
            detailObj["size"]  = sizeStr;
            detailObj["alt"]   = altText;
            projObj["detail"] = ordered_json::array({ detailObj });

            defaultOut[imageName] = projObj;
        }
        // Write default JSON
        {
            fs::path outPath = OUTPUT_JSON_DIR / (locale + ".json");
            writeFile(outPath, defaultOut.dump(4));
            std::cout << "Wrote " << outPath << "\n";
        }

        // 3) Group by year
        std::map<std::string, ordered_json, std::greater<>> groups;
        for (size_t i = startIndex; i < inputData.size(); ++i) {
            auto& project = inputData[i];
            if (!project.is_array() || project.size() != 5) continue;
            std::string imageName = project[0].get<std::string>();
            std::string workName  = project[1].get<std::string>();
            std::string year      = project[2].get<std::string>();
            std::string media     = project[3].get<std::string>();
            std::string sizeStr   = project[4].get<std::string>();

            std::string imgPath = "/assets/works/image/" + imageName + ".webp";
            std::string altText = workName + " by Zhang Zikang";
            std::string keywords = "Zhang Zikang, artworks, " + workName + ", traditional painting, Eastern and Western art";

            ordered_json projObj = ordered_json::object();
            projObj["title"] = workName;
            projObj["src"]   = imgPath;
            projObj["alt"]   = altText;
            ordered_json meta = ordered_json::object();
            meta["title"]       = altText;
            meta["description"] = altText;
            meta["keywords"]    = keywords;
            projObj["metadata"] = meta;
            ordered_json detailObj = ordered_json::object();
            detailObj["title"] = workName;
            detailObj["img"]   = imgPath;
            detailObj["year"]  = year;
            detailObj["media"] = media;
            detailObj["size"]  = sizeStr;
            detailObj["alt"]   = altText;
            projObj["detail"] = ordered_json::array({ detailObj });

            groups[year][imageName] = projObj;
        }

        // 4) Write per-year JSON and collect years
        for (auto& [yr, data] : groups) {
            fs::path outPath = OUTPUT_JSON_DIR / (locale + "_" + yr + ".json");
            writeFile(outPath, data.dump(4));
            std::cout << "Wrote " << outPath << "\n";
            allYearsSet.insert(yr);
        }
    };

    // Run for both locales
    processLocale("en");
    processLocale("zh");

    // Build a descending vector of all years
    std::vector<std::string> years(allYearsSet.begin(), allYearsSet.end());

    // --- Generate per-year pages from template ---
    // Read template and sample [workId] folder
    fs::path tmplPath    = TEMPLATE_DIR / "page.tsx";
    fs::path sampleWIDir = TEMPLATE_DIR / "[workId]";
    auto tmpl = readFile(tmplPath);

    for (auto& year : years) {
        fs::path yearDir = WORKS_OUTPUT_DIR / year;
        fs::remove_all(yearDir);
        fs::create_directories(yearDir);

        // Fill in template
        std::string out = tmpl;
        replaceAll(out, "en_2025.json",              "en_" + year + ".json");
        replaceAll(out, "zh_2025.json",              "zh_" + year + ".json");
        replaceAll(out, "Works2025Map",              "Works" + year + "Map");
        replaceAll(out, "` ${t('title')} - 2025`",  "` ${t('title')} - " + year + "`");
        replaceAll(out, "Works2025Map[locale]",      "Works" + year + "Map[locale]");
        replaceAll(out,
                   "pathname: '/works/2025/[workId]'",
                   "pathname: '/works/" + year + "/[workId]'");

        writeFile(yearDir / "page.tsx", out);

        // Copy the [workId] template folder
        fs::copy(sampleWIDir,
                 yearDir / "[workId]",
                 fs::copy_options::recursive);

        std::cout << "Generated page for year " << year << "\n";
    }

    // --- Update Navbar.tsx ---
    {
        auto navText = readFile(NAVBAR_PATH);
        std::istringstream iss(navText);
        std::vector<std::string> lines;
        std::string line;
        while (std::getline(iss, line)) lines.push_back(line);

        // Build new years literal
        std::string joined;
        for (size_t i = 0; i < years.size(); ++i) {
            if (i) joined += ", ";
            joined += years[i];
        }

        // Replace the const years line
        for (auto& ln : lines) {
            if (ln.find("const years") != std::string::npos) {
                size_t indentEnd = ln.find_first_not_of(" \t");
                std::string indent = (indentEnd == std::string::npos)
                                     ? ""
                                     : ln.substr(0, indentEnd);
                ln = indent + "const years = [" + joined + "];";
                break;
            }
        }

        std::ostringstream oss;
        for (size_t i = 0; i < lines.size(); ++i) {
            oss << lines[i];
            if (i + 1 < lines.size()) oss << "\n";
        }
        writeFile(NAVBAR_PATH, oss.str());
        std::cout << "Updated Navbar.tsx\n";
    }

    // --- Update routing.ts with per‑year detail routes, skipping existing ---
    {
        auto text = readFile(ROUTING_PATH);

        // 1) Locate the opening brace of pathnames
        auto posNames  = text.find("pathnames");
        auto braceOpen = text.find('{', posNames);
        if (posNames == std::string::npos || braceOpen == std::string::npos)
            throw std::runtime_error("Cannot find pathnames in routing.ts");

        // 2) Find the '}' that closes the last entry (depth 2→1)
        int depth = 0;
        size_t lastEntryClose = std::string::npos;
        for (size_t i = braceOpen; i < text.size(); ++i) {
            char c = text[i];
            if (c == '{') {
                ++depth;
            } else if (c == '}') {
                --depth;
                if (depth == 1) {
                    lastEntryClose = i;
                } else if (depth == 0) {
                    break;
                }
            }
        }
        if (lastEntryClose == std::string::npos)
            throw std::runtime_error("Could not find last entry close in routing.ts");

        // 3) Build insertion text only for years not already present
        std::ostringstream ins;
        for (auto& year : years) {
            std::string key = "\"/works/" + year + "/[workId]\"";
            if (text.find(key) != std::string::npos) {
                // already present, skip
                continue;
            }
            ins << ",\n"
                << "    \"/works/" << year << "/[workId]\": {\n"
                << "      en: \"/works/" << year << "/[workId]\",\n"
                << "      zh: \"/zuopin/" << year << "/[workId]\"\n"
                << "    }";
        }

        // 4) Insert right after lastEntryClose
        text.insert(lastEntryClose + 1, ins.str());
        writeFile(ROUTING_PATH, text);
        std::cout << "Updated routing.ts with per‑year routes (skipped existing)\n";
    }



    std::cout << "All tasks completed!\n";
    return 0;
}
