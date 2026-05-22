package inventario.inventario.service;

import inventario.inventario.entity.Producto;
import inventario.inventario.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;

    public List<Producto> listarTodos() { return productoRepository.findAll(); }

    public Producto buscarPorId(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + id));
    }

    public List<Producto> buscarPorNombre(String nombre) {
        return productoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    public List<Producto> listarPorCategoria(Long categoriaId) {
        return productoRepository.findByCategoriaId(categoriaId);
    }

    public List<Producto> listarConStockBajo() {
        return productoRepository.findProductosConStockBajo();
    }

    public Producto crear(Producto producto) { return productoRepository.save(producto); }

    public Producto actualizar(Long id, Producto nuevo) {
        Producto p = buscarPorId(id);
        p.setNombre(nuevo.getNombre());
        p.setCategoria(nuevo.getCategoria());
        p.setPrecio(nuevo.getPrecio());
        p.setStock(nuevo.getStock());
        p.setStockMinimo(nuevo.getStockMinimo());
        p.setDescripcion(nuevo.getDescripcion());
        return productoRepository.save(p);
    }

    public void eliminar(Long id) {
        buscarPorId(id);
        productoRepository.deleteById(id);
    }
}
