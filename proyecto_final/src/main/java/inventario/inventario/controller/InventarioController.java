package inventario.inventario.controller;

import inventario.inventario.dto.ApiResponse;
import inventario.inventario.entity.MovimientoInventario;
import inventario.inventario.service.InventarioService;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inventario")
@RequiredArgsConstructor
public class InventarioController {

    private final InventarioService inventarioService;

    @GetMapping("/movimientos")
    public ResponseEntity<ApiResponse<List<MovimientoInventario>>> listar() {
        return ResponseEntity.ok(ApiResponse.ok("Movimientos", inventarioService.listarMovimientos()));
    }

    @GetMapping("/movimientos/producto/{productoId}")
    public ResponseEntity<ApiResponse<List<MovimientoInventario>>> porProducto(@PathVariable Long productoId) {
        return ResponseEntity.ok(ApiResponse.ok("Movimientos", inventarioService.listarPorProducto(productoId)));
    }

    @PostMapping("/entrada")
    public ResponseEntity<ApiResponse<MovimientoInventario>> registrarEntrada(@RequestBody MovimientoRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Entrada registrada",
                inventarioService.registrarEntrada(request.getProductoId(), request.getCantidad(), request.getDescripcion())));
    }

    @PostMapping("/salida")
    public ResponseEntity<ApiResponse<MovimientoInventario>> registrarSalida(@RequestBody MovimientoRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Salida registrada",
                inventarioService.registrarSalida(request.getProductoId(), request.getCantidad(), request.getDescripcion())));
    }

    @Data
    static class MovimientoRequest {
        @NotNull private Long productoId;
        @NotNull @Min(1) private Integer cantidad;
        private String descripcion;
    }
}
