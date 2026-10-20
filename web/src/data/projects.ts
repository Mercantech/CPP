export type ProjectFile = {
  name: string
  language: string
  role: string
  code: string
}

export const sensorProject: ProjectFile[] = [
  {
    name: 'main.ino',
    language: 'arduino',
    role: 'Sketch-entry: setup() og loop(). Inkluderer headeren og kalder API’et.',
    code: `#include "sensor.h"

void setup() {
  Serial.begin(9600);
  calibrateSensor();
}

void loop() {
  float temp = readTemperature();
  int light = readLightLevel();

  Serial.print("Temperature: ");
  Serial.print(temp);
  Serial.print(" °C, Light: ");
  Serial.println(light);

  delay(1000);
}
`,
  },
  {
    name: 'sensor.h',
    language: 'cpp',
    role: 'Header: prototyper, konstanter og include guard — “indholdsfortegnelsen”.',
    code: `#ifndef SENSOR_H
#define SENSOR_H

#include <Arduino.h>

// Function declarations
float readTemperature();
int readLightLevel();
void calibrateSensor();

// Constants
const int TEMP_PIN = A0;
const int LIGHT_PIN = A1;

#endif
`,
  },
  {
    name: 'sensor.cpp',
    language: 'cpp',
    role: 'Implementation: den faktiske kode. Inkluderer egen header.',
    code: `#include "sensor.h"

float readTemperature() {
  int sensorValue = analogRead(TEMP_PIN);
  float voltage = sensorValue * (5.0 / 1023.0);
  float temperature = (voltage - 0.5) * 100.0;
  return temperature;
}

int readLightLevel() {
  return analogRead(LIGHT_PIN);
}

void calibrateSensor() {
  // Calibration code here
}
`,
  },
]
