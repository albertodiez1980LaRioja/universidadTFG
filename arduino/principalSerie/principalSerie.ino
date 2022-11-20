#include <DHT.h>
#include <string.h>

typedef struct
{
  byte code;
  int measurement, measurementMAX, measurementMIN;
  int pins[3];
  int numPins;
  int pinsAnalog[3];
  int numPinsAnalog;
} Tsensor;

typedef struct
{
  byte code;
  int value;
  int isAnalog;
  int pin;
} Toutput;

#define HC_SR501 0
#define VIBRATION_SENSOR 1
#define SOUND_SENSOR 2
#define OBSTACLE_SENSOR 3
#define MQ2_GAS_SENSOR 4
#define RAIN_SENSOR 5
#define OIL_SENSOR 6
#define DHT11_SENSOR 7
#define PHOTOSENSITIVE_SENSOR 8
#define FLAME_SENSOR 9
#define NUM_SENSORS 10

Tsensor globalSensors[] = {
  {0, 0, 0, 0, { -1, -1, -1}, 0, {A0, -1, -1}, 1},
  {1, 0, 0, 0, {6, -1, -1}, 1, { -1, -1, -1}, 0},
  {2, 0, 0, 0, { -1, -1, -1}, 0, {A1, -1, -1}, 1},
  {3, 0, 0, 0, {2, -1, -1}, 1, { -1, -1, -1}, 0},
  {4, 0, 0, 0, { -1, -1, -1}, 0, {A2, -1, -1}, 1},
  {5, 0, 0, 0, { -1, -1, -1}, 1, {A3, -1, -1}, 0},
  {6, 0, 0, 0, { -1, -1, -1}, 1, {A4, -1, -1}, 1},
  {7, 0, 0, 0, {3, -1, -1}, 1, { -1, -1, -1}, 0},
  {8, 0, 0, 0, {4, -1, -1}, 1, { -1, -1, -1}, 0},
  {9, 0, 0, 0, {5, -1, -1}, 1, { -1, -1, -1}, 0},
};

#define NUM_OUTPUTS 4
Toutput globalOutputs[] = {
  {1, 1, 0, 7},
  {1, 1, 0, 8},
  {1, 1, 0, 9},
  {1, 1, 0, 10},
};

void readSensors();
void resetSensors();

float DHT11reads[2];


class RBconnection
{
    unsigned int time;

  public:
    RBconnection();
    void wait();
    void begin();
    void calculateCheckSum(byte *hightByte, byte *lowByte, byte *buffer, int lenght);
    void intToBytes(byte *hightByte, byte *lowByte, int integer);
    char *getActionFromRaspberry(String llegado);
    char *sendValues();
};

void RBconnection::begin()
{
  time = millis();
}

RBconnection::RBconnection()
{
}

char *RBconnection::getActionFromRaspberry(String llegado) {
  char text[300];
  if (llegado.length() > 12)
  {
    int fail = 0;
    unsigned int activate = llegado.charAt(0);
    if (activate >= '0')
      activate = activate - '0';
    else
      fail = 1;
    unsigned int outputs[50];
    unsigned int checksumCalculated = activate + '0';
    for (int i = 0; i < NUM_OUTPUTS && fail == 0; i++)
    {
      outputs[i] = llegado.charAt(2 + i * 2);
      if (outputs[i] >= '0')
      {
        outputs[i] = outputs[i] - '0';
        checksumCalculated += outputs[i];
      }
      else
        fail = 1;
    }
    unsigned int checksumLlegado = llegado.charAt(10);
    if (checksumLlegado == checksumCalculated && activate == 1 && fail == 0)
    {
      for (int i = 0; i < NUM_OUTPUTS; i++)
      {
        if (outputs[i] == 1)
          globalOutputs[i].value = 0; // 0 is activated
        else
          globalOutputs[i].value = 1;
      }
      for (int i = 0; i < NUM_OUTPUTS; i++)
      {
        if (globalOutputs[i].value)
          digitalWrite(globalOutputs[i].pin, HIGH);
        else
          digitalWrite(globalOutputs[i].pin, LOW);
      }
    }
  }
  this->sendValues();
  return (char *)("The action is realized \n\0");
}

char *RBconnection::sendValues() {
  char text[200];
  int checksum = globalSensors[HC_SR501].measurementMAX +
                 globalSensors[VIBRATION_SENSOR].measurementMAX +
                 globalSensors[SOUND_SENSOR].measurementMAX +
                 globalSensors[OBSTACLE_SENSOR].measurementMIN +
                 globalSensors[MQ2_GAS_SENSOR].measurementMAX +
                 globalSensors[RAIN_SENSOR].measurementMAX +
                 globalSensors[OIL_SENSOR].measurementMAX +
                 globalSensors[PHOTOSENSITIVE_SENSOR].measurementMIN +
                 globalSensors[FLAME_SENSOR].measurementMIN +
                 (int)(DHT11reads[0]) +
                 (int)(DHT11reads[1]);
  sprintf(text, "%d %d %d %d %d %d %d %d %d %d %d %d \n\0",
          globalSensors[HC_SR501].measurementMAX,
          globalSensors[VIBRATION_SENSOR].measurementMAX,
          globalSensors[SOUND_SENSOR].measurementMAX,
          globalSensors[OBSTACLE_SENSOR].measurementMIN,
          globalSensors[MQ2_GAS_SENSOR].measurementMAX,
          globalSensors[RAIN_SENSOR].measurementMAX,
          globalSensors[OIL_SENSOR].measurementMAX,
          globalSensors[PHOTOSENSITIVE_SENSOR].measurementMIN,
          globalSensors[FLAME_SENSOR].measurementMIN,
          (int)(DHT11reads[0]),
          (int)(DHT11reads[1]),
          checksum);
  
  Serial.println(text);
  return (char *)("Sended");
}

