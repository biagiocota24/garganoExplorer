package com.biagiocota.garganoexplorer.photo;

import com.biagiocota.garganoexplorer.photo.PhotoService;
import com.biagiocota.garganoexplorer.photo.UploadSignatureResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/photos")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;

    @PostMapping("/signature")
    public UploadSignatureResponse createSignature() {
        return photoService.createUploadSignature();
    }
}