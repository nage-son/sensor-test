var gpio = require('onoff').Gpio;
var sleep = require('sleep');
var led = new gpio(17, 'out');
var motion = new gpio(18, 'in');

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