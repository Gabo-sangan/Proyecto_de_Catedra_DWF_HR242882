package inventario.inventario.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

public class VentaDTO {

    @Data
    public static class VentaRequest {
        @NotNull @Size(min = 1)
        private List<DetalleRequest> detalles;

        // Porcentaje de descuento: 0 = sin descuento, 10 = 10%, etc.
        @Min(value = 0, message = "El descuento no puede ser negativo")
        @Max(value = 100, message = "El descuento no puede superar el 100%")
        private Integer descuentoPorcentaje = 0;
    }

    @Data
    public static class DetalleRequest {
        @NotNull
        private Long productoId;
        @NotNull @Min(1)
        private Integer cantidad;
    }
}
