#include <algorithm>
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
