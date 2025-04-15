#include <iostream>
#include <fstream>
#include <string>
#include <cstdlib>
#include <ctime>
#include <windows.h>

int main() {
    // Seed the PRNG once at startup.
    std::srand(static_cast<unsigned int>(std::time(nullptr)));
    std::cout << "[PRNG Service] Started. Monitoring prng-service.txt for 'run' command." << std::endl;

    while (true) {
        std::ifstream inFile("prng-service.txt");
        std::string command;
        std::getline(inFile, command);
        inFile.close();

        if (command == "run") {
            int randomNum = std::rand(); // Generate an unbounded random number.
            std::ofstream outFile("prng-service.txt", std::ofstream::trunc);
            outFile << randomNum << std::endl;
            outFile.close();
            std::cout << "[PRNG Service] Generated random number: " << randomNum << std::endl;
        }

        Sleep(500);
    }

    return 0;
}