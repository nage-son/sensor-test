# -*- coding: utf-8 -*-
import Adafruit_BBIO.PWM as PWM
import smbus
import time

LED_PIN = "P9_14"
STATUS = False
bus = None
addr = None

MAX_LUX = 65535
REVISION = 5000  # 보정값


def init():
    global STATUS, bus, addr

    if STATUS:
        print "True"
    else:
        PWM.start(LED_PIN, 0)
        bus = smbus.SMBus(1)
        addr = 0x23

        STATUS = True


def read_light():
    while True:
        read_data()


def read_data():
    global bus, addr

    data = bus.read_i2c_block_data(addr, 0x11)
    lux2 = (data[1] + (256 * data[0])) / 1.2

    light_value = lux2 / MAX_LUX * REVISION

    if light_value > 100:
        light_value = 100

    PWM.set_duty_cycle(LED_PIN, light_value)

    time.sleep(0.18)


if __name__ == "__main__":
    try:
        init()
        read_light()

    except KeyboardInterrupt:
        print "Error-------------------------"
        PWM.stop(LED_PIN)
        PWM.cleanup()
