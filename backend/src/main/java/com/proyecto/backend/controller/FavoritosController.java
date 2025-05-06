package com.proyecto.backend.controller;

import com.proyecto.backend.model.Favoritos;
import com.proyecto.backend.model.Producto;
import com.proyecto.backend.model.UserInfo;
import com.proyecto.backend.service.FavoritosService;
import com.proyecto.backend.service.UserInfoService;
import com.proyecto.backend.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

import java.util.List;

@RestController
@RequestMapping("/api/favoritos")
public class FavoritosController {

    @Autowired
    private FavoritosService favoritosService;

    @Autowired
    private UserInfoService usuarioService;

    @Autowired
    private ProductoService productoService;

    // Obtener todos los favoritos de un usuario
    @GetMapping("/{username}")
    public ResponseEntity<List<Producto>> obtenerFavoritos(@PathVariable String username) {
        Optional<UserInfo> usuarioOpt = usuarioService.obtenerUsuarioPorUsername(username);

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        UserInfo usuario = usuarioOpt.get();
        List<Favoritos> favoritos = favoritosService.obtenerFavoritosPorUsuario(usuario);

        // Mapear los favoritos para devolver solo los productos
        List<Producto> productos = favoritos.stream()
                .map(Favoritos::getProducto)
                .toList();

        return ResponseEntity.ok(productos);
    }

    // Añadir un producto a los favoritos de un usuario
    @PostMapping
    public ResponseEntity<String> agregarAFavoritos(@RequestParam String username, @RequestParam Long productoId) {
        // Obtener el usuario por su nombre de usuario
        Optional<UserInfo> usuarioOpt = usuarioService.obtenerUsuarioPorUsername(username);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }

        // Obtener el producto por su ID
        Producto producto = productoService.buscarPorId(productoId)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + productoId));

        // Añadir el producto a los favoritos
        UserInfo usuario = usuarioOpt.get();
        Favoritos favorito = favoritosService.agregarAFavoritos(usuario, producto);
        if (favorito == null) {
            return ResponseEntity.badRequest().body("El producto ya está en favoritos");
        }

        return ResponseEntity.ok("Producto añadido a favoritos");
    }

    // Eliminar un producto de los favoritos de un usuario
    @DeleteMapping
    public ResponseEntity<String> eliminarDeFavoritos(@RequestParam String username, @RequestParam Long productoId) {
        // Obtener el usuario por su nombre de usuario
        Optional<UserInfo> usuarioOpt = usuarioService.obtenerUsuarioPorUsername(username);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }

        // Obtener el producto por su ID
        Producto producto = productoService.buscarPorId(productoId)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + productoId));

        // Eliminar el producto de los favoritos
        UserInfo usuario = usuarioOpt.get();
        favoritosService.eliminarDeFavoritos(usuario, producto);

        return ResponseEntity.ok("Producto eliminado de favoritos");
    }
}