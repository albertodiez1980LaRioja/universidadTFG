#include <DHT.h>

//
// sensor_de_movimiento.ino
//
typedef struct{
  byte code;
  int measurement,measurementMAX,measurementMIN;
  int pins[3];
  int numPins;
  int pinsAnalog[3];
  int numPinsAnalog;
}Tsensor;

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

Tsensor globalSensors[]={
  {0,0,0,0,{-1,-1,-1}  ,0,{A0,-1,-1},1},
  {1,0,0,0,{6,-1,-1}  ,1,{-1,-1,-1},0},
  {2,0,0,0,{-1,-1,-1} ,0,{A1,-1,-1} ,1},
  {3,0,0,0,{2,-1,-1}  ,1,{-1,-1,-1},0},
  {4,0,0,0,{-1,-1,-1} ,0,{A2,-1,-1} ,1},
  {5,0,0,0,{-1,-1,-1}  ,1,{A3,-1,-1},0},
  {6,0,0,0,{-1,-1,-1}  ,1,{A4,-1,-1},1},
  {7,0,0,0,{3,-1,-1}  ,1,{-1,-1,-1},0},
  {8,0,0,0,{4,-1,-1}  ,1,{-1,-1,-1},0},
  {9,0,0,0,{5,-1,-1}  ,1,{-1,-1,-1},0},
};



class RBconnection{
  
    int state, RBclockIn, RBdateIn, RBdateOut;
    byte bufferOut[50], bufferIn[50], maskBit[8];
    int lenghtBufferOut, lenghtBufferIn, nowBufferIn, nowBufferOut, nowBufferInBit, nowBufferOutBit;
    int isIn, isOut;
    unsigned int time;
    int sendBit;
  public:
    RBconnection();
    void wait();  
    void begin();
    void calculateCheckSum(byte *hightByte,byte *lowByte,byte *buffer,int lenght);
    void intToBytes(byte *hightByte,byte *lowByte,int integer);
};


void RBconnection::intToBytes(byte *hightByte,byte *lowByte,int integer){
  *lowByte = integer % 128;
  *hightByte = integer / 128;
}


void RBconnection::begin(){
  RBclockIn = 11;
  RBdateIn = 12;
  RBdateOut = 13;
  pinMode(RBclockIn, INPUT);
  pinMode(RBdateIn, INPUT);
  pinMode(RBdateOut, OUTPUT);
  maskBit[0] = 128;
  for(int i=1;i<8;i++){
    maskBit[i] = maskBit[i-1]/2;
    Serial.println(maskBit[i]);
  }
  
  state = 0;
  
  lenghtBufferOut = 0; lenghtBufferIn = 0; nowBufferIn = 0; nowBufferOut = 0; nowBufferInBit = 0; nowBufferOutBit = 0;
  sendBit = 0;
  isIn = 0;
  isOut = 0;
  time = millis();
}

void RBconnection::calculateCheckSum(byte *hightByte,byte *lowByte,byte *buffer,int lenght){
  int sum=0;
  for(int i=0;i<lenght-2;i++){
    sum+=buffer[i];
  }
  *lowByte = sum % 128;
  *hightByte = sum / 128;
}

RBconnection::RBconnection(){
  
}


int last=0;
byte led=7;// pin de salida para activar un diodo LED

void readSensors(int doAll);

float DHT11reads[2];

