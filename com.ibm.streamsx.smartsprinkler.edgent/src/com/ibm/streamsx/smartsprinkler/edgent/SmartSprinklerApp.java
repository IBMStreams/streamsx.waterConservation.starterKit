/* begin_generated_IBM_copyright_prolog                             */
/*                                                                  */
/* This is an automatically generated copyright prolog.             */
/* After initializing,  DO NOT MODIFY OR MOVE                       */
/* **************************************************************** */
/* (C) Copyright IBM Corp.  2016, 2016                              */
/* All Rights Reserved.                                             */
/* **************************************************************** */
/* end_generated_IBM_copyright_prolog                               */
package com.ibm.streamsx.smartsprinkler.edgent;

import java.io.File;
import java.util.concurrent.TimeUnit;

import org.apache.edgent.connectors.iot.QoS;
import org.apache.edgent.connectors.iotp.IotpDevice;
import org.apache.edgent.providers.direct.DirectProvider;
import org.apache.edgent.topology.TStream;
import org.apache.edgent.topology.TWindow;
import org.apache.edgent.topology.Topology;

import com.google.gson.JsonObject;

public class SmartSprinklerApp {
	/* begin_generated_IBM_copyright_code                               */
	public static final String IBM_COPYRIGHT =
		" (C) Copyright IBM Corp.  2016, 2016    All Rights Reserved.     " + //$NON-NLS-1$ 
		"                                                                 " ; //$NON-NLS-1$ 
	/* end_generated_IBM_copyright_code                                 */

	public static final double THRESHOLD_LOW = 100;
	public static final double THRESHOLD_HIGH = 700;

	private static final String DEVICE_FN = "./device.cfg";
	
	public static void main(String[] args) throws Exception {
		DeviceConfig devicecfg = new DeviceConfig(DEVICE_FN);
		
		ISprinklerController smartSprinkler = devicecfg.isSimulation() ? new SprinklerSimulator() : new SprinklerSimulatorWithSensor();

		DirectProvider dp = new DirectProvider();
		Topology topology = dp.newTopology();
		
		// poll from sensor periodically
		final long msec = devicecfg.isSimulation() ? 3000 : 1000;		
		TStream<Reading> moistureReading = topology.poll(smartSprinkler, msec, TimeUnit.MILLISECONDS);

		// set up window of 9 readings
		TWindow<Reading, ?> lastNReadings = moistureReading.last(9, t -> {
			return 0;
		});

		// calculate the rolling average of data from the window
		TStream<Reading> avg = lastNReadings.aggregate((window, partition) -> {
			double sum = 0;
			for (Reading r : window) {
				sum += r.getMoisture();
			}
			double avgReading = sum / window.size();

			// turn sprinkler off if the soil has enough moisture
			if (avgReading >= THRESHOLD_HIGH) {
				smartSprinkler.setSprinkler(false);
			}

			System.out.println("Avg: " + avgReading);
			return new Reading(avgReading, smartSprinkler.isSprinklerOn());
		});

		// Send sensor reading to dashboard
		// This is done so that we can visualize the data.
		// In reality, this is not needed
		avg.sink(avgMoisture -> {
			PostReading sink = new PostReading(devicecfg.getUIHostURL() + "/api/streams/sensorreading");
			
			sink.post(avgMoisture);
		});

		// Send request to water if, the soil is too dry, and the sprinkler is
		// not on, and no rain is scheduled
		TStream<Reading> dry = avg
				.filter(reading -> (reading.getMoisture() < THRESHOLD_LOW && !smartSprinkler.isSprinklerOn() && !smartSprinkler.isRainComing()));

		dry.print();

		// send to IoTF to request to turn on sprinkler
		IotpDevice device = new IotpDevice(topology, new File(DEVICE_FN));

		// convert to json object
		TStream<JsonObject> json = dry.map(v -> {
			System.out.println("Send Request: " + v.toJson());
			return v.toJsonObject();
		});

		// send request via device
		device.events(json, "waterRequest", QoS.FIRE_AND_FORGET);

		// listen for commands from IotF
		TStream<JsonObject> responses = device.commands(new String[0]);
		responses.print();

		// process the command
		responses.sink(res -> {
			boolean sprinkler = ((JsonObject) res.get("payload")).get("approval").getAsBoolean();
			String reason = ((JsonObject) res.get("payload")).get("reason").getAsString();
			System.out.println(res);

			// set sprinkler on / off based on water request approval
			smartSprinkler.setSprinkler(sprinkler);

			// it's going to rain, so make rain!!!
			if (!sprinkler && reason.indexOf("rain") > -1) {
				smartSprinkler.scheduleRain(10000, 10000);
			}
		});

		// submit this topology for it to run
		dp.submit(topology);
	}

}
