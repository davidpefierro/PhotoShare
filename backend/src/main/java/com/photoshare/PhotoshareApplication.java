package com.photoshare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.photoshare.app.config.FileStorageProperties;

@SpringBootApplication
@EnableConfigurationProperties({
    FileStorageProperties.class
})
public class PhotoshareApplication {

    public static void main(String[] args) {
        SpringApplication.run(PhotoshareApplication.class, args);
    }
}