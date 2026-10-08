package com.biagiocota.garganoexplorer.auth;

import com.biagiocota.garganoexplorer.user.UserResponse;

public record LoginResult(
        String token,
        UserResponse user
) {
}
