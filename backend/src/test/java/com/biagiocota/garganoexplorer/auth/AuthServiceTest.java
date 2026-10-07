package com.biagiocota.garganoexplorer.auth;

import com.biagiocota.garganoexplorer.user.Role;
import com.biagiocota.garganoexplorer.user.User;
import com.biagiocota.garganoexplorer.user.UserRepository;
import com.biagiocota.garganoexplorer.user.UserResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_withNewEmail_saveUserWithHashedPasswordAndNormalizedEmail() {
        // PREPARARO SITUAZIONE
        when(userRepository.existsByEmail("mario@gmail.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("HASHED");
        when(userRepository.saveAndFlush(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        RegisterRequest request = new RegisterRequest("Mario@Gmail.com", "password123", "Mario", "Rossi", AccountType.OWNER);

        // ESEGUO IL METODO DA TESTARE
        UserResponse response = authService.register(request);

        //VERIFICO IL RISULTATO
        assertThat(response.email()).isEqualTo("mario@gmail.com");
        assertThat(response.role()).isEqualTo(Role.OWNER);
        assertThat(response.firstName()).isEqualTo("Mario");

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).saveAndFlush(captor.capture());
        User savedUser = captor.getValue();

        assertThat(savedUser.getPassword()).isEqualTo("HASHED");
        assertThat(savedUser.getPassword()).isNotEqualTo("password123");
    }

    @Test
    void register_withExistingEmail_throwsEmailAlreadyUsedException(){
        when(userRepository.existsByEmail("mario@gmail.com")).thenReturn(true);

        RegisterRequest request = new RegisterRequest("Mario@Gmail.com", "password123", "Mario", "Rossi", AccountType.VISITOR);

        assertThrows(EmailAlreadyUsedException.class , ()->authService.register(request));
        verify(userRepository, never()).saveAndFlush(any());
        verify(passwordEncoder,never()).encode(any());
    }
}
