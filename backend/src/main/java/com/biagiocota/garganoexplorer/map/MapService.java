package com.biagiocota.garganoexplorer.map;

import com.biagiocota.garganoexplorer.attraction.AttractionRepository;
import com.biagiocota.garganoexplorer.business.BusinessRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MapService {
    private final AttractionRepository attractionRepository;
    private final BusinessRepository businessRepository;

    @Transactional(readOnly = true)
    public List<MapPlaceResponse> getAllEntityPlaces(){
        List<MapPlaceResponse> all = new ArrayList<>();

        attractionRepository.findAllByLatitudeIsNotNullAndLongitudeIsNotNull()
                .forEach(a-> all.add(MapPlaceResponse.fromAttraction(a)));

        businessRepository.findAllByLatitudeIsNotNullAndLongitudeIsNotNull()
                .forEach(b-> all.add(MapPlaceResponse.fromBusiness(b)));

        return all;
    }
}
