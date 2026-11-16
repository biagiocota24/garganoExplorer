package com.biagiocota.garganoexplorer.reviews.attraction;

import com.biagiocota.garganoexplorer.attraction.Attraction;
import com.biagiocota.garganoexplorer.attraction.AttractionNotFoundException;
import com.biagiocota.garganoexplorer.attraction.AttractionRepository;
import com.biagiocota.garganoexplorer.common.exception.ForbiddenOperationException;
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
public class AttractionReviewService {
    private final AttractionReviewRepository attractionReviewRepository;
    private final UserRepository userRepository;
    private final AttractionRepository attractionRepository;


    @Transactional(readOnly = true)
    public Page<AttractionReviewResponse>findByAttraction(UUID attractionId , Pageable pageable){
        if(!attractionRepository.existsById(attractionId)){
            throw new AttractionNotFoundException();
        }
        Page<AttractionReview> attractionReviews = attractionReviewRepository.findByAttractionIdOrderByCreatedAtDesc(attractionId , pageable);
        return attractionReviews.map(AttractionReviewResponse::from);
    }

    @Transactional
    public AttractionReviewResponse create(UUID attractionId , UUID authorId , AttractionReviewRequest request){
        Attraction attractionToRate = attractionRepository.findById(attractionId).orElseThrow(AttractionNotFoundException::new);
        if (attractionReviewRepository.existsByAuthorIdAndAttractionId(authorId , attractionId)){
            throw new ReviewAlreadyExistsException("Hai già recensito questa attrazione");
        }
        AttractionReview newReview = new AttractionReview();
        newReview.setAttraction(attractionToRate);
        newReview.setAuthor(userRepository.getReferenceById(authorId));
        newReview.setText(request.text().trim());
        AttractionReview saved = attractionReviewRepository.saveAndFlush(newReview);
        updateReviewCount(attractionToRate);

        return AttractionReviewResponse.from(saved);
    }

    @Transactional
    public AttractionReviewResponse update(UUID attractionId, UUID reviewId , UUID authorId , AttractionReviewRequest request){
        AttractionReview reviewToUpdate = attractionReviewRepository.findById(reviewId).orElseThrow(()-> new ReviewNotFoundException("Recensione non trovata"));
        if (!reviewToUpdate.getAttraction().getId().equals(attractionId)){
            throw new ReviewNotFoundException("Recensione non allegata a questa attrazione");
        }
        if (!reviewToUpdate.getAuthor().getId().equals(authorId)){
            throw new ForbiddenOperationException("Non puoi modificare la recensione di un altro utente");
        }
        reviewToUpdate.setText(request.text().trim());
        attractionReviewRepository.flush();

        return AttractionReviewResponse.from(reviewToUpdate);
    }

    @Transactional
    public void delete(UUID attractionId , UUID reviewId , UUID userId , boolean isAdmin){
        AttractionReview reviewToDelete = attractionReviewRepository.findById(reviewId).orElseThrow(()-> new ReviewNotFoundException("Recensione non trovata"));
        if (!reviewToDelete.getAttraction().getId().equals(attractionId)){
            throw new ReviewNotFoundException("La recensione non appartiene a questa attrazione");
        }
        boolean isAuthor = reviewToDelete.getAuthor().getId().equals(userId);
        if (!(isAuthor || isAdmin)){
            throw new ForbiddenOperationException("Non puoi eliminare la recensione");
        }
        Attraction attractionToUpdate = reviewToDelete.getAttraction();
        attractionReviewRepository.delete(reviewToDelete);

        updateReviewCount(attractionToUpdate);
    }

    @Transactional(readOnly = true)
    public Optional<AttractionReviewResponse> findMine(UUID authorId , UUID attractionId){
        if (!attractionRepository.existsById(attractionId)){
            throw new AttractionNotFoundException();
        }
        return attractionReviewRepository.findByAuthorIdAndAttractionId(authorId,attractionId)
                .map(AttractionReviewResponse :: from);
    }




    private void updateReviewCount(Attraction attraction){
        long count = attractionReviewRepository.countByAttractionId(attraction.getId());
        attraction.setReviewCount(count);
    }
}
