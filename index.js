var tessel = require('tessel');

var ServoImport = require('servo-pca9685');
var Servo;

var AccelImport = require('accel-mma84');
var Accel;

function Accelerometer(Callback)
{
  Accel = AccelImport.use(tessel.port['B']);

  //define the globals
  this.X = 0;
  this.Y = 0;
  this.Z = 0;
  this.Configured = false;

  //export it so anonymous functions can use it
  var that = this;

  // Initialize the accelerometer.
  Accel.on('ready', function () 
  {
    var Executed = false;

    // Stream accelerometer data
    Accel.on('data', function (xyz) 
    {
      that.X = xyz[0];
      that.Y = xyz[1];
      that.Z = xyz[2];

      //only callback and sest configured once we've gotten the first round of data 
      if(!Executed)
      {
        that.Configured = true;
        Executed = true;
        console.log("Setup Accelerometer");
        Callback();
      }
    });
  });
}

// Constructor
function Servo(LeftServoNumber, RightServoNumber, Callback) 
{
  //the servo is always on port A
  ServoImport = sevoimport.use(tessel.port['A']);

  //set up the servo configuraiton. This is tuned for the servos on the android.
  this.LeftServoConfig = {"Direction": -1, "Number": LeftServoNumber, "Bottom": .045, "Top": .115};
  this.RightServoConfig = {"Direction": 1, "Number": RightServoNumber, "Bottom": .0425, "Top": .1125};
  this.Configured = false;

  //this is so that the anonymous functions can access it
  var that = this;

  //once the servo shield is ready, configure everything
  Servo.on('ready', function () 
  {
    Servo.configure(that.LeftServoConfig["Number"], that.LeftServoConfig["Bottom"], that.LeftServoConfig["Top"], function () {
      Servo.configure(that.RightServoConfig["Number"], that.RightServoConfig["Bottom"], that.RightServoConfig["Top"], function () 
      {
        Servo.move(that.LeftServoConfig["Number"], .5);
        Servo.move(that.RightServoConfig["Number"], .5);
        that.Configured = true;
        console.log("Setup Servos.");
        Callback();
      });
    });
  });
}

// class methods
Servo.prototype.Move = function(ServoName, Speed)
{
  console.log("Moving " + ServoName + " at speed " + Speed);

  if(Math.abs(Speed) > 100)
  {
    throw new Error("Speed out of range [-100, 100].");
  }

  if(ServoName == "Left" || ServoName == "left")
  {
    Speed *= this.LeftServoConfig["Direction"];
    Speed = (parseFloat(Speed) + 100.0) / 200.0;
    Servo.move(this.LeftServoConfig["Number"], Speed);
  }

  if(ServoName == "Right" || ServoName == "right")
  {
    Speed *= this.RightServoConfig["Direction"];
    Speed = (parseFloat(Speed) + 100.0) / 200.0;
    Servo.move(this.RightServoConfig["Number"], Speed);
  }
};

// export the classes
module.exports.Servo = Servo;
module.exports.Accelerometer = Accelerometer;