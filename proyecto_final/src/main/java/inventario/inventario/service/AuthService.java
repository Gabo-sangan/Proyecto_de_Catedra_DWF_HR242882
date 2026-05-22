package inventario.inventario.service;

import inventario.inventario.dto.AuthDTO;
import inventario.inventario.entity.Usuario;
import inventario.inventario.repository.UsuarioRepository;
import inventario.inventario.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getCorreo(), request.getContrasena())
        );
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getCorreo());
        String token = jwtUtil.generateToken(userDetails);
        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo()).orElseThrow();
        return new AuthDTO.AuthResponse(token, usuario.getCorreo(), usuario.getNombre(), usuario.getRol().name());
    }

    public AuthDTO.AuthResponse register(AuthDTO.RegisterRequest request) {
        if (usuarioRepository.existsByCorreo(request.getCorreo()))
            throw new RuntimeException("El correo ya está registrado");

        Usuario.Rol rol = (request.getRol() != null && request.getRol().equalsIgnoreCase("ADMIN"))
                ? Usuario.Rol.ADMIN : Usuario.Rol.EMPLEADO;

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .correo(request.getCorreo())
                .contrasena(passwordEncoder.encode(request.getContrasena()))
                .rol(rol)
                .build();
        usuarioRepository.save(usuario);

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getCorreo());
        String token = jwtUtil.generateToken(userDetails);
        return new AuthDTO.AuthResponse(token, usuario.getCorreo(), usuario.getNombre(), usuario.getRol().name());
    }
}
