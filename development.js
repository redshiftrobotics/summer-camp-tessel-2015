var Controller = require('./index.js');

//var Servo = new Controller.Servo(1, 2, Loaded);
var Accelerometer;

function Loaded()
{
	console.log("Loaded");

	setInterval(function()
	{
		console.log(Accelerometer.X);
	}, 100);
}

Accelerometer = new Controller.Accelerometer(Loaded);