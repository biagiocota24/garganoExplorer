package com.biagiocota.garganoexplorer.attraction;

import com.biagiocota.garganoexplorer.common.Town;
import com.biagiocota.garganoexplorer.common.tools.TextNormalizerTools;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttractionService {
    private final AttractionRepository attractionRepository;

    @Transactional(readOnly = true)
    public Page<AttractionResponse> findAll(Town town, AttractionCategory attractionCategory, Pageable pageable) {
        if (town != null && attractionCategory != null) {
            return attractionRepository.findByTownAndCategory(town, attractionCategory, pageable).map(AttractionResponse::from);
        }
        if (town != null) {
            return attractionRepository.findByTown(town, pageable).map(AttractionResponse::from);
        }
        if (attractionCategory != null) {
            return attractionRepository.findByCategory(attractionCategory, pageable).map(AttractionResponse::from);
        }
        return attractionRepository.findAll(pageable).map(AttractionResponse::from);
    }

    @Transactional(readOnly = true)
    public AttractionResponse getById(UUID id) {
        Attraction attractionFound = attractionRepository.findById(id).orElseThrow(AttractionNotFoundException::new);
        return AttractionResponse.from(attractionFound);
    }

    private void applyRequest(Attraction attraction, AttractionRequest request) {
        attraction.setName(TextNormalizerTools.name(request.name()));
        attraction.setDescription(request.description().trim());
        attraction.setTown(request.town());
        attraction.setCategory(request.category());
        attraction.setLatitude(request.latitude());
        attraction.setLongitude(request.longitude());
    }

    @Transactional
    public AttractionResponse createAttraction(AttractionRequest request) {
        Attraction newAttraction = new Attraction();
        applyRequest(newAttraction, request);
        Attraction saved = attractionRepository.saveAndFlush(newAttraction);
        return AttractionResponse.from(saved);
    }

    @Transactional
    public AttractionResponse updateAttraction(UUID id, AttractionRequest request) {
        Attraction attractionToUpdate = attractionRepository.findById(id).orElseThrow(AttractionNotFoundException::new);
        applyRequest(attractionToUpdate, request);
        attractionRepository.flush();
        return AttractionResponse.from(attractionToUpdate);
    }

    @Transactional
    public void deleteAttraction(UUID id) {
        if (!attractionRepository.existsById(id)) {
            throw new AttractionNotFoundException();
        }
        attractionRepository.deleteById(id);
    }


}


