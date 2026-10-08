package com.biagiocota.garganoexplorer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class GarganoexplorerApplication {

	public static void main(String[] args) {
		SpringApplication.run(GarganoexplorerApplication.class, args);
	}

}
