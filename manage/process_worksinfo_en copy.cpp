#include <iostream>
#include <fstream>
#include <nlohmann/json.hpp>

// Use the ordered version to preserve insertion order.
using json = nlohmann::ordered_json;
using namespace std;

int main() {
    const string inputFilename = "../input/workinfo_en.json";
    const string outputFilename = "../../src/app/data/works/json/en.json";

    // Open and parse the input file.
    ifstream inFile(inputFilename);
    if (!inFile) {
        cerr << "[ERROR] Could not open input file: " << inputFilename << endl;
        return 1;
    }

    json inputData;
    try {
        inFile >> inputData;
    } catch (const exception &e) {
        cerr << "[ERROR] Exception reading input JSON: " << e.what() << endl;
        return 1;
    }
    inFile.close();

    // Ensure that the input is an array.
    if (!inputData.is_array()) {
        cerr << "[ERROR] Input JSON must be an array." << endl;
        return 1;
    }

    // Check if the first subarray is a header row ("Image Name", "Work Name", "Year", "Media", "Size")
    size_t startIndex = 0;
    if (!inputData.empty() && inputData[0].is_array()) {
        // skip the header row
        startIndex = 1;
    }

    // Prepare the output JSON as an object.
    json outputData = json::object();

    // Process projects in the same order they appear (do not reverse)
    for (size_t i = startIndex; i < inputData.size(); i++) {
        const auto &project = inputData[i];

        // Validate that the project is an array with exactly 5 elements.
        if (!project.is_array() || project.size() != 5) {
            cerr << "[DEBUG] Project at index " << i << " is not a valid array of 5 items. Skipping." << endl;
            continue;
        }

        // Mapping subarray values:
        // Element 0: Image Name (to be used as key and for image path)
        // Element 1: Work Name (used for "title" and alt texts)
        // Element 2: Year
        // Element 3: Media
        // Element 4: Size
        string imageName = project[0].get<string>();
        string workName  = project[1].get<string>();
        string year      = project[2].get<string>();
        string media     = project[3].get<string>();
        string sizeStr   = project[4].get<string>();

        // Construct the strings used in the output.
        string imagePath = "/assets/works/image/" + imageName + ".webp";
        string altText   = workName + " by Zhang Zikang";
        string keywords  = "Zhang Zikang, artworks, " + workName + ", traditional painting, Eastern and Western art";

        // Build the project JSON object with the exact key order.
        json projectObj = json::object();
        // Insert keys in the required order.
        projectObj["title"] = workName;
        projectObj["src"]   = imagePath;
        projectObj["alt"]   = altText;
        
        // Build metadata in order: "title", "description", "keywords"
        json metadata = json::object();
        metadata["title"]       = altText;
        metadata["description"] = altText;
        metadata["keywords"]    = keywords;
        projectObj["metadata"]  = metadata;

        // Build the detail array with one object; keys in the order: "title", "img", "year", "media", "size", "alt"
        json detailObj = json::object();
        detailObj["title"] = workName;
        detailObj["img"]   = imagePath;
        detailObj["year"]  = year;
        detailObj["media"] = media;
        detailObj["size"]  = sizeStr;
        detailObj["alt"]   = altText;
        projectObj["detail"] = json::array({ detailObj });

        // For debugging, print the constructed JSON for this project.
        // cout << "[DEBUG] Constructed JSON for project \"" << imageName << "\":" << endl;
        // cout << projectObj.dump(4) << endl;

        // Insert this project object into the output JSON using imageName as the key.
        outputData[imageName] = projectObj;
    }

    // Debug: Print the complete output JSON before writing to file.
    // cout << "[DEBUG] Final output JSON:" << endl;
    // cout << outputData.dump(4) << endl;

    // Write the output JSON to the file (pretty printed with 4-space indentation).
    ofstream outFile(outputFilename);
    if (!outFile) {
        cerr << "[ERROR] Could not open output file for writing: " << outputFilename << endl;
        return 1;
    }
    outFile << outputData.dump(4);
    outFile.close();

    cout << "[DEBUG] Output JSON written to " << outputFilename << endl;
    return 0;
}
