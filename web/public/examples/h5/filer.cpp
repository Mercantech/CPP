#include <exception>
#include <fstream>
#include <iostream>
#include <stdexcept>

void writeReport() {
    std::ofstream file{"report.txt"};
    if (!file) {
        throw std::runtime_error{"Rapporten kunne ikke aabnes"};
    }
    file << "sensor,temperature\nVaerksted,23.5\n";
    file.flush(); // Oplev fejl, mens programmet stadig kan reagere paa dem.
    if (!file) {
        throw std::runtime_error{"Rapporten kunne ikke skrives"};
    }
    file.close();
    if (!file) {
        throw std::runtime_error{"Rapporten kunne ikke lukkes korrekt"};
    }
}

int main() {
    try {
        writeReport();
        std::cout << "Skrev report.txt\n";
    } catch (const std::exception& error) {
        std::cerr << error.what() << '\n';
        return 1;
    }
}
