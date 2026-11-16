package com.biagiocota.garganoexplorer.common.tools;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

public final class SecurityTools {

    private SecurityTools(){

    }

    public static boolean isAdmin(Authentication authentication){
        return authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
    }
}
