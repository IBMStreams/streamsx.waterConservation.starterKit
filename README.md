# streamsx.waterConservation.starterKit

Starter kit for smart and connected sprinkler system using [Apache Quarks](http://quarks.incubator.apache.org), Streaming Analytics and Insights for Weather

![Water Conservation Dashboard](readmeImg/water_conservation_dashboard.png)

## Overview
This project implements a smart sprinkler system using [IBM Insights for Weather](https://console.ng.bluemix.net/catalog/services/insights-for-weather), [Watson IoT Platform](http://www.ibm.com/cloud-computing/bluemix/internet-of-things/) and [Streaming Analytics Service](https://www.ng.bluemix.net/docs/services/StreamingAnalytics/index.html).  See the [Google+ Hangout Event](https://plus.google.com/events/c9i8t4j2mqq7g0d6ftad84c5bd8) for more detail.

The Node.js application (dashboard) is hosted on [http://waterconservation.mybluemix.net/](http://waterconservation.mybluemix.net/).

The Streams application is hosted on the Streaming Analytics Services on IBM Bluemix.

The [moisture sensing simulator application](com.ibm.streamsx.smartsprinkler.quarks) is written using [Apache Quarks](http://quarks.incubator.apache.org).  The simulator can be run on any workstation.  It can also be run with a moisture sensor and buzzer on a Raspberry Pi.

*Apache Quarks is an effort undergoing Incubation at The Apache Software Foundation (ASF), sponsored by the Incubator.

## Deploy to Bluemix

### Prerequisites

Create a [Bluemix](https://bluemix.net/) account.

### Option 1: Automatic Deployment

Click the button below to fork into IBM DevOps Services and deploy your own copy of this application on Bluemix, with a DevOps toolchain already configured.

We are deploying a number of applications onto Bluemix.  This process will take about 15 minutes to complete.

[![Deploy To Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy/index.html?repository=https://github.com/IBMStreams/streamsx.waterConservation.starterKit.git)

### Option 2: Manual Deployment

In Bluemix:
  1. Create a Streaming Analytics Service with the name `Streaming-Analytics`
  1. Create a Insights for Weather Service with the name `Insights-for-Weather`
  1. Create a Watson IoT Platform Service with the name `Internet-of-Things-Platform`

Then:
* ```cd nodejs```
* ```npm install```
* ```npm run build```
* ```cd ..```
* ```cf push -n <host prefix>```

## Deploy locally
* ```cd nodejs```
* modify [app/server/config/application-local.js](nodejs/app/server/config/application-local.js), and fill in the bluemix services credentials
* ```npm install```
* ```npm start```

By default, the server starts on localhost:3000

## Running the Apache Quarks Application

Refer to [com.ibm.streamsx.smartsprinkler.quarks/README.md](com.ibm.streamsx.smartsprinkler.quarks/README.md) for further information.

# Project File Structure

```
root
│   manifest.yml (Bluemix deployment configuration file)
|   README.md (The file you are reading now)
|   LICENSE.md (License Terms)
|   copysabs.sh (Scripts for copying streams SAB files into nodejs folder)
│
├───.bluemix (Bluemix pipeline configuration file)
├───readmeImg (Image files for README.md)
├───com.ibm.streamsx.smartsprinkler.iot (Streams project for connecting to IOT)
├───com.ibm.streamsx.smartsprinkler.streams (Streams project for making water decisions)
├───com.ibm.streamsx.smartsprinkler.quarks (Java project for gathering sensor data on Raspberry Pi)
└───nodejs (Node.js project for dashboard)
```

# Component Dependencies

The Java application running on Raspberry Pi require:
* [Pi4J library](http://pi4j.com)
* [Quarks library](http://quarks.incubator.apache.org/docs/community)

The components required by the Node.js app are documented in the [package.json](nodejs/package.json) in the `nodejs` directory.  The list include:
* async
* body-parser
* bunyan
* chart.js
* d3
* express
* http-proxy
* http-status-codes
* lodash
* material-ui
* moment
* multer
* react
* react-chartjs
* react-dom
* react-sparklines
* react-tap-event-plugin
* request
* socket.io
* superagent
* babel-core
* babel-eslint
* babel-loader
* babel-preset-es2015
* babel-preset-react
* eslint
* eslint-loader
* eslint-plugin-react
* react-hot-loader
* webpack
* webpack-dev-server

# License

The source code for the app is available under the Apache license, which is found in [LICENSE](LICENSE) in the root of this repository.
