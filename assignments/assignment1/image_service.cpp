#include <iostream>
#include <fstream>
#include <string>
#include <sstream>
#include <iomanip>
#include <windows.h>

int main() {
    const int totalImages = 721;
    std::cout << "[Image Service] Started. Waiting for index in image-service.txt." << std::endl;

    while (true) {
        std::ifstream inFile("image-service.txt");
        int index = -1;
        if (inFile >> index) {
            inFile.close();

            // Wrap the index within the valid range.
            index = index % totalImages;

            // Construct the full image filename.
            std::ostringstream oss;
            oss << "images/pokemon/" 
                << std::setfill('0') << std::setw(3) << (index + 1) 
                << ".png";
            std::string fullPath = oss.str();

            std::ofstream outFile("image-service.txt", std::ofstream::trunc);
            outFile << fullPath << std::endl;
            outFile.close();

            std::cout << "[Image Service] Resolved file path: " << fullPath << std::endl;
        } else {
            inFile.close();
        }
        Sleep(500);
    }

    return 0;
}