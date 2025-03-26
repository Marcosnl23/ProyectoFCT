package com.proyecto.backend.controller;

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

@RestController
@RequestMapping("/auth/api")
public class AuthApiController {
    @Autowired
    private UserInfoService userInfoService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public String addNewUser(@RequestBody UserInfo userInfo) {
        System.out.println("Registering new user: " + userInfo);
        return userInfoService.addUser(userInfo);  // Registra un nuevo usuario
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

    private void autenticar(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new RuntimeException("Usuario Desabilitado: " + e.getMessage());
        }catch (BadCredentialsException e) {
            throw new RuntimeException("Credenciales invalidas: " + e.getMessage());
        }
    }

}
