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

import java.io.Serializable;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

//sensor:  id, lat, long, sprinklerOnOff, moisture

@SuppressWarnings("serial")
public class Reading implements Serializable {
	/* begin_generated_IBM_copyright_code                               */
	public static final String IBM_COPYRIGHT =
		" (C) Copyright IBM Corp.  2016, 2016    All Rights Reserved.     " + //$NON-NLS-1$ 
		"                                                                 " ; //$NON-NLS-1$ 
	/* end_generated_IBM_copyright_code                                 */

	// coordinates from GPS 
	@SuppressWarnings("unused")
	private double latitude = 43.7001100;
	@SuppressWarnings("unused")
	private double longitude = -79.4163000;
	
	// sprinkler is on or off
	private boolean sprinkler_on = false;
	
	// current moisture level
	private double moisture = 60;	
	
	private static Gson GSON = new Gson();
	private static JsonParser PARSER = new JsonParser();
	
	public Reading(double moisture, boolean sprinkler){
		this.moisture = moisture;
		sprinkler_on = sprinkler;
	}
	
	public String toJson(){
		return GSON.toJson(this);
	}
	
	public JsonObject toJsonObject(){
		return PARSER.parse(toJson()).getAsJsonObject();
	}
	
	public double getMoisture() {
		return moisture;
	}
	
	public boolean isSprinklerOn() {
		return sprinkler_on;
	}
}
