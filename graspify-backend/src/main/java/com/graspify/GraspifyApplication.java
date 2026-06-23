package com.graspify;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GraspifyApplication {
    public static void main(String[] args) {
        SpringApplication.run(GraspifyApplication.class, args);
    }
}