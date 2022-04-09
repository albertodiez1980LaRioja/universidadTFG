#include <wiringPi.h>
#include <stdio.h>

class ArduinoConnection
{
    int state, pinCLK, pinOut, pinIn, lastRead;
    unsigned char bufferOut[500], bufferIn[500];
    int lenghtBufferIn, lenghtBufferOut;
    int nowBufferIn, actualBufferOut;
    int counter;
    int bitOUT, bitIN, bitCLK;
    int maskBit[8];
    int isIn;

public:
    ArduinoConnection(int pinCLK, int pinOut, int pinIn);
    void wait();
    void calculateCheckSum(unsigned char *hightByte, unsigned char *lowByte, unsigned char *buffer, int lenght);
};

ArduinoConnection::ArduinoConnection(int pinCLK, int pinOut, int pinIn)
{
    this->isIn = 0;
    this->state = 0;
    this->pinCLK = pinCLK;
    this->pinOut = pinOut;
    this->pinIn = pinIn;
    this->lenghtBufferIn = 0;
    this->lenghtBufferOut = 0;
    this->nowBufferIn = 0;
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
    this->calculateCheckSum(&this->bufferOut[3],&this->bufferOut[4],this->bufferOut,5);
    //this->bufferOut[3] = 0;   
    //this->bufferOut[4] = 175;
    this->maskBit[0] = 128;
    for (int i = 1; i < 8; i++)
        this->maskBit[i] = this->maskBit[i - 1] / 2;
    this->counter = 0;
}

void ArduinoConnection::calculateCheckSum(unsigned char *hightByte, unsigned char *lowByte, unsigned char *buffer, int lenght)
{
    int sum = 0;
    for (int i = 0; i < lenght - 2; i++)
    {
        sum += buffer[i];
    }
    *lowByte = sum % 128;
    *hightByte = sum / 128;
}

void ArduinoConnection ::wait()
{
    int msToDelay = 1;
    // printf("aqui");
    if (this->pinCLK != -1)
    {
        this->state++;
        // printf("%d\n",this->state);
        if (this->state == 1)
        {

            if (this->actualBufferOut < (this->lenghtBufferOut * 8))
            {
                int numByte = this->actualBufferOut / 8;
                int numBit = this->actualBufferOut % 8;
                if (this->bufferOut[numByte] & this->maskBit[numBit])
                {
                    digitalWrite(this->pinOut, HIGH);
                }
                else
                {
                    digitalWrite(this->pinOut, LOW);
                }
                this->actualBufferOut++;
            }
            else
            {
                digitalWrite(this->pinOut, LOW);
            }
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
            delay(msToDelay);
        }
        else if (this->state == 2)
        {
            delay(msToDelay);
            int read = digitalRead(this->pinIn);

            if (read == HIGH)
            {
                if (!isIn)
                {
                    for (int i = 0; i < 50; i++)
                        bufferIn[i] = 0;
                    nowBufferIn = 0;
                    this->lenghtBufferIn = 2;
                }
                // printf("Detectado nivel alto %d\n",read);
                isIn = 1;
            }
            else
            {
                // printf("Detectado nivel bajo %d\n",read);
            }
            if (isIn)
            {
                if (this->nowBufferIn < (this->lenghtBufferIn * 8))
                {
                    int numByte = this->nowBufferIn / 8;
                    int numBit = this->nowBufferIn % 8;
                    if (read == HIGH)
                        bufferIn[numByte] = bufferIn[numByte] | maskBit[numBit];
                    if (this->nowBufferIn == 15)
                    {
                        if (bufferIn[0] != 170)
                        {
                            // esto funciona por que no se inicia hasta hacer un nuevo paquete, esto ocurre pasado 1 segundo de vuelta
                            // se podría mejorar bastante poniendo los bits en serie
                            printf("Fallo en el primer byte\n");
                            nowBufferIn = 0;
                            isIn = 0;
                            // damos por hecho que entre paquete y paquete recibido habrá por lo menos 1 byte a ceros, de esta forma funcionará
                            // también conviene que no haya ningún otro byte a 170
                        }
                        else
                            this->lenghtBufferIn = bufferIn[1];
                    }
                }

                if (this->nowBufferIn == this->lenghtBufferIn * 8)
                {
                    printf("Paquete recibido: \n");
                    int sum = 0;
                    for (int i = 0; i < this->lenghtBufferIn; i++)
                    {
                        if (i < this->lenghtBufferIn - 1)
                            sum += bufferIn[i];
                        printf("byte ");
                        printf("%d ", i);
                        printf("%d\n", bufferIn[i]);
                    }
                    unsigned char byteHigh,byteLow;
                    calculateCheckSum(&byteHigh,&byteLow,bufferIn,lenghtBufferIn);   
                    //if (sum == (bufferIn[lenghtBufferIn - 2] * 256 + bufferIn[lenghtBufferIn - 1]))
                    if(byteHigh == bufferIn[lenghtBufferIn - 2] && bufferLow[lenghtBufferIn - 1]){
                        printf("Paquete con checksum correcto\n\n");
                    else
                        printf("Paquete con checksum incorrecto\n\n");
                    isIn = 0;
                }
                nowBufferIn++;
            }
            // printf("entrada %d\n", aux);
            // if (aux == this->lastRead)
            //   printf("Fallo de sincronismo");
            this->lastRead = read;
            this->state = 0;
        }
        delay(msToDelay);
        this->counter++;
        if (this->counter == 500)
        {
            this->counter = 0;
            this->actualBufferOut = 0;
            this->lenghtBufferOut = 5;
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