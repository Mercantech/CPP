import BeforeAfter from '../../components/BeforeAfter'
import Callout from '../../components/Callout'
import LessonIntro from '../../components/LessonIntro'
import LessonLayout from '../../components/LessonLayout'

const before1 = `int l = 13;
int b = 2;

void setup() {
  Serial.begin(9600);
  pinMode(l, OUTPUT);
  pinMode(b, INPUT);
}

void loop() {
  int x = digitalRead(b);
  if(x == HIGH) {
    digitalWrite(l, HIGH);
    Serial.println("ON");
  } else {
    digitalWrite(l, LOW);
    Serial.println("OFF");
  }
  delay(100);
}
`

const after1 = `// Constants
const int LED_PIN = 13;
const int BUTTON_PIN = 2;
const int DEBOUNCE_DELAY = 100;

// Function to read button
boolean isButtonPressed() {
  return digitalRead(BUTTON_PIN) == HIGH;
}

// Function to control LED
void setLED(boolean state) {
  digitalWrite(LED_PIN, state ? HIGH : LOW);
  Serial.println(state ? "LED ON" : "LED OFF");
}

void setup() {
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT);
}

void loop() {
  boolean buttonState = isButtonPressed();
  setLED(buttonState);
  delay(DEBOUNCE_DELAY);
}
`

const before2 = `void loop() {
  int v = analogRead(A0);
  float x = v * (5.0 / 1023.0);
  float t = (x - 0.5) * 100.0;
  if(t > 30) {
    digitalWrite(13, HIGH);
  } else {
    digitalWrite(13, LOW);
  }
  Serial.println(t);
  delay(500);
}
`

const after2 = `const int TEMP_PIN = A0;
const int FAN_LED_PIN = 13;
const float TEMP_THRESHOLD = 30.0;
const unsigned long SAMPLE_MS = 500;

float readCelsius() {
  int raw = analogRead(TEMP_PIN);
  float voltage = raw * (5.0 / 1023.0);
  return (voltage - 0.5) * 100.0;
}

void setFanLed(bool on) {
  digitalWrite(FAN_LED_PIN, on ? HIGH : LOW);
}

void setup() {
  Serial.begin(9600);
  pinMode(FAN_LED_PIN, OUTPUT);
}

void loop() {
  float temp = readCelsius();
  setFanLed(temp > TEMP_THRESHOLD);
  Serial.println(temp);
  delay(SAMPLE_MS);
}
`

export function RefaktoreringContent() {
  return (
    <>
      <h1>Praktisk refaktorering</h1>
      <LessonIntro>
        <p>
          Refaktorering ændrer strukturen uden at ændre adfærd. Skift mellem <strong>før</strong> og{' '}
          <strong>efter</strong> — og se hvad der gør koden professionel.
        </p>
      </LessonIntro>

      <h2>Workshop 1: Knap og LED</h2>
      <BeforeAfter
        split
        before={before1}
        after={after1}
        beforeFilename="button_led_messy.cpp"
        afterFilename="button_led_clean.cpp"
        beforeNotes={
          <>
            Korte navne (<code>l</code>, <code>b</code>, <code>x</code>), logic midt i{' '}
            <code>loop()</code>, ingen konstanter.
          </>
        }
        afterNotes={
          <>
            Konstanter i <code>UPPER_SNAKE</code>, funktioner med klare navne,{' '}
            <code>loop()</code> orkestrerer kun.
          </>
        }
      />

      <h2>Workshop 2: Temperaturstyring</h2>
      <BeforeAfter
        split
        before={before2}
        after={after2}
        beforeFilename="temp_messy.cpp"
        afterFilename="temp_clean.cpp"
        beforeNotes={
          <>
            Magiske tal, uklare variabelnavne, alt i <code>loop()</code>.
          </>
        }
        afterNotes={
          <>
            Navngivne konstanter, <code>readCelsius</code> / <code>setFanLed</code>, tydelig
            tærskel.
          </>
        }
      />

      <Callout type="tip">
        <p>
          Facit-retningen er H3-templaten: engelske navne, konstanter i config, data i{' '}
          <code>types.h</code>, logik i moduler, <code>main</code>/<code>loop</code> som tynd
          wiring. Se{' '}
          <a
            href="https://github.com/Mercantech/H3/tree/main/Arduino"
            target="_blank"
            rel="noreferrer"
          >
            Mercantech/H3/Arduino
          </a>
          .
        </p>
      </Callout>
    </>
  )
}

export default function Refaktorering() {
  return (
    <LessonLayout module="h3">
      <RefaktoreringContent />
    </LessonLayout>
  )
}

