#include <cmath>
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
