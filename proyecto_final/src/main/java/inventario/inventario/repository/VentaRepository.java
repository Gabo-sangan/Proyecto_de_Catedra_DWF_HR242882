package inventario.inventario.repository;

import inventario.inventario.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {
    List<Venta> findTop10ByOrderByFechaDesc();

    @Query("SELECT SUM(v.total) FROM Venta v WHERE v.fecha BETWEEN :inicio AND :fin")
    java.math.BigDecimal sumTotalByFechaBetween(LocalDateTime inicio, LocalDateTime fin);
}
