// https://github.com/everpi/BH1750FVI/blob/master/bh.c
#include <stdio.h>
#include <signal.h>
#include <wiringPi.h>
#include <wiringPiI2C.h>
#include <softPwm.h>

// LED GPIO PIN
#define LED_PIN 18
#define I2C 0x23
#define REVISION 5000 // 보정값
#define MAX_LUX 65535

typedef enum {
    false,
    true
} bool;

const int GPIO_PIN[] = {
    2,
    3,
    4, 14,
    15,
    17, 18,
    27,
    22, 23,
    24,
    10,
    9, 25,
    11, 8,
    7,
    0, 1,
    5,
    6, 12,
    13,
    19, 16,
    26, 20,
    21
};

const int WIRING_PIN[] = {
    8,
    9,
    7, 15,
    16,
    0, 1,
    2,
    3, 4,
    5,
    12,
    13, 6,
    14, 10,
    11,
    30, 31,
    21,
    22, 26,
    23,
    24, 27,
    25, 28,
    29
};

static volatile int status = true;

int convertPin(int gpioPin);
void signalHandler(int dummy);

int main() {
	int fd = 0;
	unsigned int data = 0;

	signal(SIGINT, signalHandler);

	if (wiringPiSetup() != 0) {
		printf("wiringPi setup fail.\n");

		return 1;
	}

	int c_led_pin = convertPin(LED_PIN);

	if (c_led_pin == -1) {
		printf("pin convert fail.\n");

		return 1;
	}

	softPwmCreate(c_led_pin, 100, 100);
	softPwmWrite(c_led_pin, 0);

	fd = wiringPiI2CSetup(I2C);
	float readValue, lightValue;

	while (status) {
		digitalWrite(c_led_pin, HIGH);

		data = wiringPiI2CReadReg16(fd, 0x10);
		readValue = (float)(((data >> 8) + ((data & 0xff) << 8)) / 1.2);
		// fprintf(stderr, "%.3f lx/\n", readValue);

		lightValue = readValue / MAX_LUX * REVISION;

		if (lightValue > 100.0) {
			lightValue = 100.0;
		}

		printf("%.3f\n", lightValue);

		softPwmWrite(c_led_pin, lightValue);

		usleep(180000);
	}

	return 0;
}

int convertPin(int gpioPin) {
    int wiringLength, i;

    wiringLength = sizeof(WIRING_PIN) / sizeof(WIRING_PIN[0]);

    for (i = 0; i < wiringLength; i++) {
        if (GPIO_PIN[i] == gpioPin) {
            return WIRING_PIN[i];
        }
    }

    return -1;
}

void signalHandler(int dummy) {
	status = false;
}