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
}
