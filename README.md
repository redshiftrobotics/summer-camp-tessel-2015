# tessel-summer-camp
## project

This repository houses the libraries for the Seattle Academy Tessel summer camp. These libraries were built to allow easy access to the Tessel’s servo shield, accelerometer shield, and GPIO pins. This will allow students to move around a small robot and allow it to interact with its environment.

## setup

The controller.js file contains all of the libraries needed. To import this library, simple install it on npm. This will put it in the node_moduels folder.
```
npm install 
```
To import the module into your program, just use require. 
```
var Controller = require("tessel-summer-camp");
```

## accelerometer

To use the controller’s accelerometer function, you need to initialize the object first. Run

```
Accelerometer = new Controller.Accelerometer(function()
{
});
```

This code will create the accelerometer object and call the anonymous function after sensor setup has begun. Once the sensor is initialized, it will gather data automatically as fast as it comes in. Just use the properties of the accelerometer prototype to get the sensor’s data.
The following command gets a bool that represents whether or not the sensor is configured.

```
Accelerometer.Congifured
```

The following three commands get floats that represent the position of the accelerometer sensor.

```
Accelerometer.X
Accelerometer.Y
Accelerometer.Z
```

## servo

To use the controller's servo function, you first need to initialize the servo object. LeftServoNumber is the position of the robot’s left servo on the servo shield, and RightServoNumber is the position of the robot’s right servo on the servo shield. The anonymous function is called when the servos have been setup and are ready to receive commands.

```
Servo = new Controller.Servo(LeftServoNumber, RightServoNumber, function()
{
});
```

The move function is used to move the servos once they are configured. The Servo argument indicated which servo to move, and must be either "left" or "right". The speed argument is the speed at which the servo should move, and must be between -100 and 100.

``` 
Servo.Move(Servo, Speed);
```

The configured property is a bool which will return true is the servos are setup.

```
Servo.Configured;
```