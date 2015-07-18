# tessel-summer-camp
## project

This repository houses the libraries for the Seattle Academy Tessel summer camp. These libraries were built to allow easy access to the Tessel’s servo shield, accelerometer shield, and GPIO pins. This will allow students to move around a small robot and allow it to interact with its environment.

## software setup

The controller.js file contains all of the libraries needed. To import this library, simple install it on npm. This will put it in the node_moduels folder.
```
npm install 
```
To import the module into your program, just use require. 
```
var Controller = require("tessel-summer-camp");
```

## hardware setup

The button class in the tessel-summer-camp module allows the user to choose which port to use. However, every other class requires specific ports or pins to be used. Below is the tessel wiring layout:

![alt tag](http://isaaczinda.com/Downloads/WiringDiagram.png)  

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

## button

To use the button command, just initialize a new instance of the button object. The pin variable will be the GPIO pin, as a string. This could look like "G3" or "G6". The function variable will be the function that is called when the button is pressed. 

```
function Function()
{
	console.log("Pressed!");
}
new Controller.Button("G3", Function);
```

## led matrix

For the LED Matrix to work properly, additional setup steps need to be taken. The code located in the directory node_modules/tessel-summer-camp/ArduinoLEDMatrix needs to be installed onto an ardiuno mini pro. Now you are ready to go!

To use the controller's LEDMatrix function, you first need to initialize the object. The only argument for the constructor is a callback, which will be run when the program sends its first data to the Led Matrix.

```
LEDs = new Controller.LEDMatrix(function()
{
});
```

The clear function clears the Led Matrix:

```
LEDs.Clear();
```

The SetLight function turns on one of the LEDs in the matrix. Its first argument is OnOrOff, which is a string. If you want to turn the LED on, pass a "1". To turn it off, pass a "0". The second argument is an integer called Number. This is the position of the LED to turn on or off. The positions range from 0 to 63, and the order is from left to right (like reading).

```
LEDs.SetLight("1", 0); //turns the first LED on
``` 

## sound

To use the controller's Sound function, you first need to initialize the object. The Port variable should be set to 0, 1, or 2. These port values correspond with the G4, G5, and G6 GPIO pins. The Callback function will be called when the Sound function has been configured.

 ```
Piezo = new Controller.Sound(0, function() //sets the port to 0, which is pin G4 
{
});
```

To change the frequency of the sound, simply change the Frequency property of the Sound function:

```
Piezo.Frequency = 1000; //this will set the frequency to 1000
``` 

To turn the sound off, set the frequency to 0.
```
Piezo.Frequency = 0;
``` 