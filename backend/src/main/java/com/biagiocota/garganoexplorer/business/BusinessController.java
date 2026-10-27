package com.biagiocota.garganoexplorer.business;

import com.biagiocota.garganoexplorer.common.Town;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/businesses")
@RequiredArgsConstructor
public class BusinessController {
    private final BusinessService businessService;

    @GetMapping
    public Page<BusinessResponse> getAllOrFiltered(@RequestParam(required = false)Town town , @RequestParam(required = false)BusinessCategory category , @PageableDefault(size = 12 , sort = "name")Pageable pageable){
        return businessService.findAll(town,category,pageable);
    }

    @GetMapping("/{id}")
    public BusinessResponse getBusiness(@PathVariable UUID id){
        return businessService.getById(id);
    }

    @GetMapping("/mine")
    public List<BusinessResponse> getMyBusiness(@AuthenticationPrincipal UUID currentUserId){
        return businessService.findMine(currentUserId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BusinessResponse createBusiness(@AuthenticationPrincipal UUID currentUserId , @Valid @RequestBody BusinessRequest request){
        return businessService.createBusiness(currentUserId , request);
    }

    @PutMapping("/{id}")
    public BusinessResponse updateBusiness(@AuthenticationPrincipal UUID currentUserId, @PathVariable UUID id , @Valid @RequestBody BusinessRequest request ){
        return businessService.updateBusiness(id , currentUserId, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBusiness(@AuthenticationPrincipal UUID currentUserId , @PathVariable UUID id, Authentication authentication){
        businessService.deleteBusiness(id , currentUserId , isAdmin(authentication));
    }


    private boolean isAdmin(Authentication authentication){
        return authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
    }
}
