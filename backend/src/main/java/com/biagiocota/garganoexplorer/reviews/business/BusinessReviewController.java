package com.biagiocota.garganoexplorer.reviews.business;

import com.biagiocota.garganoexplorer.common.tools.SecurityTools;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/businesses/{businessId}/reviews")
@RequiredArgsConstructor
public class BusinessReviewController {
    private final BusinessReviewService businessReviewService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Page<BusinessReviewResponse> getReviewsByBusiness(@PathVariable UUID businessId , @PageableDefault Pageable pageable){
        return businessReviewService.findByBusiness(businessId , pageable );
    }

    @GetMapping("/mine")
    public ResponseEntity<BusinessReviewResponse> findMine(@AuthenticationPrincipal UUID authorId , @PathVariable UUID businessId){
        return businessReviewService.findMine(authorId, businessId)
                .map(b-> ResponseEntity.ok(b))
                .orElse(ResponseEntity.noContent().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BusinessReviewResponse createReview(@PathVariable UUID businessId , @AuthenticationPrincipal UUID userId, @Valid@RequestBody BusinessReviewRequest request){
        return businessReviewService.create(businessId , userId , request);
    }

    @PutMapping("/{reviewId}")
    @ResponseStatus(HttpStatus.OK)
    public  BusinessReviewResponse updateReview(@PathVariable UUID businessId ,@PathVariable UUID reviewId, @AuthenticationPrincipal UUID userId , @Valid@RequestBody BusinessReviewRequest request){
        return businessReviewService.update(businessId , reviewId , userId , request);
    }

    @DeleteMapping("/{reviewId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public  void delete(@PathVariable UUID businessId , @PathVariable UUID reviewId, @AuthenticationPrincipal UUID userId , Authentication authentication){
        businessReviewService.delete(businessId , reviewId , userId , SecurityTools.isAdmin(authentication));
    }

}
