package com.biagiocota.garganoexplorer.business;

import com.biagiocota.garganoexplorer.common.Town;
import com.biagiocota.garganoexplorer.common.exception.ForbiddenOperationException;
import com.biagiocota.garganoexplorer.common.tools.TextNormalizerTools;
import com.biagiocota.garganoexplorer.notification.NotificationService;
import com.biagiocota.garganoexplorer.notification.NotificationType;
import com.biagiocota.garganoexplorer.photo.PhotoRequest;
import com.biagiocota.garganoexplorer.photo.PhotoResponse;
import com.biagiocota.garganoexplorer.photo.PhotoService;
import com.biagiocota.garganoexplorer.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BusinessService {
    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final PhotoService photoService;

    @Transactional(readOnly = true)
    public Page<BusinessResponse> findAll(Town town , BusinessCategory category , Pageable pageable){
        if(town != null && category != null){
            return businessRepository.findByTownAndCategory(town , category,pageable).map(BusinessResponse::from);
        }
        if(town != null){
            return businessRepository.findByTown(town, pageable).map(BusinessResponse::from);
        }
        if(category != null){
            return businessRepository.findByCategory(category, pageable).map(BusinessResponse::from);
        }
        return businessRepository.findAll(pageable).map(BusinessResponse::from);
    }

    @Transactional(readOnly = true)
    public BusinessResponse getById(UUID id){
        Business businessFound = businessRepository.findById(id).orElseThrow(BusinessNotFoundException::new);
        return BusinessResponse.from(businessFound);
    }

    @Transactional(readOnly = true)
    public List<BusinessResponse> findMine(UUID ownerId){
        return businessRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId).stream().map(BusinessResponse::from).toList();
    }

    @Transactional
    public BusinessResponse createBusiness(UUID ownerId , BusinessRequest request){
        Business newBusiness = new Business();
        newBusiness.setOwner(userRepository.getReferenceById(ownerId));
        applyRequest(newBusiness ,request);
        Business saved = businessRepository.saveAndFlush(newBusiness);
        return BusinessResponse.from(saved);
    }

    @Transactional
    public BusinessResponse updateBusiness(UUID id , UUID currentUserId, BusinessRequest request){
        Business businessToUpdate = businessRepository.findById(id).orElseThrow(BusinessNotFoundException::new);
        checkIsOwner(businessToUpdate , currentUserId);
        applyRequest(businessToUpdate , request);
        businessRepository.flush();
        return BusinessResponse.from(businessToUpdate);
    }

    @Transactional
    public void deleteBusiness(UUID id , UUID currentUserId, boolean isAdmin){
        Business businessToDelete = businessRepository.findById(id).orElseThrow(BusinessNotFoundException::new);
        checkCanDelete(businessToDelete , currentUserId ,isAdmin);
        photoService.deleteAll(businessToDelete.getPhotos());
        businessRepository.delete(businessToDelete);
    }

    @Transactional
    public void requestChange(UUID businessId , String message){
        Business business = businessRepository.findById(businessId).orElseThrow(BusinessNotFoundException::new);
        notificationService.create(business.getOwner(),
                NotificationType.BUSINESS_CHANGE_REQUEST ,
                message.trim() ,
                business.getId() ,
                business.getName());
    }

    @Transactional
    public List<PhotoResponse> addPhoto(UUID businessId, UUID userId, PhotoRequest request) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(BusinessNotFoundException::new);
        checkIsOwner(business, userId);
        photoService.addPhoto(business.getPhotos(), request);
        return PhotoResponse.fromAll(business.getPhotos());
    }

    @Transactional
    public void removePhoto(UUID businessId, UUID userId, boolean isAdmin, String publicId) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(BusinessNotFoundException::new);
        checkCanDelete(business, userId, isAdmin);
        photoService.removePhoto(business.getPhotos(), publicId);
    }

    private void applyRequest(Business business , BusinessRequest request){
        business.setName(TextNormalizerTools.name(request.name()));
        business.setDescription(request.description().trim());
        business.setCategory(request.category());
        business.setTown(request.town());
        business.setAddress(request.address().trim());
        business.setLatitude(request.latitude());
        business.setLongitude(request.longitude());
        business.setPhone(TextNormalizerTools.blankToNull(request.phone()));
        business.setEmail(TextNormalizerTools.email(request.email()));
        business.setWebsite(TextNormalizerTools.blankToNull(request.website()));
        business.setPriceRange(request.priceRange());
    }


    private void checkIsOwner(Business business , UUID currentUserId){
        boolean isOwner = business.getOwner().getId().equals(currentUserId);
        if(!isOwner){
            throw new ForbiddenOperationException("Puoi modificare solo le tue attività");
        }
    }

    private void checkCanDelete(Business business , UUID currentUserId , boolean isAdmin){
        boolean isOwner = business.getOwner().getId().equals(currentUserId);
        if(!isAdmin && !isOwner){
            throw new ForbiddenOperationException("Non hai i permessi per modificare questa attività");
        }
    }
}
