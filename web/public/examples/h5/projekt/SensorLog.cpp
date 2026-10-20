#include "SensorLog.hpp"
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
