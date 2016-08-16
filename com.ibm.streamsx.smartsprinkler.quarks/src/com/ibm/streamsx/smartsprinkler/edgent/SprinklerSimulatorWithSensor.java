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

import com.pi4j.io.gpio.GpioController;
import com.pi4j.io.gpio.GpioFactory;
import com.pi4j.io.gpio.GpioPinDigitalInput;
import com.pi4j.io.gpio.GpioPinDigitalOutput;
import com.pi4j.io.gpio.PinState;
import com.pi4j.io.gpio.RaspiPin;

// This class implements Supplier<Reading> to provide Reading object for Topology
public class SprinklerSimulatorWithSensor extends SprinklerSimulator {
	/* begin_generated_IBM_copyright_code                               */
	public static final String IBM_COPYRIGHT =
		" (C) Copyright IBM Corp.  2016, 2016    All Rights Reserved.     " + //$NON-NLS-1$ 
		"                                                                 " ; //$NON-NLS-1$ 
	/* end_generated_IBM_copyright_code                                 */

	private static final long serialVersionUID = 1L;

	GpioPinDigitalOutput buzzer;
	GpioPinDigitalInput moistureSensor;
	
	final GpioController gpio = GpioFactory.getInstance();

	public SprinklerSimulatorWithSensor() {

		moistureSensor = gpio.provisionDigitalInputPin(RaspiPin.GPIO_00);
		
		buzzer = gpio.provisionDigitalOutputPin(RaspiPin.GPIO_02, PinState.LOW);
		buzzer.setShutdownOptions(true, PinState.LOW);
	}

	public double getMoisture() {	
		
		boolean isMoistureDetected = moistureSensor.isLow();
		
		System.out.println("Lots of moisture from sensor: " + isMoistureDetected);
		
		// if sensor detects that moisture is high
		if (isMoistureDetected)
		{
			moisture = 950;
		}
		
		return super.getMoisture();
	}

	@Override
	public void setSprinkler(boolean on) {
		super.setSprinkler(on);
		
		if (on)
		{
			buzzer.setState(PinState.HIGH);
		}
		else {
			buzzer.setState(PinState.LOW);
		}
	}


	@Override
	public Reading get() {
		double moisture = getMoisture();
		return new Reading(moisture, isSprinklerOn());
	}


}
