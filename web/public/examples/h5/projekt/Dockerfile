FROM gcc:14
WORKDIR /app
COPY main.cpp SensorLog.cpp SensorLog.hpp ./
RUN g++ -std=c++20 -Wall -Wextra -Wpedantic -O2 main.cpp SensorLog.cpp -o sensorlog
COPY measurements.csv ./
ENTRYPOINT ["/app/sensorlog"]
CMD ["/app/measurements.csv"]
