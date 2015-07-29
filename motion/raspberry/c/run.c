#include<stdio.h>
#include<wiringPi.h>
#include<signal.h>

// LED GPIO PIN
#define LED_PIN 17

// Motion sensor GPIO PIN
#define MOTION_PIN 18

typedef enum {
    false,
    true
} bool;

const int PHY_PIN[] = {
    3,
    5,
    7, 8,
    10,
    11, 12,
    13, 14,
    15, 16,
    17, 18,
    19,
    21, 22,
    23, 24,
    26,
    27, 28,
    29,
    31, 32,
    33,
    35, 36,
    37, 38,
    40
};

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
	if (wiringPiSetup() != 0) {
		printf("wiringPi setup fail.\n");

		return 1;
	}

	signal(SIGINT, signalHandler);

	int c_led_pin = convertPin(LED_PIN);
	int c_motion_pin = convertPin(MOTION_PIN);

	if (c_led_pin == -1 || c_motion_pin == -1) {
		printf("pin convert fail.\n");

		return 1;
	}

	pinMode(c_led_pin, OUTPUT);
	pinMode(c_motion_pin, INPUT);

	while (status) {
		if (digitalRead(c_motion_pin)) {
			digitalWrite(c_led_pin, HIGH);
		} else {
			digitalWrite(c_led_pin, LOW);
		}
	}

	// ctrl-c signal 발생시 led 끔.
	digitalWrite(c_led_pin, LOW);

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