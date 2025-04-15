#include <iostream>
#include <fstream>
#include <string>
#include <thread>
#include <chrono>
#include <filesystem>
#include <windows.h>
#include <cstdint> // For intptr_t

namespace fs = std::filesystem;

// Wait until prng-service.txt contains a valid integer.
int waitForRandomNumber(const std::string& filename) {
    int number = -1;
    while (true) {
        std::ifstream inFile(filename);
        std::string content;
        std::getline(inFile, content);
        inFile.close();

        try {
            number = std::stoi(content);
            break;
        } catch (...) {
            std::this_thread::sleep_for(std::chrono::milliseconds(200));
        }
    }
    return number;
}

// Wait until image-service.txt contains a valid image path.
std::string waitForImagePath(const std::string& filename) {
    std::string path;
    while (true) {
        std::ifstream inFile(filename);
        std::getline(inFile, path);
        inFile.close();

        // Ensure that the path contains "images/pokemon/" to confirm it's valid.
        if (!path.empty() && path.find("images/pokemon/") != std::string::npos)
            break;
        std::this_thread::sleep_for(std::chrono::milliseconds(200));
    }
    return path;
}

int main() {
    std::cout << "Press ENTER to get a random Pokemon image, or type 'q' to quit." << std::endl;
    std::string input;

    while (true) {
        std::getline(std::cin, input);
        if (input == "q") break;

        // Step 1: Request a random number by writing "run" to prng-service.txt.
        {
            std::ofstream outFile("prng-service.txt", std::ofstream::trunc);
            outFile << "run" << std::endl;
        }

        int randomIndex = waitForRandomNumber("prng-service.txt");
        std::cout << "[UI] Received random number: " << randomIndex << std::endl;

        // Step 2: Send the random number to the Image Service.
        {
            std::ofstream outFile("image-service.txt", std::ofstream::trunc);
            outFile << randomIndex << std::endl;
        }

        std::string imagePath = waitForImagePath("image-service.txt");
        fs::path absPath = fs::absolute(imagePath);
        std::cout << "\n[UI] Selected image: " << absPath.string() << "\n" << std::endl;

        // Step 3: Open the image using the default image viewer.
        HINSTANCE result = ShellExecuteA(NULL, "open", absPath.string().c_str(), NULL, NULL, SW_SHOWNORMAL);
        // Convert result to intptr_t to safely compare.
        if (reinterpret_cast<std::intptr_t>(result) <= 32) {
            std::cerr << "[UI] ERROR: Failed to open file." << std::endl;
        }
    }

    std::cout << "Goodbye!" << std::endl;
    return 0;
}