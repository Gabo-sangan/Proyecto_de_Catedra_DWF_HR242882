package inventario.inventario.service;

import inventario.inventario.dto.VentaDTO;
import inventario.inventario.entity.*;
import inventario.inventario.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final MovimientoInventarioRepository movimientoRepository;

    public List<Venta> listarTodas() { return ventaRepository.findAll(); }

    public List<Venta> listarRecientes() { return ventaRepository.findTop10ByOrderByFechaDesc(); }

    public Venta buscarPorId(Long id) {
        return ventaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada: " + id));
    }

    @Transactional
    public Venta registrarVenta(VentaDTO.VentaRequest request) {
        String correo = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByCorreo(correo).orElse(null);

        Venta venta = Venta.builder().fecha(LocalDateTime.now()).usuario(usuario).build();
        List<DetalleVenta> detalles = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (VentaDTO.DetalleRequest dr : request.getDetalles()) {
            Producto producto = productoRepository.findById(dr.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + dr.getProductoId()));
            if (producto.getStock() < dr.getCantidad())
                throw new RuntimeException("Stock insuficiente para: " + producto.getNombre()
                        + ". Disponible: " + producto.getStock());

            producto.setStock(producto.getStock() - dr.getCantidad());
            productoRepository.save(producto);

            movimientoRepository.save(MovimientoInventario.builder()
                    .producto(producto)
                    .tipoMovimiento(MovimientoInventario.TipoMovimiento.SALIDA)
                    .cantidad(dr.getCantidad())
                    .descripcion("Venta registrada")
                    .build());

            BigDecimal subtotal = producto.getPrecio().multiply(BigDecimal.valueOf(dr.getCantidad()));
            total = total.add(subtotal);

            detalles.add(DetalleVenta.builder()
                    .venta(venta)
                    .producto(producto)
                    .cantidad(dr.getCantidad())
                    .precioUnitario(producto.getPrecio())
                    .subtotal(subtotal)
                    .build());
        }

        venta.setTotal(total);
        venta.setDetalles(detalles);
        return ventaRepository.save(venta);
    }

    public Map<String, Object> obtenerResumen() {
        LocalDateTime inicio = LocalDateTime.now().toLocalDate().atStartOfDay();
        BigDecimal ventasHoy = ventaRepository.sumTotalByFechaBetween(inicio, inicio.plusDays(1));
        return Map.of(
            "ventasHoy", ventasHoy != null ? ventasHoy : BigDecimal.ZERO,
            "totalVentas", ventaRepository.count(),
            "recientes", ventaRepository.findTop10ByOrderByFechaDesc()
        );
    }
}
