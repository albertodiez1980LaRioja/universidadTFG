#include <wiringPi.h>
#include <stdio.h>

class ArduinoConnection
{
    int state, pinCLK, pinOut, pinIn,lastRead;
    unsigned char bufferOut[500], bufferIn[500];
    int lenghtBufferIn, lenghtBufferOut;
    int actualBufferIn, actualBufferOut;
    int actualBufferInBit, actualBufferOutBit;
    int bitOUT,bitIN, bitCLK;
public:
    ArduinoConnection(int pinCLK,int pinOut,int pinIn);
    void wait();

};

ArduinoConnection::ArduinoConnection(int pinCLK,int pinOut,int pinIn)
{
    this->state = 0;
    this->pinCLK = pinCLK;
    this->pinOut = pinOut;
    this->pinIn = pinIn;
    this->lenghtBufferIn = 0;
    this->lenghtBufferOut = 0;
    this->actualBufferIn = 0;
    this->actualBufferOut = 0;
    this->actualBufferInBit = 0;
    this->actualBufferOutBit = 0;
    if(pinCLK != -1){
        pinMode (this->pinCLK , OUTPUT) ;
    }
    pinMode(this->pinOut, OUTPUT);
    pinMode(this->pinIn, INPUT);
    this->bitOUT = 0;
}

void ArduinoConnection :: wait()
{ 
    if(this->pinCLK != -1){
        this->state++;
        //printf("%d\n",this->state);
        if(this->state == 1){
            if(this->bitCLK){
                digitalWrite (this->pinCLK, HIGH);
                this->bitCLK = 0;
            }
            else{
                digitalWrite (this->pinCLK, LOW);
                this->bitCLK = 1;
            }

            if(this->bitOUT){
                digitalWrite (this->pinOut, HIGH);
                this->bitOUT = 0;
            }
            else{
                digitalWrite (this->pinOut, LOW);
                this->bitOUT = 1;
            }  
        } 
        else if(this->state == 2){
            int aux = digitalRead (this->pinIn);
            printf("entrada %d\n", aux);
            if (aux == this->lastRead)
                printf("Fallo de sincronismo");
            this->lastRead = aux;
            this->state=0;
        }
        delay(1);  
    }  
}
  
int main(void)
{
    wiringPiSetup();
    ArduinoConnection arduinoConnection(22, 23, 24);

    while(true){
        arduinoConnection.wait();
    }
    /*pinMode (0, OUTPUT) ;
    for (;;)
    {
      digitalWrite (0, HIGH) ; delay (500) ;
      digitalWrite (0,  LOW) ; delay (500) ;
    }*/ 
    //gcc - Wall - o blink blink.c - lwiringPi 
    return 0;
}