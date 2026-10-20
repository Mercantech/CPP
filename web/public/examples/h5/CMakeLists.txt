cmake_minimum_required(VERSION 3.20)
project(SensorLab LANGUAGES CXX)

add_executable(sensorlab main.cpp)
target_compile_features(sensorlab PRIVATE cxx_std_20)
set_target_properties(sensorlab PROPERTIES CXX_EXTENSIONS OFF)

if(MSVC)
  target_compile_options(sensorlab PRIVATE /W4 /permissive- /utf-8)
else()
  target_compile_options(sensorlab PRIVATE -Wall -Wextra -Wpedantic)
endif()
