#include "ArduinoConnection.hpp"

int ArduinoConnection::open_serial_port(char *name)
{
    int fd, bits;
    struct termios term;
    struct serial_struct kernel_serial_settings;

    if ((fd = open(name, O_RDWR | O_NONBLOCK | O_NOCTTY)) == -1)
    {
        fprintf(stderr, "open(%s) failed: %s\n", name, strerror(errno));
        return -1;
    }
    if (ioctl(fd, TIOCMGET, &bits) < 0)
    {
        close(fd);
        perror("ioctl(TCIOMGET)");
        return -1;
    }
    bits &= ~(TIOCM_DTR | TIOCM_RTS);
    if (ioctl(fd, TIOCMSET, &bits) < 0)
    {
        close(fd);
        perror("ioctl(TIOCMSET)");
        return -1;
    }
    sleep(1);
    tcflush(fd, TCIFLUSH);
    bits &= TIOCM_DTR;
    if (ioctl(fd, TIOCMSET, &bits) < 0)
    {
        close(fd);
        perror("ioctl(TIOCMSET)");
        return -1;
    }

    memset(&term, 0, sizeof(term));
    term.c_iflag = IGNBRK | IGNPAR;
    term.c_cflag = CS8 | CREAD | HUPCL | CLOCAL;
    cfsetospeed(&term, B9600);
    cfsetispeed(&term, B9600);
    if (tcsetattr(fd, TCSANOW, &term) < 0)
    {
        perror("tcsetattr()");
        return -1;
    }
    if (ioctl(fd, TIOCGSERIAL, &kernel_serial_settings) == 0)
    {
        kernel_serial_settings.flags |= ASYNC_LOW_LATENCY;
        ioctl(fd, TIOCSSERIAL, &kernel_serial_settings);
    }
    tcflush(fd, TCIFLUSH);
    this->iniciated = true;
    return fd;
}

int ArduinoConnection::read_from_serial(char *buf, int lon)
{
    int n;

    while (1)
    {
        if ((n = read(fd, buf, lon)) == -1)
        {
            if (errno != EAGAIN)
            {
                fprintf(stderr, "read() failed: (%d) %s\n", errno, strerror(errno));
                return -1;
            }
        }
        else
        {
            if (n > 0)
            {
                return n; // stop reading
            }
        }
    }
}

ArduinoConnection::ArduinoConnection(char *name)
{
    this->iniciated = false;
    this->fd = this->open_serial_port(name);
}

void delay(float millis)
{
    clock_t start_time = clock();
    while (clock() < start_time + ((CLOCKS_PER_SEC / 1000.) * millis))
    {
    }
}
