package com.biagiocota.garganoexplorer;

import com.biagiocota.garganoexplorer.photo.CloudinaryProperties;
import com.biagiocota.garganoexplorer.photo.CloudinarySigner;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class CloudinarySignerTest {
    private final CloudinarySigner signer = new CloudinarySigner(
            new CloudinaryProperties("cloud" , "key" , "abcd" , "folder")
    );

    @Test
    void signsLikeCloudinaryDocumentation(){
        String signature = signer.sign(Map.of(
                "timestamp","1315060510",
                "public_id", "sample_image",
                "eager", "w_400,h_300,c_pad|w_260,h_200,c_crop"
        ));

        assertEquals("bfd09f95f331f558cbd1320e67aa8d488770583e" , signature);
    }

    @Test
    void parameterOrderDoesNotChangeSignature() {
        String first = signer.sign(Map.of("folder", "garganoyes", "timestamp", "100"));
        String second = signer.sign(Map.of("timestamp", "100", "folder", "garganoyes"));

        assertEquals(first, second);
    }






}
