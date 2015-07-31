var gpio = require('onoff').Gpio;
var sleep = require('sleep');
var led = new gpio(44, 'out'); // P8 GPIO_44
var motion = new gpio(45, 'in'); // P8 GPIO_45

(function motionCheck() {
	motion.read(function(err, value) {
		if (err) {
			throw err;
		}

		led.write(value, function(err) {
			if (err) {
				throw err;
			}
		});
	});

	setTimeout(function() {
		motionCheck();
	}, 0);
})();

process.on('SIGINT', function() {
	console.log('exit');
	led.unexport();
	motion.unexport();
	process.exit();
});