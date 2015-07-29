import time
import RPi.GPIO as gpio

gpio.setmode(gpio.BCM)

led_pin = 17
motion_pin = 18

gpio.setup(led_pin, gpio.OUT)
gpio.setup(motion_pin, gpio.IN)

try:
    while True:
        if gpio.input(motion_pin):
            gpio.output(led_pin, True)
        else:
            gpio.output(led_pin, False)

except KeyboardInterrupt:
    gpio.output(led_pin, False)
    gpio.cleanup()