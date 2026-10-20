// Arduino UNO R3. Knap mellem pin 2 og GND.
const int BUTTON_PIN = 2;
const int LED_PIN = LED_BUILTIN;
const unsigned long DEBOUNCE_MS = 30UL;

enum class Mode { idle, pulse, alarm };
Mode mode = Mode::idle;
bool ledOn = false;
int lastRaw = HIGH;
int stableButton = HIGH;
unsigned long lastRawChange = 0;
unsigned long lastToggle = 0;

bool readPressEvent(unsigned long now) {
  const int raw = digitalRead(BUTTON_PIN);
  if (raw != lastRaw) {
    lastRawChange = now;
    lastRaw = raw;
  }
  if (now - lastRawChange >= DEBOUNCE_MS && raw != stableButton) {
    stableButton = raw;
    return stableButton == LOW;
  }
  return false;
}

void nextMode(unsigned long now) {
  switch (mode) {
    case Mode::idle:  mode = Mode::pulse; break;
    case Mode::pulse: mode = Mode::alarm; break;
    case Mode::alarm: mode = Mode::idle;  break;
  }
  ledOn = false;
  lastToggle = now;
  digitalWrite(LED_PIN, LOW);
  Serial.println(mode == Mode::idle ? "RO" :
                 mode == Mode::pulse ? "PULS" : "ALARM");
}

void updateLed(unsigned long now) {
  if (mode == Mode::idle) {
    return;
  }
  const unsigned long interval = mode == Mode::pulse ? 500UL : 150UL;
  if (now - lastToggle >= interval) {
    lastToggle = now;
    ledOn = !ledOn;
    digitalWrite(LED_PIN, ledOn ? HIGH : LOW);
  }
}

void setup() {
  Serial.begin(9600);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  Serial.println("RO");
}

void loop() {
  const unsigned long now = millis();
  if (readPressEvent(now)) {
    nextMode(now);
  }
  updateLed(now);
}
