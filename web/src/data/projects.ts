export type ProjectFile = {
  name: string
  language: string
  role: string
  code: string
}

/** Uddrag fra Mercantech/H3 Arduino (Oplà IoT Carrier) — undervisningstemplate */
export const TEMPLATE_REPO_URL = 'https://github.com/Mercantech/H3/tree/main/Arduino'

export const oplaProject: ProjectFile[] = [
  {
    name: 'platformio.ini',
    language: 'text',
    role: 'PlatformIO: board (MKR WiFi 1010) + native test-env til pure logic.',
    code: `[env:mkrwifi1010]
platform = atmelsam
board = mkrwifi1010
framework = arduino
lib_deps =
	Arduino_MKRIoTCarrier
	WiFiNINA
	ArduinoHttpClient

; Native unit test (PC): pio test -e native
[env:native]
platform = native
test_framework = unity
build_src_filter = +<temperature_color.cpp>
`,
  },
  {
    name: 'src/main.cpp',
    language: 'cpp',
    role: 'Kun wiring: setup()/loop() læser sensorer og kalder moduler — ingen tung logik.',
    code: `#include <Arduino.h>
#include <Arduino_MKRIoTCarrier.h>

#include "config.h"
#include "display_renderer.h"
#include "environment_sensors.h"
#include "gesture_reader.h"
#include "led_controller.h"
#include "shake_detector.h"
#include "wifi_manager.h"

MKRIoTCarrier carrier;

namespace {
bool shakeModeEnabled = false;
char lastGestureLabel[8] = "-";
unsigned long lastShakeTimestampMs = 0;
unsigned long lastDisplayUpdateMs = 0;
}  // namespace

void setup() {
  Serial.begin(SERIAL_BAUD);
  // initializeCarrier(); renderStartupScreen(...); connectWifi();
}

void loop() {
  carrier.Buttons.update();
  const SensorReading reading = readEnvironmentSensors(carrier);
  // touch, gesture, shake, LEDs …
  const unsigned long nowMs = millis();
  if (nowMs - lastDisplayUpdateMs >= DISPLAY_INTERVAL_MS) {
    lastDisplayUpdateMs = nowMs;
    renderSensorScreen(carrier, reading, /*shake*/ false, lastGestureLabel);
  }
  delay(LOOP_DELAY_MS);
}
`,
  },
  {
    name: 'include/types.h',
    language: 'cpp',
    role: 'Delte datatyper uden hardware — SensorReading kan bruges af flere moduler.',
    code: `#ifndef TYPES_H
#define TYPES_H

struct SensorReading {
  float temperatureCelsius;
  float humidityPercent;
  float pressureKPa;
};

#endif /* TYPES_H */
`,
  },
  {
    name: 'include/config.h',
    language: 'cpp',
    role: 'Projektindstillinger (ingen secrets). Safe to commit.',
    code: `#ifndef CONFIG_H
#define CONFIG_H

#define SERIAL_BAUD 9600
#define DISPLAY_INTERVAL_MS 500
#define SHAKE_THRESHOLD 2.5f
#define LED_BRIGHTNESS 200
#define USE_WIFI 0
#define LOOP_DELAY_MS 30

#endif /* CONFIG_H */
`,
  },
  {
    name: 'include/environment_sensors.h',
    language: 'cpp',
    role: 'Sensor-API: deklaration. Forward-declarer MKRIoTCarrier for at holde headeren let.',
    code: `#ifndef ENVIRONMENT_SENSORS_H
#define ENVIRONMENT_SENSORS_H

#include "types.h"

class MKRIoTCarrier;

SensorReading readEnvironmentSensors(MKRIoTCarrier& carrier);

#endif /* ENVIRONMENT_SENSORS_H */
`,
  },
  {
    name: 'src/environment_sensors.cpp',
    language: 'cpp',
    role: 'Sensor-implementation: hardware-kald samlet ét sted.',
    code: `#include "environment_sensors.h"
#include <Arduino_MKRIoTCarrier.h>

SensorReading readEnvironmentSensors(MKRIoTCarrier& carrier) {
  SensorReading reading;
  reading.temperatureCelsius = carrier.Env.readTemperature();
  reading.humidityPercent = carrier.Env.readHumidity();
  reading.pressureKPa = carrier.Pressure.readPressure();
  return reading;
}
`,
  },
  {
    name: 'include/temperature_color.h',
    language: 'cpp',
    role: 'Pure logic — ingen Arduino-hardware. Kan testes på PC.',
    code: `#ifndef TEMPERATURE_COLOR_H
#define TEMPERATURE_COLOR_H

/** Compute RGB (0–255) from temperature °C: cold = blue, warm = red. */
void temperatureToRgb(float temperatureCelsius, int& red, int& green, int& blue);

#endif /* TEMPERATURE_COLOR_H */
`,
  },
  {
    name: 'src/temperature_color.cpp',
    language: 'cpp',
    role: 'Ren C++: map temperatur til RGB. Bygges i [env:native] til unit tests.',
    code: `#include "temperature_color.h"

void temperatureToRgb(float temperatureCelsius, int& red, int& green, int& blue) {
  if (temperatureCelsius < 15.0f) {
    red = 0;
    green = 50;
    blue = 255;
  } else if (temperatureCelsius < 22.0f) {
    int blend = (int)((temperatureCelsius - 15.0f) * 36.0f);
    red = blend;
    green = 100;
    blue = 255 - blend;
  } else {
    red = 255;
    green = (int)(255.0f - (temperatureCelsius - 22.0f) * 20.0f);
    if (green < 0) green = 0;
    blue = 0;
  }
}
`,
  },
  {
    name: 'src/secrets.h.example',
    language: 'cpp',
    role: 'Skabelon til credentials. Kopiér til secrets.h — commit aldrig den rigtige fil.',
    code: `#ifndef SECRETS_H
#define SECRETS_H

#define WIFI_SSID    "YourNetworkName"
#define WIFI_PASS    "YourWiFiPassword"

#endif /* SECRETS_H */
`,
  },
]

/** Mindre eksempel til før/efter — samme princip som template-moduler */
export const sensorProject = oplaProject
