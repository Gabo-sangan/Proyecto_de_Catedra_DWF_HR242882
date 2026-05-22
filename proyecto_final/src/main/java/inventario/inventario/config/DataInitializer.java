package inventario.inventario.config;

import inventario.inventario.entity.*;
import inventario.inventario.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!usuarioRepository.existsByCorreo("admin@tienda.com")) {
            usuarioRepository.save(Usuario.builder()
                    .nombre("Administrador").correo("admin@tienda.com")
                    .contrasena(passwordEncoder.encode("admin123"))
                    .rol(Usuario.Rol.ADMIN).build());
            System.out.println("✅ admin@tienda.com / admin123");
        }
        if (!usuarioRepository.existsByCorreo("empleado@tienda.com")) {
            usuarioRepository.save(Usuario.builder()
                    .nombre("Empleado 1").correo("empleado@tienda.com")
                    .contrasena(passwordEncoder.encode("empleado123"))
                    .rol(Usuario.Rol.EMPLEADO).build());
            System.out.println("✅ empleado@tienda.com / empleado123");
        }
        if (categoriaRepository.count() == 0) {
            List.of("Snacks","Bebidas","Galletas","Dulces","Higiene Personal",
                    "Limpieza","Helados","Bebidas Alcohólicas")
                .forEach(n -> categoriaRepository.save(Categoria.builder().nombre(n).build()));
            System.out.println("✅ Categorías creadas");
        }
        if (productoRepository.count() == 0) {
            Categoria snacks  = categoriaRepository.findAll().get(0);
            Categoria bebidas = categoriaRepository.findAll().get(1);
            Categoria dulces  = categoriaRepository.findAll().get(3);
            productoRepository.saveAll(List.of(
                Producto.builder().nombre("Papas Ruffles Original").categoria(snacks)
                    .precio(new BigDecimal("1.50")).stock(50).stockMinimo(10)
                    .descripcion("Papas fritas sabor original").build(),
                Producto.builder().nombre("Coca-Cola 350ml").categoria(bebidas)
                    .precio(new BigDecimal("1.00")).stock(100).stockMinimo(20)
                    .descripcion("Refresco de cola").build(),
                Producto.builder().nombre("Agua Pura 500ml").categoria(bebidas)
                    .precio(new BigDecimal("0.75")).stock(3).stockMinimo(15)
                    .descripcion("Agua purificada — stock bajo para demo").build(),
                Producto.builder().nombre("Chicles Trident").categoria(dulces)
                    .precio(new BigDecimal("0.50")).stock(80).stockMinimo(15).build(),
                Producto.builder().nombre("Doritos Nacho").categoria(snacks)
                    .precio(new BigDecimal("1.75")).stock(2).stockMinimo(10)
                    .descripcion("Frituras de maíz — stock bajo para demo").build()
            ));
            System.out.println("✅ Productos de ejemplo creados");
        }
    }
}
