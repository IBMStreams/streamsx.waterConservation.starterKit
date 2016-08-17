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

import java.util.Random;

public class SprinklerSimulator implements ISprinklerController {
	/* begin_generated_IBM_copyright_code                               */
	public static final String IBM_COPYRIGHT =
		" (C) Copyright IBM Corp.  2016, 2016    All Rights Reserved.     " + //$NON-NLS-1$ 
		"                                                                 " ; //$NON-NLS-1$ 
	/* end_generated_IBM_copyright_code                                 */

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private static final double DEFAULT_RATE = 150;
	private static final double RAIN_RATE = 300;
	private static final double SPRINKLER_RATE = 200;
	

	private Random random = new Random();

	protected double moisture = 950;

	private boolean sprinklerOn = false;
	private boolean rainOn = false;

	private double rate = DEFAULT_RATE;
	
	private boolean isMakeMoreRain = true;

	public SprinklerSimulator() {

	}
	
	@Override
	public double getMoisture() {

		double evaporate = random.nextDouble() * rate;
		int on = sprinklerOn || rainOn ? 1 : -1;
		evaporate = evaporate * on;

		if ((moisture + evaporate) >= 0 && (moisture + evaporate) <= 1000) {
			moisture += evaporate;
		}

		System.out.println("Moisture: " + moisture);

		return moisture;
	}

	@Override
	public void setSprinkler(boolean on) {
		System.out.println("Sprinkler: " + on);
		
		sprinklerOn = on;
		rate = SPRINKLER_RATE;

		if (!on) {
			rate = DEFAULT_RATE;
		}
	}

	@Override
	public boolean isSprinklerOn() {
		return sprinklerOn;
	}

	public void setRain(boolean on) {
		System.out.println("Rain: " + on);
		rainOn = on;
		
		if (rainOn)
		{
			rate = RAIN_RATE;
		}
		else
		{
			rate = DEFAULT_RATE;
		}
	}

	public void scheduleRain(final long delay, final long duration) {
		Thread thread = new Thread(new Runnable() {

			@Override
			public void run() {
				try {
					Thread.sleep(delay);
					setRain(true);
					
					Thread.sleep(duration);
					setRain(false);
					
					isMakeMoreRain = true;
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		});
		
		if (isMakeMoreRain)
		{
			isMakeMoreRain = false;
			thread.start();
		}
	}

	@Override
	public Reading get() {
		double moisture = getMoisture();
		return new Reading(moisture, isSprinklerOn());
	}

	@Override
	public boolean isRainComing() {
		return !isMakeMoreRain;
	}
}
