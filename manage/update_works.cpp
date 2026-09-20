// Build (from the repository root):
//   g++ -std=c++17 -static -static-libgcc -static-libstdc++ manage/update_works.cpp -Imanage/include -o manage/bin/update_works.exe
//
// Run: manage/bin/update_works.exe
//
// Paths resolve from the executable's own location, so the tool can be run
// from any working directory.

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
#include <project_paths.hpp>
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

int main(int argc, char** argv) {
    (void)argc;
    // Paths resolve from the executable's own location, so the tool runs from
    // any working directory and on any checkout.
    const fs::path ROOT                 = manage::projectRoot(argv[0]);
    const fs::path INPUT_EN_JSON        = ROOT / "manage/input/workinfo_en.json";
    const fs::path INPUT_ZH_JSON        = ROOT / "manage/input/workinfo_zh.json";
    const fs::path OUTPUT_JSON_DIR      = ROOT / "src/app/data/works/json";
    const fs::path TEMPLATE_DIR         = ROOT / "manage/input/sample_year_page";
    const fs::path WORKS_OUTPUT_DIR     = ROOT / "src/app/[locale]/(content)/works";
    const fs::path NAVBAR_PATH          = ROOT / "src/components/Navbar.tsx";
    const fs::path MOBILENAVBAR_PATH    = ROOT / "src/components/MobileNavbar.tsx";
    const fs::path PATHNAMES_PATH       = ROOT / "src/i18n/pathnames.js";

    // We'll collect all years across both locales
    std::set<std::string, std::greater<>> allYearsSet;

    // Builds one work entry. Both the flat and the per-year passes go through
    // this, so the two can no longer drift apart. Chinese entries get Chinese
    // metadata; the description carries medium, size and year so the search
    // snippet says something the title does not.
    auto buildWork = [](const std::string& locale,
                        const std::string& imageName,
                        const std::string& workName,
                        const std::string& year,
                        const std::string& media,
                        const std::string& sizeStr) {
        std::string imgPath = "/assets/works/image/" + imageName + ".webp";

        std::string label, description, keywords;
        if (locale == "zh") {
            label       = "张子康 《" + workName + "》";
            description = "张子康作品《" + workName + "》，" + media + "，" + sizeStr + "，" + year + "年";
            keywords    = "张子康, 艺术作品, " + workName + ", 传统绘画, 东西方艺术";
        } else {
            label       = workName + " by Zhang Zikang";
            description = label + " — " + media + ", " + sizeStr + ", " + year;
            keywords    = "Zhang Zikang, artworks, " + workName + ", traditional painting, Eastern and Western art";
        }

        ordered_json projObj = ordered_json::object();
        projObj["title"] = workName;
        projObj["src"]   = imgPath;
        projObj["alt"]   = label;

        ordered_json meta = ordered_json::object();
        meta["title"]       = label;
        meta["description"] = description;
        meta["keywords"]    = keywords;
        projObj["metadata"] = meta;

        ordered_json detailObj = ordered_json::object();
        detailObj["title"] = workName;
        detailObj["img"]   = imgPath;
        detailObj["year"]  = year;
        detailObj["media"] = media;
        detailObj["size"]  = sizeStr;
        detailObj["alt"]   = label;
        projObj["detail"] = ordered_json::array({ detailObj });

        return projObj;
    };

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

            ordered_json projObj = buildWork(locale, imageName, workName, year, media, sizeStr);

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

            ordered_json projObj = buildWork(locale, imageName, workName, year, media, sizeStr);

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
    auto detailTmpl = readFile(sampleWIDir / "page.tsx");

    for (auto& year : years) {
        fs::path yearDir = WORKS_OUTPUT_DIR / year;
        fs::remove_all(yearDir);
        fs::create_directories(yearDir);

        // Fill in template
        // The per-year page files are thin wrappers around works/_shared/*,
        // so the only year token in the template is the literal 2025.
        std::string out = tmpl;
        replaceAll(out, "2025", year);

        writeFile(yearDir / "page.tsx", out);

        // The [workId] wrapper is year-scoped too (it imports that year's JSON),
        // so it needs the same substitution rather than a verbatim copy.
        std::string detailOut = detailTmpl;
        replaceAll(detailOut, "2025", year);
        writeFile(yearDir / "[workId]" / "page.tsx", detailOut);

        std::cout << "Generated page for year " << year << "\n";
    }

    {
        // --- Update Navbar.tsx ---
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
    
        // Replace the const years line in Navbar.tsx
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
            oss << lines[i] << "\n";
        }
        writeFile(NAVBAR_PATH, oss.str());
        std::cout << "Updated Navbar.tsx\n";
    
        // --- Update MobileNavbar.tsx ---
        auto mobileNavText = readFile(MOBILENAVBAR_PATH);
        std::istringstream issMobile(mobileNavText);
        std::vector<std::string> mobileLines;
        while (std::getline(issMobile, line)) {
            mobileLines.push_back(line);
        }
    
        // Reuse the same literal (or recalc if needed)
        std::string mobileJoined;
        for (size_t i = 0; i < years.size(); ++i) {
            if (i) mobileJoined += ", ";
            mobileJoined += years[i];
        }
    
        // Replace the const years line in MobileNavbar.tsx
        for (auto& ln : mobileLines) {
            if (ln.find("const years") != std::string::npos) {
                size_t indentEnd = ln.find_first_not_of(" \t");
                std::string indent = (indentEnd == std::string::npos)
                                         ? ""
                                         : ln.substr(0, indentEnd);
                ln = indent + "const years = [" + mobileJoined + "];";
                break;
            }
        }
    
        std::ostringstream ossMobile;
        for (size_t i = 0; i < mobileLines.size(); ++i) {
            ossMobile << mobileLines[i] << "\n";
        }
        writeFile(MOBILENAVBAR_PATH, ossMobile.str());
        std::cout << "Updated MobileNavbar.tsx\n";
    }    

    // --- Update pathnames.js with per-year listing + detail routes, skipping existing ---
    {
        auto text = readFile(PATHNAMES_PATH);

        // Read the Chinese /works segment out of the file rather than hardcoding
        // it, so a generated route can never drift from the real slug again.
        std::string zhWorks = "/zuo-pin";
        auto worksKey = text.find("\"/works\": {");
        if (worksKey != std::string::npos) {
            auto zhPos = text.find("zh:", worksKey);
            if (zhPos != std::string::npos) {
                auto q1 = text.find('"', zhPos);
                auto q2 = (q1 == std::string::npos) ? std::string::npos : text.find('"', q1 + 1);
                if (q2 != std::string::npos) zhWorks = text.substr(q1 + 1, q2 - q1 - 1);
            }
        }

        // The map is closed by the last "};" before the module.exports line.
        auto exportsPos = text.find("module.exports");
        if (exportsPos == std::string::npos)
            throw std::runtime_error("Cannot find module.exports in pathnames.js");
        auto closePos = text.rfind("};", exportsPos);
        if (closePos == std::string::npos)
            throw std::runtime_error("Cannot find the end of the pathnames map");

        std::ostringstream ins;
        for (auto& year : years) {
            std::string baseKey = "\"/works/" + year + "\":";
            if (text.find(baseKey) == std::string::npos) {
                ins << "  \"/works/" << year << "\": {\n"
                    << "    en: \"/works/" << year << "\",\n"
                    << "    zh: \"" << zhWorks << "/" << year << "\",\n"
                    << "  },\n";
            }
            std::string detailKey = "\"/works/" + year + "/[workId]\":";
            if (text.find(detailKey) == std::string::npos) {
                ins << "  \"/works/" << year << "/[workId]\": {\n"
                    << "    en: \"/works/" << year << "/[workId]\",\n"
                    << "    zh: \"" << zhWorks << "/" << year << "/[workId]\",\n"
                    << "  },\n";
            }
        }

        if (ins.str().empty()) {
            std::cout << "pathnames.js already lists every year\n";
        } else {
            text.insert(closePos, ins.str());
            writeFile(PATHNAMES_PATH, text);
            std::cout << "Updated pathnames.js with per-year routes\n";
        }
    }




    std::cout << "All tasks completed!\n";
    return 0;
}