void RBconnection::wait(){
  int read = digitalRead(RBclockIn);
  while(read == digitalRead(RBclockIn)){
    readSensors(0);
  }
  if(last == read)
    Serial.println("Error sincronismo");
  last = read;
 
  if(isOut){
    if (this->nowBufferOut < (this->lenghtBufferOut * 8))
    {
      int numByte = this->nowBufferOut / 8;
      int numBit = this->nowBufferOut % 8;
      if ( this->bufferOut[numByte] & this->maskBit[numBit])
      {
        digitalWrite(RBdateOut, HIGH);
      }
      else
      {
        digitalWrite(RBdateOut, LOW);
      }
      this->nowBufferOut++;
   }
   else{
    isOut=0;
    Serial.println("Paquete enviado");
   }
  }
  else{
    digitalWrite(RBdateOut,LOW);
  }

   
  delay(1);
  read = digitalRead(RBdateIn);
  if(read){
    if(!isIn){
      for(int i=0;i<50;i++)
        bufferIn[i] = 0;
      nowBufferIn = 0;
      lenghtBufferIn = 2;
      isIn = 1;
      Serial.println("Se inicialia el paquete");
    }   
   }
   if(isIn){  
    if (nowBufferIn < (lenghtBufferIn*8)){
      int numByte = this->nowBufferIn / 8;
      int numBit = this->nowBufferIn % 8;
      if(read == HIGH)
        bufferIn[numByte] = bufferIn[numByte] | maskBit[numBit];
      if(this->nowBufferIn==15){
        if(bufferIn[0] !=170){
          // esto funciona por que no se inicia hasta hacer un nuevo paquete, esto ocurre pasado 1 segundo de vuelta
          // se podría mejorar bastante poniendo los bits en serie
          Serial.println("Fallo en el primer byte");
          nowBufferIn = 0;
          isIn = 0;          
          // damos por hecho que entre paquete y paquete recibido habrá por lo menos 1 byte a ceros, de esta forma funcionará
          // también conviene que no haya ningún otro byte a 170
        }
        else
          this->lenghtBufferIn = bufferIn[1];
      }
    }
    
    if(this->nowBufferIn==this->lenghtBufferIn*8){
      Serial.println("Paquete recibido: ");
      byte byteHigh,byteLow;
      calculateCheckSum(&byteHigh,&byteLow,bufferIn,lenghtBufferIn);       
      if(byteHigh == bufferIn[lenghtBufferIn-2] && byteLow == bufferIn[lenghtBufferIn-1]){
        byte lowByte,hightByte;
        for(int i=0;i<lenghtBufferIn;i++){
          //Serial.print("byte: ");
          //Serial.println(bufferIn[i]);
        }
        //Serial.println("Paquete con checksum correcto");
        readSensors(1);
        isOut=1;
        nowBufferOut=0;
        bufferOut[0]=170;
        bufferOut[1]=17;
        // now put all the data:
        bufferOut[2]=0;
        bufferOut[3]=0;
        bufferOut[4]=0;
        bufferOut[5]=0;
        bufferOut[6]=0;
        bufferOut[7]=0;
        bufferOut[8]=0;
        bufferOut[9]=0;
        bufferOut[10]=0;
        bufferOut[11]=0;
        bufferOut[12]=0;
        bufferOut[13]=0;
        bufferOut[14]=1;
        bufferOut[2] = 0;
        bufferOut[2] = globalSensors[VIBRATION_SENSOR].measurementMAX;
        bufferOut[2] = bufferOut[2] + (2*globalSensors[OBSTACLE_SENSOR].measurementMIN);
        bufferOut[2] = bufferOut[2] + (4*globalSensors[PHOTOSENSITIVE_SENSOR].measurementMIN);
        bufferOut[2] = bufferOut[2] + (8*globalSensors[FLAME_SENSOR].measurementMIN);
        intToBytes(&hightByte,&lowByte,globalSensors[HC_SR501].measurementMAX);
        bufferOut[3]=lowByte;
        bufferOut[4]=hightByte;
        intToBytes(&hightByte,&lowByte,globalSensors[SOUND_SENSOR].measurementMAX);
        bufferOut[5]=lowByte;
        bufferOut[6]=hightByte;
        intToBytes(&hightByte,&lowByte,globalSensors[MQ2_GAS_SENSOR].measurementMAX);
        bufferOut[7]=lowByte;
        bufferOut[8]=hightByte;
        intToBytes(&hightByte,&lowByte,globalSensors[RAIN_SENSOR].measurementMAX);
        bufferOut[9]=lowByte;
        bufferOut[10]=hightByte;
        intToBytes(&hightByte,&lowByte,globalSensors[OIL_SENSOR].measurementMAX);
        bufferOut[11]=lowByte;
        bufferOut[12]=hightByte;
        bufferOut[13]=(byte)DHT11reads[0];
        bufferOut[14]=(byte)DHT11reads[1];
        lenghtBufferOut=17;
        //bufferOut[15]=1;
        //bufferOut[16]=59;
        calculateCheckSum(&bufferOut[15],&bufferOut[16],bufferOut,lenghtBufferOut);       
        readSensors(2);
        //Serial.println(bufferOut[16]);
      }
      else{
        Serial.println("Paquete con checksum incorrecto");
      }
      isIn=0;
      nowBufferIn=0;
    }
    else
      nowBufferIn++;
   }
    
  time=millis();

}

String msg[10]={
  "Sensor de personas: ",
  "Sensor de vibración: ",
  "Sensor de sonido: ",
  "Sensor de obstaculo: ",
  "Sensor de gas: ",
  "Sensor de aceite: ",
  "Sensor de lluvia: ",
  "Temperatura y humedad",
  "Sensor de luz: ",
  "Sensor de fuego:",
  };

#define DHTTYPE DHT11
DHT dht(globalSensors[DHT11_SENSOR].pins[0], DHTTYPE);


RBconnection connection;

