# tessel-summer-camp
## project

This repository houses the libraries for the Seattle Academy Tessel summer camp. These libraries were built to allow easy access to the Tessel’s servo shield, accelerometer shield, and GPIO pins. This will allow students to move around a small robot and allow it to interact with its environment.

## setup

The controller.js file contains all of the libraries needed. To import this library, simple write
```
var Controller = require("./controller.js");
```

## accelerometer

To use the controller’s accelerometer function, you need to initialize the object first. Run

```
Accelerometer = new Controller.Accelerometer(function()
{
});
```

This code will create the accelerometer object and call the anonymous function after sensor setup has begun. Once the sensor is initialized, it will gather data automatically as fast as it comes in. Just use the properties of the accelerometer prototype to get the sensor’s data.
Gets whether or not the sensor is configured.

```
Accelerometer.Congifured
```

Gets the accelerometer positioning.

```
Accelerometer.X
Accelerometer.Y
Accelerometer.Z
```