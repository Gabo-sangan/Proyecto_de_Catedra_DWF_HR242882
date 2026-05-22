package inventario.inventario.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.List;

public class VentaDTO {

    @Data
    public static class VentaRequest {
        @NotNull @Size(min = 1)
        private List<DetalleRequest> detalles;
    }

    @Data
    public static class DetalleRequest {
        @NotNull
        private Long productoId;
        @NotNull @Min(1)
        private Integer cantidad;
    }
}
