#pragma once
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
