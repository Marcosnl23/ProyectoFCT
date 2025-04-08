package com.proyecto.backend.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.proyecto.backend.model.AuthRequest;
import com.proyecto.backend.model.UserInfo;
import com.proyecto.backend.service.JwtService;
import com.proyecto.backend.service.UserInfoDetails;
import com.proyecto.backend.service.UserInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.proyecto.backend.service.GoogleAuthService;
import com.proyecto.backend.repository.UserInfoRepository;

import java.util.Map;

import java.util.Map;

@RestController
@RequestMapping("/auth/api")
public class AuthApiController {

    @Autowired
    private UserInfoService userInfoService;

    @Autowired
    private UserInfoRepository userInfoRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private GoogleAuthService googleAuthService;

    @PostMapping("/register")
    public String addNewUser(@RequestBody UserInfo userInfo) {
        return userInfoService.addUser(userInfo);
    }

    @PostMapping("/generate-token")
    public ResponseEntity<?> generateToken(@RequestBody UserInfo userInfo) {
        try {
            autenticar(userInfo.getUsername(), userInfo.getPassword());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }

        UserDetails userDetails = userInfoService.loadUserByUsername(userInfo.getUsername());
        String token = jwtService.generateToken(userDetails);
        return ResponseEntity.ok(token);
    }

    // 🚀 NUEVO: Login con Google
    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> request) {
        String idToken = request.get("token");
        GoogleIdToken.Payload payload = googleAuthService.verifyToken(idToken);

        if (payload == null) {
            return ResponseEntity.status(401).body("Token de Google inválido");
        }

        String email = payload.getEmail();
        String nombre = (String) payload.get("given_name");
        String apellidos = (String) payload.get("family_name");
        String username = email.split("@")[0];

        // Busca o crea el usuario
        UserInfo user = userInfoRepository.findByEmail(email).orElseGet(() -> {
            UserInfo nuevo = new UserInfo();
            nuevo.setEmail(email);
            nuevo.setNombre(nombre);
            nuevo.setApellidos(apellidos);
            nuevo.setUsername(username);
            nuevo.setRol("user");
            return userInfoRepository.save(nuevo);
        });

        String jwt = jwtService.generateToken((UserDetails) user);
        return ResponseEntity.ok(Map.of("token", jwt));
    }

    private void autenticar(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new RuntimeException("Usuario deshabilitado: " + e.getMessage());
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Credenciales inválidas: " + e.getMessage());
        }
    }
}
