package com.biagiocota.garganoexplorer.map;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/map-places")
@RequiredArgsConstructor
public class MapController {
    private final MapService mapService;

    @GetMapping
    public List<MapPlaceResponse> getAll(){
        return mapService.getAllEntityPlaces();
    }
}
