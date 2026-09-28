package com.careerpilot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CareerPilotApplication {

    public static void main(String[] args) {
        SpringApplication.run(CareerPilotApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" AI Career OS (CareerPilot) Backend is Running! ");
        System.out.println(" Swagger UI: http://localhost:8080/swagger-ui.html");
        System.out.println(" H2 Console: http://localhost:8080/h2-console ");
        System.out.println("=================================================");
    }
}
