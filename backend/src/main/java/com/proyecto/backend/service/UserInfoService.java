package com.proyecto.backend.service;

import com.proyecto.backend.model.UserInfo;
import com.proyecto.backend.repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Primary
public class UserInfoService implements UserDetailsService {

    @Autowired
    private UserInfoRepository repository;

    @Autowired
    @Lazy
    private PasswordEncoder encoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<UserInfo> userDetail = repository.findByUsername(username);

        // Converting UserInfo to UserDetails
        return userDetail.map(UserInfoDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public String addUser(UserInfo userInfo) {
        // Encode password before saving the user
        userInfo.setPassword(encoder.encode(userInfo.getPassword()));
        repository.save(userInfo);
        return "User Added Successfully";
    }

    // Método para comprobar las credenciales del usuario con Optional
    public UserInfo comprobarCredenciales(String username, String password) {
        // Buscar el usuario por su nombre de usuario
        Optional<UserInfo> usuarioOpt = repository.findByUsername(username);

        // Si el usuario existe, comprobar si la contraseña es correcta
        if (usuarioOpt.isPresent()) {
            UserInfo usuario = usuarioOpt.get();

            // Compara la contraseña proporcionada con la contraseña almacenada (encriptada)
            if (encoder.matches(password, usuario.getPassword())) {
                return usuario; // Si las credenciales son correctas, devolver el usuario
            }
        }
        return null; // Si el usuario no existe o las credenciales son incorrectas, devolver null
    }

    public String generateRandomPassword() {
        // Implementación para generar una contraseña aleatoria
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
        StringBuilder password = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            int index = (int) (Math.random() * characters.length());
            password.append(characters.charAt(index));
        }
        return password.toString();
    }

    public String encodePassword(String password) {
        return encoder.encode(password);
    }

    public UserInfo getUserById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Optional<UserInfo> obtenerUsuarioPorUsername(String username) {
        return repository.findByUsername(username); // Devuelve un Optional<UserInfo>
    }

    //Obtener usuarios
    public Iterable<UserInfo> getAllUsers() {
        return repository.findAll();
    }

    //Eliminar usuario
    public void deleteUser(Long id) {
        repository.deleteById(id);
    }

    //Actualizar usuario
    public UserInfo updateUser(Long id, UserInfo userInfo) {
        Optional<UserInfo> existingUser = repository.findById(id);
        if (existingUser.isPresent()) {
            UserInfo userToUpdate = existingUser.get();
            userToUpdate.setNombre(userInfo.getNombre());
            userToUpdate.setApellidos(userInfo.getApellidos());
            userToUpdate.setUsername(userInfo.getUsername());
            userToUpdate.setEmail(userInfo.getEmail());
            userToUpdate.setRol(userInfo.getRol());
            return repository.save(userToUpdate);
        }
        return null; // O lanzar una excepción si el usuario no existe
    }

}
