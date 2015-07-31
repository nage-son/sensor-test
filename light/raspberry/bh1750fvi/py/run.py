#-*- coding: utf-8 -*-
import RPi.GPIO as gpio
import smbus
import time

# VCC 3.3
# http://www.raspberrypi-spy.co.uk/2015/03/bh1750fvi-i2c-digital-light-intensity-sensor/
LED_PIN = 18

gpio.setmode(gpio.BCM)
gpio.setup(LED_PIN, gpio.OUT)

LED = gpio.PWM(LED_PIN, 100)

LED.start(0)


# Define some constants from the datasheet
 
DEVICE     = 0x23 # Default device I2C address
 
POWER_DOWN = 0x00 # No active state
POWER_ON   = 0x01 # Power on
RESET      = 0x07 # Reset data register value
 
# Start measurement at 4lx resolution. Time typically 16ms.
CONTINUOUS_LOW_RES_MODE = 0x13
# Start measurement at 1lx resolution. Time typically 120ms
CONTINUOUS_HIGH_RES_MODE_1 = 0x10
# Start measurement at 0.5lx resolution. Time typically 120ms
CONTINUOUS_HIGH_RES_MODE_2 = 0x11
# Start measurement at 1lx resolution. Time typically 120ms
# Device is automatically set to Power Down after measurement.
ONE_TIME_HIGH_RES_MODE_1 = 0x20
# Start measurement at 0.5lx resolution. Time typically 120ms
# Device is automatically set to Power Down after measurement.
ONE_TIME_HIGH_RES_MODE_2 = 0x21
# Start measurement at 1lx resolution. Time typically 120ms
# Device is automatically set to Power Down after measurement.
ONE_TIME_LOW_RES_MODE = 0x23

MAX_LUX = 65535
REVISION = 5000 # 보정값

 
#bus = smbus.SMBus(0) # Rev 1 Pi uses 0
bus = smbus.SMBus(1)  # Rev 2 Pi uses 1
 
def convertToNumber(data):
    # Simple function to convert 2 bytes of data
    # into a decimal number
    return ((data[1] + (256 * data[0])) / 1.2)
 
def readLight(addr=DEVICE):
    data = bus.read_i2c_block_data(addr,ONE_TIME_HIGH_RES_MODE_2)
    return convertToNumber(data)
 
def main():
    try:
        while True:
            readValue = readLight()
            lightValue = readValue / MAX_LUX * REVISION

            if lightValue > 100:
            	lightValue = 100

            LED.ChangeDutyCycle(lightValue)
            time.sleep(0.18)

    except KeyboardInterrupt:
    	LED.stop()
    	gpio.cleanup()
    	print "End\n"
   
if __name__=="__main__":
     main()