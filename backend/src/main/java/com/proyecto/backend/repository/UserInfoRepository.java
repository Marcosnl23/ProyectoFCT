package com.proyecto.backend.repository;

import com.proyecto.backend.model.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, String> {
    Optional<UserInfo> findByEmail(String email); // Usa 'email' si es el campo correcto para login

    Optional<UserInfo> findByUsername(String username); // Cambié 'name' por 'username'
}
