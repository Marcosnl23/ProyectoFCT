package com.proyecto.backend.controller;

import com.proyecto.backend.model.UserInfo;
import com.proyecto.backend.model.ValoracionGeneral;
import com.proyecto.backend.service.UserInfoService;
import com.proyecto.backend.service.ValoracionGeneralService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/valoraciones")
public class ValoracionController {

    @Autowired
    private ValoracionGeneralService valoracionGeneralService;

    @Autowired
    private UserInfoService userInfoService;

    @PostMapping("/crear")
    public ResponseEntity<?> crearValoracion(@RequestBody Map<String, Object> payload) {
        try {
            String comentario = (String) payload.get("comentario");
            Integer puntuacion = (payload.get("puntuacion") instanceof Integer)
                    ? (Integer) payload.get("puntuacion")
                    : Integer.parseInt(payload.get("puntuacion").toString());
            String username = (String) payload.get("username");

            if (comentario == null || puntuacion == null || username == null) {
                return ResponseEntity.badRequest().body("Faltan datos obligatorios");
            }

            // Buscar usuario con Optional
            Optional<UserInfo> userOptional = userInfoService.obtenerUsuarioPorUsername(username);
            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Usuario no encontrado");
            }

            UserInfo user = userOptional.get();

            // Crear la valoración (puede que necesites ajustar este constructor)
            ValoracionGeneral valoracionGeneral = new ValoracionGeneral(user, puntuacion, comentario);
            ValoracionGeneral nuevaValoracion = valoracionGeneralService.guardarValoracion(valoracionGeneral);
            return ResponseEntity.ok(nuevaValoracion);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error interno");
        }
    }



    @GetMapping
    public ResponseEntity<List<ValoracionGeneral>> obtenerValoraciones() {
        try {
            List<ValoracionGeneral> valoraciones = valoracionGeneralService.listarValoraciones();
            return ResponseEntity.ok(valoraciones);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
}
