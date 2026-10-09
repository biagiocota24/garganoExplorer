package com.biagiocota.garganoexplorer.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserResponse getById(UUID id) {
        User foundUser = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException());
        return UserResponse.from(foundUser);
    }
}
