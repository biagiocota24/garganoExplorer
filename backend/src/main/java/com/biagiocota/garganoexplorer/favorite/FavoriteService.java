package com.biagiocota.garganoexplorer.favorite;

import com.biagiocota.garganoexplorer.attraction.Attraction;
import com.biagiocota.garganoexplorer.attraction.AttractionNotFoundException;
import com.biagiocota.garganoexplorer.attraction.AttractionRepository;
import com.biagiocota.garganoexplorer.attraction.AttractionResponse;
import com.biagiocota.garganoexplorer.business.Business;
import com.biagiocota.garganoexplorer.business.BusinessNotFoundException;
import com.biagiocota.garganoexplorer.business.BusinessRepository;
import com.biagiocota.garganoexplorer.business.BusinessResponse;
import com.biagiocota.garganoexplorer.favorite.attraction.FavoriteAttraction;
import com.biagiocota.garganoexplorer.favorite.attraction.FavoriteAttractionRepository;
import com.biagiocota.garganoexplorer.favorite.business.FavoriteBusiness;
import com.biagiocota.garganoexplorer.favorite.business.FavoriteBusinessRepository;
import com.biagiocota.garganoexplorer.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FavoriteService {
    private final FavoriteBusinessRepository favoriteBusinessRepository;
    private final FavoriteAttractionRepository favoriteAttractionRepository;
    private final BusinessRepository businessRepository;
    private final AttractionRepository attractionRepository;
    private final UserRepository userRepository;


@Transactional
    public void addBusiness(UUID userId, UUID businessId){
        Business business = businessRepository.findById(businessId).orElseThrow(BusinessNotFoundException::new);
        if (favoriteBusinessRepository.existsByUserIdAndBusinessId(userId,businessId)){
            return;
        }
        FavoriteBusiness favorite = new FavoriteBusiness();
        favorite.setUser(userRepository.getReferenceById(userId));
        favorite.setBusiness(business);
        favoriteBusinessRepository.save(favorite);
    }

    @Transactional
    public  void removeBusiness(UUID userId , UUID businessId){
        if (!favoriteBusinessRepository.existsByUserIdAndBusinessId(userId,businessId)){
            return;
        }
        favoriteBusinessRepository.deleteByUserIdAndBusinessId(userId,businessId);
    }

    @Transactional
    public  void addAttraction(UUID userId, UUID attractionId){
        Attraction attraction = attractionRepository.findById(attractionId).orElseThrow(AttractionNotFoundException::new);
        if (favoriteAttractionRepository.existsByUserIdAndAttractionId(userId, attractionId)){
            return;
        }
        FavoriteAttraction favorite = new FavoriteAttraction();
        favorite.setUser(userRepository.getReferenceById(userId));
        favorite.setAttraction(attraction);
        favoriteAttractionRepository.save(favorite);
    }

    @Transactional
    public void removeAttraction(UUID userId, UUID attractionId){
    if(!favoriteAttractionRepository.existsByUserIdAndAttractionId(userId, attractionId)){
        return;
    }
    favoriteAttractionRepository.deleteByUserIdAndAttractionId(userId,attractionId);
    }

    @Transactional(readOnly = true)
    public FavoritesResponse getMyFavorites(UUID userId){
     List<FavoriteBusiness> favoriteBusinessList = favoriteBusinessRepository.findByUserIdOrderByCreatedAtDesc(userId);
     List<FavoriteAttraction> favoriteAttractionList = favoriteAttractionRepository.findByUserIdOrderByCreatedAtDesc(userId);
     List<BusinessResponse> businessResponses = favoriteBusinessList.stream().map(b-> BusinessResponse.from(b.getBusiness())).toList();
     List<AttractionResponse> attractionResponses = favoriteAttractionList.stream().map(a -> AttractionResponse.from(a.getAttraction())).toList();
     return  new FavoritesResponse(businessResponses,attractionResponses);
    }

    @Transactional(readOnly = true)
    public FavoriteIdsResponse getMyFavoriteIds(UUID userId){
    List<UUID> businessIds = favoriteBusinessRepository.findBusinessIdsByUserId(userId);
    List<UUID> attractionIds = favoriteAttractionRepository.findAttractionIdsByUserId(userId);
    return new FavoriteIdsResponse(businessIds,attractionIds);
    }



}