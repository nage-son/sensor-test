import Adafruit_BBIO.GPIO as GPIO

LED_PIN = "P8_12" 
MOTION_PIN = "P8_14"

GPIO.setup(LED_PIN, GPIO.OUT)
GPIO.setup(MOTION_PIN, GPIO.IN)

try:
	while (True):
		if GPIO.input(MOTION_PIN):
			GPIO.output(LED_PIN, GPIO.HIGH)
		else:
			GPIO.output(LED_PIN, GPIO.LOW)

except KeyboardInterrupt:
	GPIO.output(LED_PIN, GPIO.LOW)
	GPIO.cleanup()