package com.biagiocota.garganoexplorer.security;

import com.biagiocota.garganoexplorer.user.UserRepository;
import jakarta.servlet.DispatcherType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtService jwtService, UserRepository userRepository, AuthCookieProperties authCookieProperties, ProblemDetailAuthenticationEntryPoint authenticationEntryPoint, ProblemDetailAccessDeniedHandler accessDeniedHandler) {
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtService, userRepository, authCookieProperties);

        // CSRF disabilitato: API stateless con cookie SameSite=Lax e frontend sullo stesso sito
        http.csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .formLogin(formLogin -> formLogin.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                .authorizeHttpRequests(auth -> auth
                        .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/businesses/*/favorite", "/api/attractions/*/favorite").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/businesses/*/reviews/mine", "/api/attractions/*/reviews/mine").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/attractions/**").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/attractions/{attractionId}/reviews").hasRole("VISITOR")
                        .requestMatchers("/api/attractions/{attractionId}/reviews/{reviewId}").hasAnyRole("ADMIN" , "VISITOR")
                        .requestMatchers(HttpMethod.POST,"/api/businesses/{businessId}/reviews").hasRole("VISITOR")
                        .requestMatchers("/api/businesses/{businessId}/reviews/{reviewId}").hasAnyRole("ADMIN" , "VISITOR")
                        .requestMatchers("/api/attractions/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET,"/api/businesses/mine").hasRole("OWNER")
                        .requestMatchers(HttpMethod.POST, "/api/businesses/*/change-requests").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET , "/api/businesses/**").permitAll()
                        .requestMatchers(HttpMethod.POST , "/api/businesses").hasRole("OWNER")
                        .requestMatchers("/api/businesses/**").hasAnyRole("OWNER" , "ADMIN")
                        .requestMatchers(HttpMethod.POST,"/api/photos/signature").hasAnyRole("OWNER" , "ADMIN")
                        .requestMatchers("/api/map-places").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler))
                .cors(Customizer.withDefaults());
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(
            @Value("${app.cors.allowed-origins}") List<String> allowedOrigins
    ) {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(allowedOrigins);
        config.setAllowedMethods(List.of("GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Content-Type"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}
