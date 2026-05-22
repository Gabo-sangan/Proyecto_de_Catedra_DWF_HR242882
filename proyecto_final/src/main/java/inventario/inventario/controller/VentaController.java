package inventario.inventario.controller;

import inventario.inventario.dto.ApiResponse;
import inventario.inventario.dto.VentaDTO;
import inventario.inventario.entity.Venta;
import inventario.inventario.service.VentaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ventas")
@RequiredArgsConstructor
public class VentaController {

    private final VentaService ventaService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Venta>>> listar() {
        return ResponseEntity.ok(ApiResponse.ok("Ventas", ventaService.listarTodas()));
    }

    @GetMapping("/recientes")
    public ResponseEntity<ApiResponse<List<Venta>>> recientes() {
        return ResponseEntity.ok(ApiResponse.ok("Recientes", ventaService.listarRecientes()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Venta>> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Venta", ventaService.buscarPorId(id)));
    }

    @GetMapping("/resumen")
    public ResponseEntity<ApiResponse<Map<String, Object>>> resumen() {
        return ResponseEntity.ok(ApiResponse.ok("Resumen", ventaService.obtenerResumen()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Venta>> registrar(@Valid @RequestBody VentaDTO.VentaRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Venta registrada", ventaService.registrarVenta(request)));
    }
}
