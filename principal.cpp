#include <wiringPi.h>
#include <stdio.h>

class ArduinoConnection
{
    int state, pinCLK, pinOut, pinIn, lastRead;
    unsigned char bufferOut[500], bufferIn[500];
    int lenghtBufferIn, lenghtBufferOut;
    int actualBufferIn, actualBufferOut;
    int counter;
    int bitOUT, bitIN, bitCLK;
    int maskBit[8];
public:
    ArduinoConnection(int pinCLK, int pinOut, int pinIn);
    void wait();
};

ArduinoConnection::ArduinoConnection(int pinCLK, int pinOut, int pinIn)
{
    this->state = 0;
    this->pinCLK = pinCLK;
    this->pinOut = pinOut;
    this->pinIn = pinIn;
    this->lenghtBufferIn = 0;
    this->lenghtBufferOut = 0;
    this->actualBufferIn = 0;
    this->actualBufferOut = 0;
    if (pinCLK != -1)
    {
        pinMode(this->pinCLK, OUTPUT);
    }
    pinMode(this->pinOut, OUTPUT);
    pinMode(this->pinIn, INPUT);
    this->bitOUT = 0;
    this->bufferOut[0] = 170;
    this->bufferOut[1] = 5;
    this->bufferOut[2] = 0;
    this->bufferOut[3] = 0;
    this->bufferOut[4] = 175;
    this->maskBit[0] = 1;
    for(int i=1;i<8;i++)
        this->maskBit[i] = this->maskBit[i-1]*2;
    this->counter = 0;
}

void ArduinoConnection ::wait()
{
    if (this->pinCLK != -1)
    {
        this->state++;
        // printf("%d\n",this->state);
        if (this->state == 1)
        {
            if (this->bitCLK)
            {
                digitalWrite(this->pinCLK, HIGH);
                this->bitCLK = 0;
            }
            else
            {
                digitalWrite(this->pinCLK, LOW);
                this->bitCLK = 1;
            }
            if (this->actualBufferOut < this->lenghtBufferOut)
            {
                int numByte = this->actualBufferOut / 8;
                int numBit = this->actualBufferOut % 8;
                printf("byte: %d,bit %d valor: %d\n",numByte,numBit,this->bufferOut[numByte] & this->maskBit[numBit]);
                printf("%d\n",this->actualBufferOut);
                //this->bitOUT = 
                if (/*this->bitOUT*/ this->bufferOut[numByte] & this->maskBit[numBit])
                {
                    digitalWrite(this->pinOut, HIGH);
                }
                else
                {
                    digitalWrite(this->pinOut, LOW);
                }
                this->actualBufferOut++;
            }
        }
        else if (this->state == 2)
        {
            int aux = digitalRead(this->pinIn);
            //printf("entrada %d\n", aux);
            //if (aux == this->lastRead)
              //  printf("Fallo de sincronismo");
            this->lastRead = aux;
            this->state = 0;
        }
        delay(1);
        this->counter++;
        if (this->counter == 1000)
        {
            this->counter = 0;
            this->actualBufferOut = 0;
            this->lenghtBufferOut = 5;
            this->actualBufferOut = 0;
        } 
    }
}

int main(void)
{
    wiringPiSetup();
    ArduinoConnection arduinoConnection(22, 23, 24);

    while (true)
    {
        arduinoConnection.wait();
    }
    /*pinMode (0, OUTPUT) ;
    for (;;)
    {
      digitalWrite (0, HIGH) ; delay (500) ;
      digitalWrite (0,  LOW) ; delay (500) ;
    }*/
    // gcc - Wall - o blink blink.c - lwiringPi
    return 0;
}