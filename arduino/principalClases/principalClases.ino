
#include <DHT.h>

class Sensor
{
protected:
  int pin_in;

public:
  Sensor(int pin_in);
  virtual void leerValores();
  virtual void resetearValores();
};

Sensor::Sensor(int pin_in)
{
  this->pin_in = pin_in;
}

class Digital : public Sensor
{
  bool valor;
  bool valorMAX;
  bool valorMIN;

public:
  void leerValores();
  void resetearValores();
  bool getValor();
  bool getValorMAX();
  bool getValorMIN();
  Digital(int pin_in) : Sensor(pin_in)
  {
    pinMode(this->pin_in, INPUT);
  }; // el constructor llama al constructor del padre
};

bool Digital::getValorMAX()
{
  return this->valorMAX;
}

bool Digital::getValorMIN()
{
  return this->valorMIN;
}

bool Digital::getValor()
{
  return this->valor;
}

void Digital::resetearValores()
{
  this->valorMAX = false;
  this->valorMIN = true;
}

void Digital::leerValores()
{
  int read = digitalRead(this->pin_in);
  if (read == HIGH)
  {
    this->valor = true;
    this->valorMAX = true;
  }
  else
  {
    this->valor = false;
    this->valorMIN = false;
  }
}

class Analogico : public Sensor
{
  int valor;
  int valorMAX;
  int valorMIN;

public:
  void leerValores();
  void resetearValores();
  int getValor();
  int getValorMAX();
  int getValorMIN();
  Analogico(int pin_in) : Sensor(pin_in)
  {
    pinMode(this->pin_in, INPUT);
  }; // el constructor llama al constructor del padre
};

int Analogico::getValorMAX()
{
  return this->valorMAX;
}

int Analogico::getValorMIN()
{
  return this->valorMIN;
}

int Analogico::getValor()
{
  return this->valor;
}

void Analogico::resetearValores()
{
  this->valorMAX = 0;
  this->valorMIN = 1023;
}

void Analogico::leerValores()
{
  int read = analogRead(this->pin_in);
  if (read > this->valorMAX)
  {
    this->valorMAX = read;
  }
  if (read < this->valorMIN)
  {
    this->valorMIN = read;
  }
  this->valor = read;
}

#define DHT11PIN 3

DHT dht(DHT11PIN, DHT11);

class DHTonce : public Sensor
{
  int temperatura;
  int humedad;

public:
  void resetearValores(){};
  void leerValores();
  int getTemperatura();
  int getHumedad();
  DHTonce(int pin_in) : Sensor(pin_in){}; // el constructor llama al constructor del padre
};

void DHTonce::leerValores()
{
  this->humedad = (int)dht.readHumidity();
  this->temperatura = (int)dht.readTemperature();
}

int DHTonce::getTemperatura()
{
  return this->temperatura;
}

int DHTonce::getHumedad()
{
  return this->humedad;
}

// sensors:
Analogico HC_SR501 = Analogico(A0);
Digital vibration_sensor = Digital(6);
Analogico sound_sensor = Analogico(A1);
Digital obstacle_sensor = Digital(2);
Analogico MQ2_gas_sensor = Analogico(A2);
Analogico rain_sensor = Analogico(A3);
Analogico oil_sensor = Analogico(A4);
DHTonce dht11_sensor = DHTonce(DHT11PIN); // 3
Digital photosensitive_sensor = Digital(4);
Digital flame_sensor = Digital(5);

class Output
{
  bool output;
  int pin_in;

public:
  void setOutput(bool outputIn)
  {
    this->output = outputIn;
    if (this->output)
      digitalWrite(this->pin_in, HIGH);
    else
      digitalWrite(this->pin_in, LOW);
  }
  bool getOutput()
  {
    return this->output;
  }
  Output(int pin_in)
  {
    this->pin_in = pin_in;
    pinMode(this->pin_in, OUTPUT);
    digitalWrite(this->pin_in, HIGH); // init to low
  };
};

#define NUM_OUTPUTS 4
Output globalOutputs[] = {Output(7), Output(8), Output(9), Output(10)};

class RaspberryCall
{
protected:
  int boolToInt(bool in)
  {
    if (in)
      return 1;
    return 0;
  }

public:
  virtual void response(String llegado);
};