void RBconnection::wait()
{
  char *text;
  if (Serial.available() > 0)
  {
    String llegado = Serial.readString();
    if (llegado.length() > 12)
    {
      int fail = 0;
      unsigned int activate = llegado.charAt(0);
      if (activate == '0' || activate == '1') {
        activate = activate - '0';
        text = this->getActionFromRaspberry(llegado);
        //Serial.println(text);
      }
      else if (llegado.c_str()[0]=='G' ) {
        text = this->sendValues();
        resetSensors();
        readSensors(); // reset some reads
        //Serial.println(text);
      }
      else{
        //Serial.println("Mensaje no reconocido %s",llegado.c_str());
        Serial.println(llegado.c_str());
      }
    }
  }
  delay(100);
}



#define DHTTYPE DHT11
DHT dht(globalSensors[DHT11_SENSOR].pins[0], DHTTYPE);

RBconnection connection;

void setup()
{
  Serial.begin(9600); // conf. velocidad del monitor Serial
  while (!Serial) {}  ; // wait for serial port to connect. Needed for native USB
  for (int i = 0; i < NUM_SENSORS; i++)
  {
    for (int i2 = 0; i2 < globalSensors[i].numPins; i2++)
      pinMode(globalSensors[i].pins[i2], INPUT);
    for (int i2 = 0; i2 < globalSensors[i].numPinsAnalog; i2++)
      pinMode(globalSensors[i].pinsAnalog[i2], INPUT);
  }
  for (int i = 0; i < NUM_OUTPUTS; i++)
    pinMode(globalOutputs[i].pin, OUTPUT);
  for (int i = 0; i < NUM_OUTPUTS; i++)
  {
    if (globalOutputs[i].value)
      digitalWrite(globalOutputs[i].pin, HIGH);
    else
      digitalWrite(globalOutputs[i].pin, LOW);
  }
  dht.begin();
  connection.begin();
  resetSensors(); // read hdt11
  readSensors();
}

void readSensor_ONE_PIN_DIGITAL(Tsensor *sensor)
{
  int read = digitalRead(sensor->pins[0]);
  if (read == HIGH)
  {
    sensor->measurement = 1;
    sensor->measurementMAX = 1;
  }
  else
  {
    sensor->measurement = 0;
    sensor->measurementMIN = 0;
  }
}

void readSensor_ONE_PIN_ANALOG(Tsensor *sensor)
{
  int read = analogRead(sensor->pinsAnalog[0]);
  if (read > sensor->measurementMAX)
    sensor->measurementMAX = read;
  if (read < sensor->measurementMIN)
    sensor->measurementMIN = read;
  sensor->measurement = read;
}

void readSensor_DHT11(Tsensor *sensor)
{
  // Leemos la humedad relativa
  float h = dht.readHumidity();
  // Leemos la temperatura en grados centígrados (por defecto)
  float t = dht.readTemperature();
  // Leemos la temperatura en grados Fahreheit
  float f = dht.readTemperature(true);

  // Comprobamos si ha habido algún error en la lectura
  if (isnan(h) || isnan(t) || isnan(f))
  {
    return;
  }

  // Calcular el índice de calor en Fahreheit
  float hif = dht.computeHeatIndex(f, h);
  // Calcular el índice de calor en grados centígrados
  float hic = dht.computeHeatIndex(t, h, false);
  DHT11reads[0] = h;
  DHT11reads[1] = t;
}


void resetSensors() {
  readSensor_DHT11(&globalSensors[DHT11_SENSOR]);
  for (int i = 0; i < NUM_SENSORS; i++)
  {
    if (i != DHT11_SENSOR)
    {
      if (i == VIBRATION_SENSOR || i == OBSTACLE_SENSOR || i == PHOTOSENSITIVE_SENSOR || i == FLAME_SENSOR)
      {
        globalSensors[i].measurementMIN = 1;
        globalSensors[i].measurementMAX = 0;
      }
      else
      {
        globalSensors[i].measurementMIN = 2000;
        globalSensors[i].measurementMAX = 0;
      }
    }
  }
}

void readSensors()
{
  readSensor_ONE_PIN_ANALOG(&globalSensors[HC_SR501]);
  readSensor_ONE_PIN_DIGITAL(&globalSensors[VIBRATION_SENSOR]);
  readSensor_ONE_PIN_ANALOG(&globalSensors[SOUND_SENSOR]);
  readSensor_ONE_PIN_DIGITAL(&globalSensors[OBSTACLE_SENSOR]);
  readSensor_ONE_PIN_DIGITAL(&globalSensors[PHOTOSENSITIVE_SENSOR]);
  readSensor_ONE_PIN_DIGITAL(&globalSensors[FLAME_SENSOR]);
  readSensor_ONE_PIN_ANALOG(&globalSensors[MQ2_GAS_SENSOR]);
  readSensor_ONE_PIN_ANALOG(&globalSensors[OIL_SENSOR]);
  readSensor_ONE_PIN_ANALOG(&globalSensors[RAIN_SENSOR]);
}

void loop()
{
  readSensors();
  connection.wait();
}
