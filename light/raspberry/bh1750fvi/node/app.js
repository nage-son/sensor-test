var gpio = require('onoff').Gpio;
var i2c = require('i2c');
var async = require('async');
var wire = new i2c(0x23, {'device': '/dev/i2c-1'});
var wpi = require('wiring-pi');
var isInit = false;
var MAX_LUX = 65535;
var REVISION = 5000;

wpi.setup('wpi');
wpi.pinMode(1, wpi.PWM_OUTPUT);

measurementModes = {
  'Continuous_H_Resolution_Mode': 0x10,
  'Continuous_H_Resolution_Mode2': 0x11,
  'Continuous_L_Resolution_Mode': 0x13,
  'OneTime_H_Resolution_Mode': 0x20,
  'OneTime_H_Resolution_Mode2': 0x21,
  'OneTime_L_Resolution_Mode': 0x23
};

function init() {
	if (isInit) {
		return true;
	}

	wpi.softPwmCreate(1, 100, 100);

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

(function getLux() {
	if (init()) {
		async.series([
			function (callback) {
				var hi = 0, lo = 0, li, lightValue;

				wire.readBytes(measurementModes['Continuous_H_Resolution_Mode'], 2, function(err, bytes) {
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

			wpi.softPwmWrite(1, parseInt(result));

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