class RaspberrySetOutputs : public RaspberryCall
{
public:
  void response(String llegado)
  {
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
      unsigned int checksumCalculated = llegado.charAt(0);
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
      if (activate == 1 && fail == 0)
      {
        for (int i = 0; i < NUM_OUTPUTS; i++)
        {
          if (outputs[i] == 1)
            globalOutputs[i].setOutput(false);
          else
            globalOutputs[i].setOutput(true);
        }
      }
    }
  }
};

class RaspberryGetSensors : public RaspberryCall
{
public:
  void response(String llegado)
  {
    char text[200];
    int checksum = HC_SR501.getValorMAX() +
                   this->boolToInt(vibration_sensor.getValorMAX()) +
                   sound_sensor.getValorMAX() +
                   this->boolToInt(obstacle_sensor.getValorMIN()) +
                   MQ2_gas_sensor.getValorMAX() +
                   rain_sensor.getValorMAX() +
                   oil_sensor.getValorMAX() +
                   this->boolToInt(photosensitive_sensor.getValorMIN()) +
                   this->boolToInt(flame_sensor.getValorMIN()) +
                   dht11_sensor.getHumedad() +
                   dht11_sensor.getTemperatura();
    sprintf(text, "%d %d %d %d %d %d %d %d %d %d %d %d \n\0",
            HC_SR501.getValorMAX(),
            this->boolToInt(vibration_sensor.getValorMAX()),
            sound_sensor.getValorMAX(),
            this->boolToInt(obstacle_sensor.getValorMIN()),
            MQ2_gas_sensor.getValorMAX(),
            rain_sensor.getValorMAX(),
            oil_sensor.getValorMAX(),
            this->boolToInt(photosensitive_sensor.getValorMIN()),
            this->boolToInt(flame_sensor.getValorMIN()),
            dht11_sensor.getHumedad(),
            dht11_sensor.getTemperatura(),
            checksum);

    Serial.println(text);
  }
};

class RaspberryListener
{
  RaspberryGetSensors raspberryCallSensors;
  RaspberrySetOutputs raspberrySetOutputs;

public:
  RaspberryListener();
  void listener();
};

RaspberryListener::RaspberryListener()
{
}

void resetSensors()
{
  HC_SR501.resetearValores();
  vibration_sensor.resetearValores();
  sound_sensor.resetearValores();
  obstacle_sensor.resetearValores();
  MQ2_gas_sensor.resetearValores();
  rain_sensor.resetearValores();
  oil_sensor.resetearValores();
  photosensitive_sensor.resetearValores();
  flame_sensor.resetearValores();
  dht11_sensor.leerValores();
}

void readSensors()
{
  HC_SR501.leerValores();
  vibration_sensor.leerValores();
  sound_sensor.leerValores();
  obstacle_sensor.leerValores();
  MQ2_gas_sensor.leerValores();
  rain_sensor.leerValores();
  oil_sensor.leerValores();
  // DHTonce dht11_sensor = DHTonce(DHT11PIN); //3
  photosensitive_sensor.leerValores();
  flame_sensor.leerValores();
}

void RaspberryListener::listener()
{
  if (Serial.available() > 0)
  {
    String llegado = Serial.readString();
    if (llegado.length() > 12)
    {
      int fail = 0;
      char outputs[50];
      unsigned int checksumCalculated = llegado.charAt(0);
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
      if (checksumLlegado == checksumCalculated && fail == 0)
      {
        unsigned int activate = llegado.charAt(0);
        if (activate == '1')
        {
          activate = activate - '0';
          this->raspberrySetOutputs.response(llegado);
          this->raspberryCallSensors.response(llegado); // send sensor values on response
        }
        else if (activate == '0')
        {
          this->raspberryCallSensors.response(llegado);
          resetSensors();
          readSensors(); // reset some reads
        }
      }
      else
      {
        Serial.println(llegado.c_str());
      }
    }
  }
  delay(10);
}

RaspberryListener connection;
void setup()
{
  Serial.begin(9600); // conf. velocidad del monitor Serial
  while (!Serial)
  {
  }; // wait for serial port to connect. Needed for native USB
  dht.begin();
  resetSensors(); // read hdt11
  readSensors();
}

void loop()
{
  // put your main code here, to run repeatedly:
  readSensors();
  connection.listener();
}
