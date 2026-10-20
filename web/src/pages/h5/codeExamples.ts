// De samme eksempler leveres som downloadbare .cpp-filer i public/examples/h5/.
export const objectsCode = String.raw`#include <cmath>
#include <iostream>
#include <stdexcept>
#include <string>
#include <utility>

class Celsius {
public:
    explicit Celsius(double value) : value_{value} {
        if (!std::isfinite(value) || value < -50.0 || value > 150.0) {
            throw std::invalid_argument{"Temperatur uden for sensorens interval"};
        }
    }

    double value() const noexcept { return value_; }

private:
    double value_;
};

struct Measurement {
    int second;
    Celsius temperature;
};

class Sensor {
public:
    Sensor(std::string name, Celsius alarmLimit)
        : name_{std::move(name)}, alarmLimit_{alarmLimit} {
        if (name_.empty()) {
            throw std::invalid_argument{"Sensor skal have et navn"};
        }
    }

    std::string name() const { return name_; }

    bool isAlarm(const Measurement& measurement) const noexcept {
        return measurement.temperature.value() > alarmLimit_.value();
    }

    void setAlarmLimit(Celsius limit) noexcept { alarmLimit_ = limit; }

private:
    std::string name_;
    Celsius alarmLimit_;
};

int main() {
    try {
        Sensor sensor{"Vaerksted", Celsius{25.0}};
        const Measurement reading{10, Celsius{27.5}};
        std::cout << sensor.name() << ": "
                  << (sensor.isAlarm(reading) ? "ALARM" : "OK") << '\n';
        sensor.setAlarmLimit(Celsius{28.0});
        std::cout << "Efter ny graense: "
                  << (sensor.isAlarm(reading) ? "ALARM" : "OK") << '\n';

        const Celsius invalid{200.0};
        std::cout << invalid.value() << '\n'; // Naas aldrig.
    } catch (const std::invalid_argument& error) {
        std::cout << "Afvist: " << error.what() << '\n';
    }
}
`;

export const memoryCode = String.raw`#include <iostream>
#include <memory>
#include <utility>

struct Reading {
    double celsius;
};

void calibrate(Reading& reading, double offset) {
    reading.celsius += offset;
}

void print(const Reading& reading) {
    std::cout << reading.celsius << " C\n";
}

void printIfPresent(const Reading* reading) {
    if (reading != nullptr) {
        print(*reading);
    } else {
        std::cout << "Ingen maaling\n";
    }
}

int main() {
    Reading original{20.0};
    Reading copy = original; // To objekter med hver sin vaerdi.
    Reading& alias = original; // Et andet navn for det samme objekt.
    calibrate(alias, 0.5);
    print(original); // 20.5
    print(copy);     // 20
    printIfPresent(nullptr);

    auto owner = std::make_unique<Reading>(Reading{23.0});
    Reading* observer = owner.get(); // Laan; ejerskabet bliver i owner.
    printIfPresent(observer);

    auto nextOwner = std::move(owner); // Flyt ejerskabet.
    std::cout << std::boolalpha << "owner er tom: " << (owner == nullptr) << '\n';
    print(*nextOwner);
    // observer er stadig gyldig her: nextOwner ejer stadig Reading-objektet.
    // Naar nextOwner destrueres, maa observer ikke bruges igen.
}
`;

