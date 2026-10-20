#include <iostream>
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
