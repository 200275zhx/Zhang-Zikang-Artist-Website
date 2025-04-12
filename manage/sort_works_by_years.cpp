// sort_works_by_years.cpp
#include <iostream>
#include <fstream>
#include <string>
#include <map>
#include <nlohmann/json.hpp>  // Make sure this header is available in your include folder

using json = nlohmann::json;

int main() {
    // Define file names (input and output). Output files will be placed in the parent directory.
    const std::string INPUTFILE_NAME = "../workinfo.json";
    const std::string OUTPUTFILE_PREFIX = "../output/workdata_";

    // Open the input JSON file
    std::ifstream inputFile(INPUTFILE_NAME);
    if (!inputFile.is_open()) {
        std::cerr << "Error: Could not open input file " << INPUTFILE_NAME << std::endl;
        return 1;
    }

    // Parse the JSON file into a JSON object
    json workData;
    try {
        inputFile >> workData;
    } catch (std::exception &e) {
        std::cerr << "Error parsing JSON: " << e.what() << std::endl;
        return 1;
    }
    inputFile.close();

    // The input JSON file is expected to be an array.
    if (!workData.is_array()) {
        std::cerr << "Error: Input JSON is not an array." << std::endl;
        return 1;
    }

    // We expect the first row to be the header row.
    // Header row: ["Image Name", "Work Name", "Year", "Media", "Size"]
    size_t startIndex = 0;
    if (!workData.empty() && workData[0].is_array()) {
        // Skip the header row. (If desired, you could verify header content here.)
        startIndex = 1;
    }

    // Create a map to group the works by year.
    // Key: string year, Value: json object where each key is the image name and value is the formatted work object.
    std::map<std::string, json> groups;

    // Process each data row in the input JSON
    for (size_t i = startIndex; i < workData.size(); ++i) {
        if (!workData[i].is_array())
            continue; // skip non-array entries

        // Check that this row has at least 5 items.
        if (workData[i].size() < 5) {
            std::cerr << "Warning: Row " << i << " does not contain enough fields." << std::endl;
            continue;
        }

        // Extract each field from the row.
        std::string imageName, workName, year, media, sizeStr;
        try {
            imageName = workData[i][0].get<std::string>();
            workName  = workData[i][1].get<std::string>();
            year      = workData[i][2].get<std::string>();
            media     = workData[i][3].get<std::string>();
            sizeStr   = workData[i][4].get<std::string>();
        } catch (std::exception &e) {
            std::cerr << "Error reading row " << i << ": " << e.what() << std::endl;
            continue;
        }

        // Prepare the formatted object using the required structure.
        json formattedWork = {
            {"title", workName},
            {"src", "/assets/works/image/" + imageName + ".webp"},
            {"alt", workName + " by Zhang Zikang"},
            {"metadata", {
                {"title", workName + " by Zhang Zikang"},
                {"description", workName + " by Zhang Zikang"},
                {"keywords", "Zhang Zikang, artworks, " + workName + ", traditional painting, Eastern and Western art"}
            }},
            {"detail", json::array({
                {
                    {"title", workName},
                    {"img", "/assets/works/image/" + imageName + ".webp"},
                    {"year", year},
                    {"media", media},
                    {"size", sizeStr},
                    {"alt", workName + " by Zhang Zikang"}
                }
            })}
        };

        // If this year hasn't been seen before, create a new json object for this group.
        if (groups.find(year) == groups.end()) {
            groups[year] = json::object();
        }
        // Insert the formatted work into the group under the key imageName.
        groups[year][imageName] = formattedWork;
    }

    // For each distinct year, write the corresponding JSON object to an output file.
    for (const auto &pair : groups) {
        const std::string &year = pair.first;
        const json &groupData = pair.second;
        // Build output filename: "../output/workdata_<year>.json"
        std::string filename = OUTPUTFILE_PREFIX + year + ".json";
        std::ofstream outputFile(filename);
        if (!outputFile.is_open()) {
            std::cerr << "Error: Could not open output file " << filename << std::endl;
            continue;
        }
        // Write the JSON to file with an indentation of 4 spaces.
        outputFile << groupData.dump(4);
        outputFile.close();
        std::cout << "Wrote " << filename << " (" << groupData.size() << " entries)" << std::endl;
    }

    return 0;
}
