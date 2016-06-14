# Water Request Decision-Maker Streams Application

## Overview

This streams application process the water request events and decide if the sprinkler should be turned on or off.

## Setup project on your workstation

1. Import the eclipse project in `com.ibm.streamsx.smartsprinkler.streams`
1. Download the [dependent streams toolkits](#Dependencies), extract them and place the content into a local folder.
1. In Eclipse, navigate to the `Streams Explorer` view and add the local toolkit folder into the Streams installation.  The SPL build should now succeed, and the SAB file produced in the default output directory.

# Dependencies
* com.ibm.streamsx.json toolkit 1.1.1: https://github.com/IBMStreams/streamsx.json/releases/tag/v1.1.1
* com.ibm.streamsx.weather toolkit 1.0.0: https://github.com/IBMStreams/streamsx.weather
* com.ibm.streamsx.inet toolkit 2.7.4: https://github.com/IBMStreams/streamsx.inet/releases/tag/v2.7.4
* com.ibm.streamsx.datetime toolkit 1.1.1: https://github.com/IBMStreams/streamsx.datetime/releases/tag/v1.1.1
* com.ibm.streamsx.iot toolkit v0.8.0: https://github.com/IBMStreams/streamsx.iot/releases/tag/v0.8.0
* com.ibm.streamsx.messaging toolkit 3.0.0: https://github.com/IBMStreams/streamsx.messaging/releases/tag/v3.0.0
* com.ibm.streamsx.topology toolkit 1.3.0: https://github.com/IBMStreams/streamsx.topology/releases/tag/v1.3.0
