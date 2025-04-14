// File: manage/generate_year_pages.cpp

#include <filesystem>
#include <fstream>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>
#include <algorithm>
#include <cctype>

namespace fs = std::filesystem;

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

// Simple JSON array parser for [2025,2024,...]
std::vector<std::string> parseYears(const std::string& s) {
    std::vector<std::string> years;
    std::string num;
    for (char c : s) {
        if (std::isdigit(c)) {
            num.push_back(c);
        } else if (!num.empty()) {
            years.push_back(num);
            num.clear();
        }
    }
    if (!num.empty()) years.push_back(num);
    return years;
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

int main() {
    // ---- updated input/output dirs ----
    const fs::path YEARS_JSON        = "../input/years.json";
    const fs::path TEMPLATE_DIR      = "../input/sample_year_page";
    const fs::path WORKS_OUTPUT_DIR  = "../output"; 
    // (change WORKS_OUTPUT_DIR back to "../src/app/(content)/works" for real)

    try {
        // 1) Read the years JSON
        auto yearsJson = readFile(YEARS_JSON);
        auto years = parseYears(yearsJson);
        if (years.empty()) {
            std::cerr << "No years found in JSON\n";
            return 1;
        }

        // 2) Read the sample page.tsx template
        fs::path templatePath = TEMPLATE_DIR / "page.tsx";
        auto tmpl = readFile(templatePath);

        // 3) Locate the sample [workId] folder
        fs::path sampleWorkIdDir = TEMPLATE_DIR / "[workId]";
        if (!fs::exists(sampleWorkIdDir) || !fs::is_directory(sampleWorkIdDir)) {
            throw std::runtime_error("Missing input folder: " + sampleWorkIdDir.string());
        }

        // 4) For each year, generate the folder, the page.tsx, and copy [workId]
        for (auto& year : years) {
            fs::path yearDir = WORKS_OUTPUT_DIR / year;
            fs::remove_all(yearDir);
            fs::create_directories(yearDir);

            // 4a) Generate page.tsx with your minor tweaks
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

            // 4b) Copy the sample [workId] folder into this year's folder
            fs::copy(
                sampleWorkIdDir,
                yearDir / "[workId]",
                fs::copy_options::recursive
            );

            std::cout << "Generated folder for year " << year << "\n";
        }

        std::cout << "All done!\n";
    }
    catch (const std::exception& ex) {
        std::cerr << "Error: " << ex.what() << "\n";
        return 1;
    }
    return 0;
}
