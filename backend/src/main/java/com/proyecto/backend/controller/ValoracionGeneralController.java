package com.proyecto.backend.controller;

import com.proyecto.backend.model.UserInfo;
import com.proyecto.backend.model.ValoracionGeneral;
import com.proyecto.backend.repository.UserInfoRepository;
import com.proyecto.backend.service.UserInfoService;
import com.proyecto.backend.service.ValoracionGeneralService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/valoraciones")
public class ValoracionGeneralController {

    @Autowired
    private ValoracionGeneralService valoracionGeneralService;

    @Autowired
    private UserInfoRepository userInfoRepository;

    @PostMapping
    public ResponseEntity<ValoracionGeneral> crearValoracion(@RequestBody Map<String, Object> payload) {
        try {
            String comentario = (String) payload.get("comentario");
            Integer puntuacion = (Integer) payload.get("puntuacion");
            String username = (String) payload.get("username");

            UserInfo usuario = userInfoRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            if (valoracionGeneralService.existePorUsuarioId(usuario.getId())) {
                return ResponseEntity.badRequest().build(); // Ya existe valoración para este usuario
            }

            ValoracionGeneral valoracion = new ValoracionGeneral();
            valoracion.setComentario(comentario);
            valoracion.setPuntuacion(puntuacion);
            valoracion.setUsuario(usuario);

            ValoracionGeneral guardada = valoracionGeneralService.guardarValoracion(valoracion);

            return ResponseEntity.ok(guardada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    // Obtener todas las valoraciones
    @GetMapping
    public ResponseEntity<List<ValoracionGeneral>> obtenerTodas() {
        return ResponseEntity.ok(valoracionGeneralService.listarValoraciones());
    }

    // Obtener una valoración por ID
    @GetMapping("/{id}")
    public ResponseEntity<ValoracionGeneral> obtenerPorId(@PathVariable Long id) {
        Optional<ValoracionGeneral> valoracion = valoracionGeneralService.buscarPorId(id);
        return valoracion.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Eliminar una valoración por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (valoracionGeneralService.buscarPorId(id).isPresent()) {
            valoracionGeneralService.eliminarValoracion(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
