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
import org.springframework.web.bind.annotation.*;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.proyecto.backend.service.GoogleAuthService;
import com.proyecto.backend.repository.UserInfoRepository;

import java.util.Map;

import java.util.Map;
import java.util.Optional;

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

        // 1. Verifica el token con Google
        GoogleIdToken.Payload payload = googleAuthService.verifyToken(idToken);

        if (payload == null) {
            return ResponseEntity.status(401).body("Token de Google inválido");
        }

        // 2. Extrae los datos del payload de Google
        String email = payload.getEmail();
        String nombre = (String) payload.get("given_name");
        String apellidos = (String) payload.get("family_name");
        String username = email.split("@")[0];

        // 3. Busca el usuario en la base de datos, o lo crea si no existe
        UserInfo user = userInfoRepository.findByEmail(email).orElseGet(() -> {
            UserInfo nuevo = new UserInfo();
            nuevo.setEmail(email);
            nuevo.setNombre(nombre);
            nuevo.setApellidos(apellidos);
            nuevo.setUsername(username);
            nuevo.setRol("user");
            //Genera una contraseña aleatoria para el usuario encriptada
            String password = userInfoService.generateRandomPassword();
            nuevo.setPassword(userInfoService.encodePassword(password));

            return userInfoRepository.save(nuevo); // Aquí se guarda el nuevo usuario
        });

        UserDetails userDetails = new UserInfoDetails(user); // Aquí se crea un UserDetails a partir del usuario
        // 4. Asegúrate que `UserInfo` implemente `UserDetails` (como ya vimos antes)
        String jwt = jwtService.generateToken(userDetails); // Aquí user ya es un UserDetails válido

        // 5. Retorna el token JWT generado
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

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        // Extraer el token del header)
        String actualToken = token.replace("Bearer ", "");
        
        // Invalidar el token en el servidor
        jwtService.invalidateToken(actualToken);
        
        return ResponseEntity.ok("Sesión cerrada correctamente");
    }

    @GetMapping("/usuarios")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userInfoService.getAllUsers());
    }

    //Borrar usuario
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userInfoService.deleteUser(id);
        return ResponseEntity.ok("Usuario eliminado correctamente");
    }

    @PostMapping("/usuarios/actualizar/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserInfo userInfo) {
        UserInfo updatedUser = userInfoService.updateUser(id, userInfo);
        return ResponseEntity.ok(updatedUser);
    }
}
