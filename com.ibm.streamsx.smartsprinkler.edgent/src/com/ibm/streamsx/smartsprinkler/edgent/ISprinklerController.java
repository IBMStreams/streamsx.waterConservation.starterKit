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

import org.apache.edgent.function.Supplier;

/**
 * Sprinkler controller interface for application
 * 
 *
 */
public interface ISprinklerController extends Supplier<Reading>{

	/**
	 * Turn the sprinkler on or off
	 * @param on true if turning sprinkler on, false otheriwse
	 */
	public void setSprinkler(boolean on);

	/**
	 * 
	 * @return if the sprinkler is on or off
	 */
	public boolean isSprinklerOn();
	
	/**
	 * Schedule for rain to come
	 * @param delay - how long to delay rain
	 * @param duration - how long to rain for
	 */
	public void scheduleRain(final long delay, final long duration);
	
	/**
	 * Check if rain is scheduled
	 * @return true if rain is scheduled, false otherwise
	 */
	public boolean isRainComing();

	/**
	 * 
	 * @return current moisture level
	 */
	public double getMoisture();

}