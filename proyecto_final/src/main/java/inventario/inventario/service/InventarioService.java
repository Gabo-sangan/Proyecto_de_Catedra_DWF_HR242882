package inventario.inventario.service;

import inventario.inventario.entity.MovimientoInventario;
import inventario.inventario.entity.Producto;
import inventario.inventario.repository.MovimientoInventarioRepository;
import inventario.inventario.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventarioService {

    private final MovimientoInventarioRepository movimientoRepository;
    private final ProductoRepository productoRepository;

    public List<MovimientoInventario> listarMovimientos() { return movimientoRepository.findAll(); }

    public List<MovimientoInventario> listarPorProducto(Long productoId) {
        return movimientoRepository.findByProductoIdOrderByFechaMovimientoDesc(productoId);
    }

    @Transactional
    public MovimientoInventario registrarEntrada(Long productoId, Integer cantidad, String descripcion) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        producto.setStock(producto.getStock() + cantidad);
        productoRepository.save(producto);
        return movimientoRepository.save(MovimientoInventario.builder()
                .producto(producto)
                .tipoMovimiento(MovimientoInventario.TipoMovimiento.ENTRADA)
                .cantidad(cantidad)
                .descripcion(descripcion)
                .build());
    }

    @Transactional
    public MovimientoInventario registrarSalida(Long productoId, Integer cantidad, String descripcion) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        if (producto.getStock() < cantidad)
            throw new RuntimeException("Stock insuficiente. Stock actual: " + producto.getStock());
        producto.setStock(producto.getStock() - cantidad);
        productoRepository.save(producto);
        return movimientoRepository.save(MovimientoInventario.builder()
                .producto(producto)
                .tipoMovimiento(MovimientoInventario.TipoMovimiento.SALIDA)
                .cantidad(cantidad)
                .descripcion(descripcion)
                .build());
    }
}
