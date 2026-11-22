package com.biagiocota.garganoexplorer.reviews.business;

import com.biagiocota.garganoexplorer.business.Business;
import com.biagiocota.garganoexplorer.business.BusinessNotFoundException;
import com.biagiocota.garganoexplorer.business.BusinessRepository;
import com.biagiocota.garganoexplorer.common.exception.ForbiddenOperationException;
import com.biagiocota.garganoexplorer.notification.NotificationService;
import com.biagiocota.garganoexplorer.notification.NotificationType;
import com.biagiocota.garganoexplorer.reviews.ReviewAlreadyExistsException;
import com.biagiocota.garganoexplorer.reviews.ReviewNotFoundException;
import com.biagiocota.garganoexplorer.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BusinessReviewService {
    private final BusinessReviewRepository businessReviewRepository;
    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;



    @Transactional(readOnly = true)
    public Page<BusinessReviewResponse> findByBusiness(UUID businessId , Pageable pageable){
        if (!businessRepository.existsById(businessId)){
            throw new BusinessNotFoundException();
        }
        Page<BusinessReview>  businessReviews = businessReviewRepository.findByBusinessId(businessId ,pageable);
        return businessReviews.map(BusinessReviewResponse::from);
    }

    @Transactional
    public BusinessReviewResponse create(UUID businessId , UUID authorId , BusinessReviewRequest request){
        Business businessToRate = businessRepository.findById(businessId).orElseThrow(BusinessNotFoundException::new);
        if (businessReviewRepository.existsByAuthorIdAndBusinessId(authorId, businessId)){
            throw new ReviewAlreadyExistsException("Hai già recensito questa attività");
        }
        BusinessReview newReview = new BusinessReview();
        newReview.setBusiness(businessToRate);
        newReview.setAuthor(userRepository.getReferenceById(authorId));
        newReview.setText(request.text().trim());
        newReview.setRating(request.rating());
        BusinessReview saved = businessReviewRepository.saveAndFlush(newReview);
        updateReviewCountAndAverageRating(businessToRate);

        String notificationMessage = "%s ha lasciato una recensione da %d/5".formatted(newReview.getAuthor().getDisplayName(),newReview.getRating());

        notificationService.create(businessToRate.getOwner() , NotificationType.NEW_REVIEW , notificationMessage , businessToRate.getId() , businessToRate.getName());

        return BusinessReviewResponse.from(saved);
    }

    @Transactional
    public  BusinessReviewResponse update(UUID businessId,UUID reviewId , UUID authorId , BusinessReviewRequest request){
        BusinessReview reviewToUpdate = businessReviewRepository.findById(reviewId).orElseThrow(()-> new ReviewNotFoundException("Recensione non trovata"));
        if (!reviewToUpdate.getBusiness().getId().equals(businessId)){
            throw new ReviewNotFoundException("Recensione non allegata a questa attività");
        }
        if (!reviewToUpdate.getAuthor().getId().equals(authorId)){
            throw new ForbiddenOperationException("Non puoi modificare la recensione di un altro utente");
        }
        reviewToUpdate.setText(request.text().trim());
        reviewToUpdate.setRating(request.rating());
        businessReviewRepository.flush();
        updateReviewCountAndAverageRating(reviewToUpdate.getBusiness());

        return BusinessReviewResponse.from(reviewToUpdate);
    }

    @Transactional
    public void delete(UUID businessId , UUID reviewId , UUID userId , boolean isAdmin){
        BusinessReview reviewToDelete = businessReviewRepository.findById(reviewId).orElseThrow(()-> new ReviewNotFoundException("Recensione non trovata"));
        if (!reviewToDelete.getBusiness().getId().equals(businessId)){
            throw new ReviewNotFoundException("La recensione non appartiene a questa attività");
        }
        boolean isAuthor = reviewToDelete.getAuthor().getId().equals(userId);
        if (!isAuthor && !isAdmin){
            throw new ForbiddenOperationException("Non puoi eliminare la recensione");
        }
        Business businessToUpdate = reviewToDelete.getBusiness();
        businessReviewRepository.delete(reviewToDelete);

        updateReviewCountAndAverageRating(businessToUpdate);
    }

    @Transactional(readOnly = true)
    public Optional<BusinessReviewResponse> findMine(UUID authorId , UUID businessId){
        if (!businessRepository.existsById(businessId)){
            throw new BusinessNotFoundException();
        }
        return businessReviewRepository.findByAuthorIdAndBusinessId(authorId, businessId)
                .map(BusinessReviewResponse::from);
    }


    private void updateReviewCountAndAverageRating(Business business){
        long count = businessReviewRepository.countByBusinessId(business.getId());
        Double averageRating = businessReviewRepository.findAverageRatingByBusinessId(business.getId());
        business.setAverageRating(averageRating);
        business.setReviewCount(count);
    }

}