export const libraryCode = String.raw`#include <algorithm>
#include <cmath>
#include <iomanip>
#include <iostream>
#include <numeric>
#include <string>
#include <vector>

struct Measurement {
    std::string sensor;
    int second;
    double celsius;
};

int main() {
    std::vector<Measurement> readings{
        {"A", 0, 21.5}, {"B", 1, 24.0},
        {"A", 2, 19.5}, {"test", 3, -999.0}
    };

    const auto rejected = std::erase_if(readings, [](const Measurement& reading) {
        return !std::isfinite(reading.celsius)
            || reading.celsius < -50.0 || reading.celsius > 150.0;
    });

    if (readings.empty()) {
        std::cout << "Ingen gyldige maalinger\n";
        return 0;
    }

    const double alarmLimit = 23.0;
    const auto alarms = std::ranges::count_if(readings,
        [alarmLimit](const Measurement& reading) {
            return reading.celsius > alarmLimit;
        });

    const double sum = std::accumulate(readings.begin(), readings.end(), 0.0,
        [](double total, const Measurement& reading) {
            return total + reading.celsius;
        });

    std::ranges::sort(readings, {}, &Measurement::celsius);
    std::cout << std::fixed << std::setprecision(2);
    std::cout << "Gyldige: " << readings.size() << ", afvist: " << rejected << '\n';
    std::cout << "Gennemsnit: " << sum / static_cast<double>(readings.size()) << '\n';
    std::cout << "Alarmer: " << alarms << '\n';
    for (const auto& reading : readings) {
        std::cout << reading.sensor << ": " << reading.celsius << '\n';
    }
}
`;

export const fileCode = String.raw`#include <exception>
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
`;

export const cmakeCode = String.raw`cmake_minimum_required(VERSION 3.20)
project(SensorLab LANGUAGES CXX)

add_executable(sensorlab main.cpp)
target_compile_features(sensorlab PRIVATE cxx_std_20)
set_target_properties(sensorlab PROPERTIES CXX_EXTENSIONS OFF)

if(MSVC)
  target_compile_options(sensorlab PRIVATE /W4 /permissive- /utf-8)
else()
  target_compile_options(sensorlab PRIVATE -Wall -Wextra -Wpedantic)
endif()
`;

export const projectHeaderCode = String.raw`#pragma once
#include <string>
#include <vector>

struct Measurement {
    std::string sensor;
    int second;
    double celsius;
};

class SensorLog {
public:
    bool add(Measurement measurement);
    const std::vector<Measurement>& readings() const noexcept;

    // TODO: Tilfoej et statistikresultat, der kan udtrykke "ingen data".
    // Overvej std::optional<Statistics> frem for en opdigtet 0-graders maaling.
private:
    std::vector<Measurement> readings_;
};
`;

export const projectModelCode = String.raw`#include "SensorLog.hpp"
#include <cmath>
#include <utility>

bool SensorLog::add(Measurement measurement) {
    const bool validId = !measurement.sensor.empty()
        && measurement.sensor.find_first_not_of(
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-")
            == std::string::npos;
    if (!validId || measurement.second < 0 || !std::isfinite(measurement.celsius)
        || measurement.celsius < -50.0 || measurement.celsius > 150.0) {
        return false;
    }
    readings_.push_back(std::move(measurement));
    return true;
}

const std::vector<Measurement>& SensorLog::readings() const noexcept {
    return readings_;
}
`;

export const projectMainCode = String.raw`#include "SensorLog.hpp"
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
`;

export const projectCmakeCode = String.raw`cmake_minimum_required(VERSION 3.20)
project(SensorLog LANGUAGES CXX)
add_executable(sensorlog main.cpp SensorLog.cpp)
target_compile_features(sensorlog PRIVATE cxx_std_20)
set_target_properties(sensorlog PROPERTIES CXX_EXTENSIONS OFF)
if(MSVC)
  target_compile_options(sensorlog PRIVATE /W4 /permissive- /utf-8)
else()
  target_compile_options(sensorlog PRIVATE -Wall -Wextra -Wpedantic)
endif()
`;

export const projectData = String.raw`sensor,second,celsius
A,0,21.5
B,1,24.0
A,2,19.5
A,3,26.0
B,-1,22.0
B,4,fejl
`;

export const projectDockerCode = String.raw`FROM gcc:14
WORKDIR /app
COPY main.cpp SensorLog.cpp SensorLog.hpp ./
RUN g++ -std=c++20 -Wall -Wextra -Wpedantic -O2 main.cpp SensorLog.cpp -o sensorlog
COPY measurements.csv ./
ENTRYPOINT ["/app/sensorlog"]
CMD ["/app/measurements.csv"]
`;
