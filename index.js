var tessel = require('tessel');

var SrvoImport = require('servo-pca9685');
var Srvo;

var AccelImport = require('accel-mma84');
var Accel;

var BtnImport = require('tessel-gpio-button');
var Btn;

var uartBridge = tessel.port['D'].UART({baudrate: 9600}); 

//setup the string insert function
String.prototype.insertAt = function(index, string) { 
  return this.substr(0, index) + string + this.substr(index);
}

//must be port 0, 1, or 2
function Sound(Port, Callback)
{
  this.Port = Port;
  this.Frequency = 0;

  var that = this;

  Callback();

  setInterval(function()
  {
    if(that.Frequency = 0)
    {
      //set the sensor to off which = no sound
      gpio.pwm[this.Port].pwmDutyCycle(0);
    }
    else
    {
      // Tell the GPIO port that the frequency of its pwm pins is 100 Hz
      gpio.pwmFrequency(that.Frequency);  

      //set the sensor to half on half off
      gpio.pwm[that.Port].pwmDutyCycle(.5);
    }
  }, 100);
}

function Display(Callback)
{
  
  this.Character = "";
  uartBridge.write(this.Character);
  Callback();

}


function LEDMatrix(Callback)
{
  this.Data = "0000000000000000000000000000000000000000000000000000000000000000";
  this.Configured = false;

  var that = this;

  //send the serial command to the arduino every .1 seconds
  setInterval(function()
  {
    uartBridge.write("s");
    uartBridge.write(that.Data);
    uartBridge.write("e");

    //do the callback only once data has been sent
    if(!Configured)
    {
      Configured = true;
      Callback();
    }
  }, 100);
}

//set OnOrOff to "0" or "1"
LEDMatrix.prototype.SetLight = function (OnOrOff, Number)
{
  if(Number < 64)
  {
    this.Data = [this.Data.slice(0, Number), OnOrOff, this.Data.slice(Number + 1)].join('');
  }
}

//set OnOrOff to "0" or "1"
LEDMatrix.prototype.Clear = function()
{
  this.Data = "0000000000000000000000000000000000000000000000000000000000000000";
}

//the pin should be a string like 'G3'
function Button(Pin, PressedFunction)
{
  var Btn = BtnImport.use(tessel.port['GPIO'].pin[Pin]);

  this.Configured = false;
  this.Pin = Pin;

  var that = this;

  Btn.on('ready', function() 
  {
    var FirstPress = false;
    Btn.on('press', function() 
    {
      //for some reason the button triggers a press on startup. This negates that.
      if(FirstPress)
      {
        PressedFunction();
      }
      if(!FirstPress)
      {
        FirstPress = true;
      }
    });
  });
}

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
  Srvo = SrvoImport.use(tessel.port['A']);

  //set up the servo configuraiton. This is tuned for the servos on the android.
  this.LeftServoConfig = {"Direction": -1, "Number": LeftServoNumber, "Bottom": .045, "Top": .115};
  this.RightServoConfig = {"Direction": 1, "Number": RightServoNumber, "Bottom": .0425, "Top": .1125};
  this.Configured = false;

  //this is so that the anonymous functions can access it
  var that = this;

  //once the servo shield is ready, configure everything
  Srvo.on('ready', function () 
  {
    Srvo.configure(that.LeftServoConfig["Number"], that.LeftServoConfig["Bottom"], that.LeftServoConfig["Top"], function () {
      Srvo.configure(that.RightServoConfig["Number"], that.RightServoConfig["Bottom"], that.RightServoConfig["Top"], function () 
      {
        Srvo.move(that.LeftServoConfig["Number"], .5);
        Srvo.move(that.RightServoConfig["Number"], .5);
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
    Srvo.move(this.LeftServoConfig["Number"], Speed);
  }

  if(ServoName == "Right" || ServoName == "right")
  {
    Speed *= this.RightServoConfig["Direction"];
    Speed = (parseFloat(Speed) + 100.0) / 200.0;
    Srvo.move(this.RightServoConfig["Number"], Speed);
  }
};

// export the classes
module.exports.Servo = Servo;
module.exports.Accelerometer = Accelerometer;
module.exports.Button = Button;
module.exports.LEDMatrix = LEDMatrix;
module.exports.Sound = Sound;
module.exports.Display = Display;
