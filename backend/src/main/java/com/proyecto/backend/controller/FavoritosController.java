package com.proyecto.backend.controller;

import com.proyecto.backend.model.Favoritos;
import com.proyecto.backend.model.Producto;
import com.proyecto.backend.model.UserInfo;
import com.proyecto.backend.service.FavoritosService;
import com.proyecto.backend.service.UserInfoService;
import com.proyecto.backend.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/favoritos")
@Tag(name = "Favoritos", description = "Operaciones relacionadas con los productos favoritos de los usuarios")
public class FavoritosController {

    @Autowired
    private FavoritosService favoritosService;

    @Autowired
    private UserInfoService usuarioService;

    @Autowired
    private ProductoService productoService;

    @Operation(summary = "Obtener todos los productos favoritos de un usuario")
    @ApiResponse(responseCode = "200", description = "Lista de productos favoritos devuelta correctamente")
    @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    @GetMapping("/{username}")
    public ResponseEntity<List<Producto>> obtenerFavoritos(@PathVariable String username) {
        Optional<UserInfo> usuarioOpt = usuarioService.obtenerUsuarioPorUsername(username);

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        UserInfo usuario = usuarioOpt.get();
        List<Favoritos> favoritos = favoritosService.obtenerFavoritosPorUsuario(usuario);

        List<Producto> productos = favoritos.stream()
                .map(Favoritos::getProducto)
                .toList();

        return ResponseEntity.ok(productos);
    }

    @Operation(summary = "Añadir un producto a los favoritos de un usuario")
    @ApiResponse(responseCode = "200", description = "Producto añadido a favoritos correctamente")
    @ApiResponse(responseCode = "400", description = "Usuario o producto no encontrado, o producto ya está en favoritos")
    @PostMapping
    public ResponseEntity<String> agregarAFavoritos(@RequestParam String username, @RequestParam Long productoId) {
        Optional<UserInfo> usuarioOpt = usuarioService.obtenerUsuarioPorUsername(username);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }

        Producto producto = productoService.buscarPorId(productoId)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + productoId));

        UserInfo usuario = usuarioOpt.get();
        Favoritos favorito = favoritosService.agregarAFavoritos(usuario, producto);
        if (favorito == null) {
            return ResponseEntity.badRequest().body("El producto ya está en favoritos");
        }

        return ResponseEntity.ok("Producto añadido a favoritos");
    }

    @Operation(summary = "Eliminar un producto de los favoritos de un usuario")
    @ApiResponse(responseCode = "200", description = "Producto eliminado de favoritos correctamente")
    @ApiResponse(responseCode = "400", description = "Usuario o producto no encontrado")
    @DeleteMapping
    public ResponseEntity<String> eliminarDeFavoritos(@RequestParam String username, @RequestParam Long productoId) {
        Optional<UserInfo> usuarioOpt = usuarioService.obtenerUsuarioPorUsername(username);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }

        Producto producto = productoService.buscarPorId(productoId)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + productoId));

        UserInfo usuario = usuarioOpt.get();
        favoritosService.eliminarDeFavoritos(usuario, producto);

        return ResponseEntity.ok("Producto eliminado de favoritos");
    }
}
