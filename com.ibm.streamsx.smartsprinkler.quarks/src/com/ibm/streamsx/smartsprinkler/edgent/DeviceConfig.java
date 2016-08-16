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

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class DeviceConfig {
	/* begin_generated_IBM_copyright_code                               */
	public static final String IBM_COPYRIGHT =
		" (C) Copyright IBM Corp.  2016, 2016    All Rights Reserved.     " + //$NON-NLS-1$ 
		"                                                                 " ; //$NON-NLS-1$ 
	/* end_generated_IBM_copyright_code                                 */

	private static final String UI_HOST_KEY = "ui-host";
	private static final String SIMULATION_KEY = "simulation";

	private static String uiHostUrl;
	private static Boolean isSimulation;
	
	DeviceConfig(String filename) {
		try (FileInputStream input = new FileInputStream(filename)){
			Properties prop = new Properties();
			prop.load(input);
			
			uiHostUrl = prop.getProperty(UI_HOST_KEY);			
			System.out.println("UI host configure to: " + uiHostUrl);
			
			isSimulation = Boolean.parseBoolean(prop.getProperty(SIMULATION_KEY, "false"));
			System.out.println("Running Simulation: " + isSimulation);
		} catch (IOException ex) {
			ex.printStackTrace();
		}
	}
	
	String getUIHostURL () {
		return uiHostUrl;
	}
	
	Boolean isSimulation() {
		return isSimulation;
	}
}
