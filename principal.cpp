#include <wiringPi.h>

class ArduinoConnection
{
    int state, pinCLK, pinOut, pinIn;
    unsigned char bufferOut[500], bufferIn[500];
    int lenghtBufferIn, lenghtBufferOut;
    int actualBufferIn, actualBufferOut;
    int actualBufferInBit, actualBufferOutBit;

public:
    ArduinoConnection();
    void wait();

}

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
}

void ArduinoConnection : wait()
{
}

int main(void)
{
    wiringPiSetup();
    ArduinoConnection *arduinoConnection = new ArduinoConnection(22, 23, 24);
    /*pinMode (0, OUTPUT) ;
    for (;;)
    {
      digitalWrite (0, HIGH) ; delay (500) ;
      digitalWrite (0,  LOW) ; delay (500) ;
    }*/ 
    //gcc - Wall - o blink blink.c - lwiringPi 
    return 0;
}