void setup()
{
  Serial.begin(9600);// conf. velocidad del monitor Serial
  int i;
  for(i = 0;i < NUM_SENSORS;i++){
    int i2;
    //Serial.println("sensor");
    //Serial.println(i,DEC);
    for(int i2=0;i2<globalSensors[i].numPins;i2++){
      pinMode(globalSensors[i].pins[i2], INPUT);
      //Serial.println("PUESTO EL PIN ");//,globalSensors[i].pins[i2]);
      //Serial.println(globalSensors[i].pins[i2],DEC);
    }  
    for(int i2=0;i2<globalSensors[i].numPinsAnalog;i2++)
      pinMode(globalSensors[i].pinsAnalog[i2], INPUT);
  }
  dht.begin();
  connection.begin();
}


void readSensor_ONE_PIN_DIGITAL(Tsensor *sensor){
  int read = digitalRead(sensor->pins[0]);
  if(read == HIGH){
    sensor->measurement=1;
    sensor->measurementMAX=1;
  }
  else{
    sensor->measurement=0;
    sensor->measurementMIN=0;
  } 
}

void readSensor_ONE_PIN_ANALOG(Tsensor *sensor){
  int read = analogRead( sensor->pinsAnalog[0]);
  if(read > sensor->measurementMAX)
    sensor->measurementMAX=read;
  if(read < sensor->measurementMIN)
    sensor->measurementMIN=read;
  sensor->measurement = read;
}




void readSensor_DHT11(Tsensor *sensor){
// Leemos la humedad relativa
  float h = dht.readHumidity();
  // Leemos la temperatura en grados centígrados (por defecto)
  float t = dht.readTemperature();
  // Leemos la temperatura en grados Fahreheit
  float f = dht.readTemperature(true);
 
  // Comprobamos si ha habido algún error en la lectura
  if (isnan(h) || isnan(t) || isnan(f)) {
    Serial.println("Error obteniendo los datos del sensor DHT11");
    return;
  }
 
  // Calcular el índice de calor en Fahreheit
  float hif = dht.computeHeatIndex(f, h);
  // Calcular el índice de calor en grados centígrados
  float hic = dht.computeHeatIndex(t, h, false);
  DHT11reads[0]=h;
  DHT11reads[1]=t;
 /*
  Serial.print("Humedad: ");
  Serial.print(h);
  Serial.print(" %\t");
  Serial.print("Temperatura: ");
  Serial.print(t);
  Serial.print(" *C ");
  Serial.print(f);
  Serial.print(" *F\t");
  Serial.print("Índice de calor: ");
  Serial.print(hic);
  Serial.print(" *C ");
  Serial.print(hif);
  Serial.println(" *F");*/
}


void readSensors(int doAll){
 readSensor_ONE_PIN_ANALOG(&globalSensors[HC_SR501]);
 readSensor_ONE_PIN_DIGITAL(&globalSensors[VIBRATION_SENSOR]);
 readSensor_ONE_PIN_ANALOG(&globalSensors[SOUND_SENSOR]); 
 readSensor_ONE_PIN_DIGITAL(&globalSensors[OBSTACLE_SENSOR]); 
 readSensor_ONE_PIN_DIGITAL(&globalSensors[PHOTOSENSITIVE_SENSOR]); 
 readSensor_ONE_PIN_DIGITAL(&globalSensors[FLAME_SENSOR]); 
 readSensor_ONE_PIN_ANALOG(&globalSensors[MQ2_GAS_SENSOR]); 
 readSensor_ONE_PIN_ANALOG(&globalSensors[OIL_SENSOR]); 
 readSensor_ONE_PIN_ANALOG(&globalSensors[RAIN_SENSOR]); 
 if(doAll==1){
  readSensor_DHT11(&globalSensors[DHT11_SENSOR]);
 }
 if(doAll==2){  
  //Serial.print("\n");
  for(int i=0;i<NUM_SENSORS;i++){
    if(i != DHT11_SENSOR){
      /*  Serial.print(msg[i]); 
      Serial.print(globalSensors[i].measurement);
      Serial.print(" Valor máximo: ");
      Serial.print(globalSensors[i].measurementMAX);
      Serial.print(" Valor mínimo: ");
      Serial.print(globalSensors[i].measurementMIN);*/
      if( i == VIBRATION_SENSOR || i==OBSTACLE_SENSOR || i==PHOTOSENSITIVE_SENSOR || i==FLAME_SENSOR){
        globalSensors[i].measurementMIN=1;
        globalSensors[i].measurementMAX=0;
      }
      else{
        globalSensors[i].measurementMIN=2000;
        globalSensors[i].measurementMAX=0;
      }
    }
   }
  }
}

void loop()
{
  readSensors(0);
  connection.wait();
}