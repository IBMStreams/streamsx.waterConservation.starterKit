# Moisture Sensing Edgent Application

## Overview

This application reads moisture data from the moisture sensor and makes decision to turn on the sprinkler (i.e. the buzzer), when conditions are met.  It passes moisture data to the Watson Internet of Things Platform, and the Streaming Analytics application ingests the data and make makes the final decision on the sprinkler control.

## Setting up device configuration file

Once the Node.js application is deployed on Bluemix, it generates a device configuration file.  This application uses the device configuration file to connect to the Watson Internet Of Things Platform, as well as to the dashboard on the Node.js application.

To download the device file, click the hamburger icon on the top left corner, and select Settings, then Download the `device.cfg` file.  A [sample file](device.cfg) is stored in the root directory of the project for reference.

![Water Conservation Device Config](../readmeImg/water_conservation_devicecfg.png)

## Running Simulation on your workstation

1.  Download the smartsprinkler.edgent-x.x.x.jar from the latest [release](https://github.com/IBMStreams/streamsx.waterConservation.starterKit/releases).
1.  Make sure device.cfg and the smartsprinkler.edgent-x.x.x.jar are in the same directory.
1.  In the device.cfg file, set the `simulation` property to `true`.
1.  Run the simulator using this command in the terminal:  `java -jar smartsprinkler.edgent-x.x.x.jar`

## Running on your Raspberry Pi 2
1.  Connect the digital output of moisture sensor to GPIO17
1.  Connect the buzzer input to GPIO23
1.  Download the smartsprinkler.edgent-x.x.x.jar from the latest [release](https://github.com/IBMStreams/streamsx.waterConservation.starterKit/releases).
1.  In the device.cfg file, set the `simulation` property to `false`.
1.  Make sure device.cfg and the smartsprinkler.edgent-x.x.x.jar are in the same directory.
1.  Run the simulator using this command in the terminal:  `sudo java -jar smartsprinkler.edgent-x.x.x.jar`

*What kind of moisture sensor did you use?*
We got our moisture sensor from here:
[Moisture Sensor from ModMyPi](http://www.modmypi.com/electronics/sensors/soil-moisture-sensor)

Here's a tutorial on how to connect the sensor:  [Raspberry Pi Moisture Sensor Tutorial](http://www.modmypi.com/blog/raspberry-pi-plant-pot-moisture-sensor-with-email-notification-tutorial)

## Developing the Edgent Application

1. Import the eclipse project in `com.ibm.streamsx.smartsprinkler.edgent`
1. Download [Apache Edgent][1] and [Pi4J][2] libraries, and make the jar files available on your machine.  Configure the classpath variables EDGENT and PI4J to the location of the libraries.  For example, set EDGENT and PI4J to `/opt/edgent/java8` and `/opt/pi4j` respectively.
1. Copy the device configuration file to the root of the project

### Running Your Project using Eclipse

1. Ensure the Node.js application (i.e. the dashboard) is running on Bluemix.
1. Modify `device.cfg`, and set the property `simulation` to `true`.
1. Ensure the property `ui-host` is set to the URL of the Node.js application.
1. Right click `SmartSprinklerApp.java`, and Run as Java Application.
1. The dashboard should plot the moisture data received by this application on the graph.

### Running Your Project on Raspberry Pi

1. Create a runnable Jar file by right clicking on the project, and Export as a Runnable JAR file.
1. Select the launch configuration that was created when you run the simulation on the workstation.
1. Select an appropriate destination file name for the runnable jar.
1. Select `Package required libraries into generated JAR`.
1. Click `Finish` to create the runnable JAR.
1. Copy the runnable JAR and the `device.cfg` to the Raspberry Pi.
1. Ensure the property `simulation` in `device.cfg` is set to `false`.
1. On the pi, `sudo java -jar <runnable.jar>`. (You must be root to run this)
1. The dashboard should plot the moisture data received by the pi on the graph.

# Links
* Apache Edgent: http://edgent.incubator.apache.org
* Pi4J: http://pi4j.com
* Pi4J Pin Numbering: http://pi4j.com/pins/model-b-rev2.html

[1]: http://edgent.incubator.apache.org
[2]: http://pi4j.com
