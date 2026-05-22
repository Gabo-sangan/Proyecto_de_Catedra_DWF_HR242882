package inventario.inventario.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class AuthDTO {

    @Data
    public static class LoginRequest {
        @Email @NotBlank
        private String correo;
        @NotBlank
        private String contrasena;
    }

    @Data
    public static class RegisterRequest {
        @NotBlank
        private String nombre;
        @Email @NotBlank
        private String correo;
        @NotBlank
        private String contrasena;
        private String rol;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String correo;
        private String nombre;
        private String rol;

        public AuthResponse(String token, String correo, String nombre, String rol) {
            this.token = token;
            this.correo = correo;
            this.nombre = nombre;
            this.rol = rol;
        }
    }
}
