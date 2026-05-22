package inventario.inventario.service;

import inventario.inventario.entity.Categoria;
import inventario.inventario.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public List<Categoria> listarTodas() { return categoriaRepository.findAll(); }

    public Categoria buscarPorId(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada: " + id));
    }

    public Categoria crear(Categoria categoria) {
        if (categoriaRepository.existsByNombre(categoria.getNombre()))
            throw new RuntimeException("Ya existe una categoría con ese nombre");
        return categoriaRepository.save(categoria);
    }

    public Categoria actualizar(Long id, Categoria nueva) {
        Categoria c = buscarPorId(id);
        c.setNombre(nueva.getNombre());
        return categoriaRepository.save(c);
    }

    public void eliminar(Long id) {
        buscarPorId(id);
        categoriaRepository.deleteById(id);
    }
}
