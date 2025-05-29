package com.proyecto.backend.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.proyecto.backend.model.UserInfo;
import com.proyecto.backend.service.JwtService;
import com.proyecto.backend.service.UserInfoDetails;
import com.proyecto.backend.service.UserInfoService;
import com.proyecto.backend.service.GoogleAuthService;
import com.proyecto.backend.repository.UserInfoRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth/api")
@Tag(name = "Autenticación", description = "API para autenticación y gestión de usuarios")
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

    @Operation(summary = "Registrar un nuevo usuario")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuario registrado correctamente"),
            @ApiResponse(responseCode = "400", description = "Error en los datos del usuario")
    })
    @PostMapping("/register")
    public String addNewUser(@RequestBody UserInfo userInfo) {
        return userInfoService.addUser(userInfo);
    }

    @Operation(summary = "Generar token JWT para un usuario")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token generado correctamente"),
            @ApiResponse(responseCode = "400", description = "Error en autenticación")
    })
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

    @Operation(summary = "Login con token de Google")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login exitoso, token JWT generado"),
            @ApiResponse(responseCode = "401", description = "Token de Google inválido")
    })
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

        UserInfo user = userInfoRepository.findByEmail(email).orElseGet(() -> {
            UserInfo nuevo = new UserInfo();
            nuevo.setEmail(email);
            nuevo.setNombre(nombre);
            nuevo.setApellidos(apellidos);
            nuevo.setUsername(username);
            nuevo.setRol("user");
            String password = userInfoService.generateRandomPassword();
            nuevo.setPassword(userInfoService.encodePassword(password));
            return userInfoRepository.save(nuevo);
        });

        UserDetails userDetails = new UserInfoDetails(user);
        String jwt = jwtService.generateToken(userDetails);
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

    @Operation(summary = "Cerrar sesión e invalidar token JWT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Sesión cerrada correctamente")
    })
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        String actualToken = token.replace("Bearer ", "");
        jwtService.invalidateToken(actualToken);
        return ResponseEntity.ok("Sesión cerrada correctamente");
    }

    @Operation(summary = "Obtener todos los usuarios")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de usuarios devuelta correctamente")
    })
    @GetMapping("/usuarios")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userInfoService.getAllUsers());
    }

    @Operation(summary = "Eliminar un usuario por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuario eliminado correctamente")
    })
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userInfoService.deleteUser(id);
        return ResponseEntity.ok("Usuario eliminado correctamente");
    }

    @Operation(summary = "Actualizar usuario por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuario actualizado correctamente")
    })
    @PostMapping("/usuarios/actualizar/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserInfo userInfo) {
        UserInfo updatedUser = userInfoService.updateUser(id, userInfo);
        return ResponseEntity.ok(updatedUser);
    }
}
