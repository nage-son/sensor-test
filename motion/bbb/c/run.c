#include<stdio.h>
#include<signal.h>
#include<BBBiolib.h>

#define GPIO 8
#define LED_PIN 12
#define MOTION_PIN 14

static volatile int RUNNING = 1;

void signalHandler(int dummy);

int main() {
    signal(SIGINT, signalHandler);
    iolib_init();
    iolib_setdir(GPIO, MOTION_PIN, BBBIO_DIR_IN);
    iolib_setdir(GPIO, LED_PIN, BBBIO_DIR_OUT);

    while (RUNNING) {
    	if (is_high(GPIO, MOTION_PIN)) {
    		pin_high(GPIO, LED_PIN);
    	} else {
    		pin_low(GPIO, LED_PIN);
    	}
    }

    pin_low(GPIO, LED_PIN);
    iolib_free();

    return 0;
}

void signalHandler(int dummy) {
	RUNNING = 0;
}