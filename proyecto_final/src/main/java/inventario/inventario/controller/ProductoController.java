package inventario.inventario.controller;

import inventario.inventario.dto.ApiResponse;
import inventario.inventario.entity.Producto;
import inventario.inventario.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Producto>>> listar() {
        return ResponseEntity.ok(ApiResponse.ok("Productos obtenidos", productoService.listarTodos()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Producto>> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Producto encontrado", productoService.buscarPorId(id)));
    }

    @GetMapping("/buscar")
    public ResponseEntity<ApiResponse<List<Producto>>> buscarPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(ApiResponse.ok("Resultados", productoService.buscarPorNombre(nombre)));
    }

    @GetMapping("/stock-bajo")
    public ResponseEntity<ApiResponse<List<Producto>>> stockBajo() {
        return ResponseEntity.ok(ApiResponse.ok("Alertas", productoService.listarConStockBajo()));
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<ApiResponse<List<Producto>>> porCategoria(@PathVariable Long categoriaId) {
        return ResponseEntity.ok(ApiResponse.ok("Productos", productoService.listarPorCategoria(categoriaId)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Producto>> crear(@Valid @RequestBody Producto producto) {
        return ResponseEntity.ok(ApiResponse.ok("Producto creado", productoService.crear(producto)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Producto>> actualizar(@PathVariable Long id, @Valid @RequestBody Producto producto) {
        return ResponseEntity.ok(ApiResponse.ok("Producto actualizado", productoService.actualizar(id, producto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        productoService.eliminar(id);
        return ResponseEntity.ok(ApiResponse.ok("Producto eliminado", null));
    }
}
