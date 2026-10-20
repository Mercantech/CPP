#include "SensorLog.hpp"
#include <fstream>
#include <iostream>
#include <locale>
#include <optional>
#include <sstream>
#include <string>
#include <utility>

template <typename T>
std::optional<T> parseNumber(const std::string& text) {
    std::istringstream input{text};
    input.imbue(std::locale::classic()); // Punktum er decimaltegn i dataformatet.
    T value{};
    if (!(input >> value)) {
        return std::nullopt;
    }
    input >> std::ws;
    if (!input.eof()) {
        return std::nullopt; // Afvis fx 12abc; ikke kun den numeriske begyndelse.
    }
    return value;
}

std::optional<Measurement> parseLine(const std::string& line) {
    const auto first = line.find(',');
    if (first == std::string::npos) {
        return std::nullopt;
    }
    const auto second = line.find(',', first + 1);
    if (second == std::string::npos || line.find(',', second + 1) != std::string::npos) {
        return std::nullopt;
    }
    auto time = parseNumber<int>(line.substr(first + 1, second - first - 1));
    auto temperature = parseNumber<double>(line.substr(second + 1));
    if (!time || !temperature) {
        return std::nullopt;
    }
    return Measurement{line.substr(0, first), *time, *temperature};
}

int main(int argc, char* argv[]) {
    if (argc > 2) {
        std::cerr << "Brug: sensorlog [sti-til-csv]\n";
        return 2;
    }
    const std::string path = argc == 2 ? argv[1] : "measurements.csv";
    std::ifstream file{path};
    if (!file) {
        std::cerr << "Kan ikke aabne: " << path << '\n';
        return 1;
    }

    std::string line;
    const auto removeCarriageReturn = [](std::string& text) {
        if (!text.empty() && text.back() == '\r') {
            text.pop_back();
        }
    };
    if (!std::getline(file, line)) {
        std::cerr << "Mangler CSV-header\n";
        return 1;
    }
    removeCarriageReturn(line);
    if (line != "sensor,second,celsius") {
        std::cerr << "Forventet header: sensor,second,celsius\n";
        return 1;
    }

    SensorLog log;
    std::size_t lineNumber = 1;
    std::size_t rejected = 0;
    while (std::getline(file, line)) {
        ++lineNumber;
        removeCarriageReturn(line);
        auto measurement = parseLine(line);
        if (!measurement || !log.add(std::move(*measurement))) {
            ++rejected;
            std::cerr << "Afvist linje " << lineNumber << '\n';
        }
    }
    if (file.bad()) {
        std::cerr << "Fejl under laesning af filen\n";
        return 1;
    }

    std::cout << "Gyldige: " << log.readings().size()
              << ", afvist: " << rejected << '\n';
    if (log.readings().empty()) {
        std::cout << "Ingen gyldige maalinger\n";
        return 0;
    }
    for (const auto& reading : log.readings()) {
        std::cout << reading.sensor << " @ " << reading.second
                  << " s: " << reading.celsius << " C\n";
    }
    // TODO: Udskriv min, max, gennemsnit og alarmer med graensen 23.0 C.
    // TODO: Tilfoej sensorfilter og eksport uden at blande UI og model.
}
