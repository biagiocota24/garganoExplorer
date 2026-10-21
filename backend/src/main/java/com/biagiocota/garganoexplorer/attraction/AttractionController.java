package com.biagiocota.garganoexplorer.attraction;

import com.biagiocota.garganoexplorer.common.Town;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/attractions")
@RequiredArgsConstructor
public class AttractionController {
    private final AttractionService attractionService;


    @GetMapping
    public Page<AttractionResponse> getAllOrFiltered(@RequestParam(required = false) Town town, @RequestParam(required = false) AttractionCategory category, @PageableDefault(size = 12, sort = "name") Pageable pageable) {
        return attractionService.findAll(town, category, pageable);
    }

    @GetMapping("/{id}")
    public AttractionResponse getAttraction(@PathVariable UUID id) {
        return attractionService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AttractionResponse createAttraction(@Valid @RequestBody AttractionRequest request) {
        return attractionService.createAttraction(request);
    }

    @PutMapping("/{id}")
    public AttractionResponse updateAttraction(@PathVariable UUID id, @Valid @RequestBody AttractionRequest request) {
        return attractionService.updateAttraction(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAttraction(@PathVariable UUID id) {
        attractionService.deleteAttraction(id);
    }


}
