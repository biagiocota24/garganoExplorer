package com.biagiocota.garganoexplorer.reviews.attraction;

import com.biagiocota.garganoexplorer.common.tools.SecurityTools;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/attractions/{attractionId}/reviews")
@RequiredArgsConstructor
public class AttractionReviewController {
    private final AttractionReviewService attractionReviewService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Page<AttractionReviewResponse> findByAttraction(@PathVariable UUID attractionId , @PageableDefault Pageable pageable){
        return attractionReviewService.findByAttraction(attractionId , pageable);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AttractionReviewResponse create(@PathVariable UUID attractionId , @AuthenticationPrincipal UUID authorId , @Valid@RequestBody AttractionReviewRequest request){
        return attractionReviewService.create(attractionId,authorId,request);
    }

    @PutMapping("/{reviewId}")
    @ResponseStatus(HttpStatus.OK)
    public AttractionReviewResponse update(@PathVariable UUID attractionId , @PathVariable UUID reviewId , @AuthenticationPrincipal UUID authorId , @Valid@RequestBody AttractionReviewRequest request){
        return attractionReviewService.update(attractionId, reviewId, authorId, request);
    }

    @DeleteMapping("/{reviewId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReview(@PathVariable UUID attractionId , @PathVariable UUID reviewId , @AuthenticationPrincipal UUID userId  , Authentication authentication){
        attractionReviewService.delete(attractionId , reviewId , userId , SecurityTools.isAdmin(authentication));
    }
}
