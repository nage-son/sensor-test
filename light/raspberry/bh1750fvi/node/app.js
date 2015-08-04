var gpio = require('onoff').Gpio;
var i2c = require('i2c');
var async = require('async');
var wire = new i2c(0x23, {'device': '/dev/i2c-1'});
var wpi = require('wiring-pi');
var isInit = false;
var MAX_LUX = 65535;
var REVISION = 5000;
var LED_PIN = 18;
var convertedPin;

var MEASURE_MODE = {
  'Continuous_H_Resolution_Mode': 0x10,
  'Continuous_H_Resolution_Mode2': 0x11,
  'Continuous_L_Resolution_Mode': 0x13,
  'OneTime_H_Resolution_Mode': 0x20,
  'OneTime_H_Resolution_Mode2': 0x21,
  'OneTime_L_Resolution_Mode': 0x23
};

var GPIO_PIN = [
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
];

var WIRING_PIN = [
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
];

function init() {
	if (isInit) {
		return true;
	}

	convertedPin = convertPin(LED_PIN);

	if (convertedPin === -1) {
		console.log('pin error');

		process.exit(1);
	}

	wpi.setup('wpi');
	wpi.pinMode(convertedPin, wpi.PWM_OUTPUT);

	wpi.softPwmCreate(convertedPin, 100, 100);

	async.waterfall([
		// power mode
		function (cb) {
			console.log('Change power mode.');

			wire.writeByte(0x01, function(err) {
				if (err) {
					console.log(err);
					cb(new Error('power mode change fail.'), 'fail');
				} else {
					cb(null, 'ok');
				}
			});
		}
	],
	function (err, result) {
		if (!err) {
			isInit = true;
		}
	});

	

	return isInit;
}

function convertPin(gpioPin) {
    var wiringLength, i;

    wiringLength = WIRING_PIN.length;

    for (var i = 0; i < wiringLength; i++) {
        if (GPIO_PIN[i] == gpioPin) {
            return WIRING_PIN[i];
        }
    }

    return -1;
}

(function getLux() {
	if (init()) {
		async.series([
			function (callback) {
				var hi = 0, lo = 0, li, lightValue;

				wire.readBytes(MEASURE_MODE['Continuous_H_Resolution_Mode'], 2, function(err, bytes) {
					if (err) {
						callback(new Error('read fail.'), 'fail');
					} else {
						hi = bytes.readUInt8(0);
						lo = bytes.readUInt8(1);
						li = ((hi << 8) + lo) / 1.2;
						lightValue = li / MAX_LUX * REVISION;

						if (lightValue > 100) {
							lightValue = 100;
						}

						callback(null, lightValue);
					}
				});
			}
		],
		function (err, result) {
			if (err) {
				console.log('err >>> ' + err);

				process.exit(1);
			}

			console.log('light >>> ' + result);

			wpi.softPwmWrite(convertedPin, parseInt(result));

			// blaster.setPwm(18, result);
		});
	}

	setTimeout(function() {
		getLux();
	}, 500);
})();

process.on('SIGINT', function() {
	console.log('exit');
	wpi.softPwmStop(1);
	process.exit();
});