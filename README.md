# 🏪 Sistema de Inventarios — Tienda de Conveniencia
**Universidad Don Bosco | DWF404 | Carnet: HR242882**

Sistema web para gestión de inventario, ventas y control de stock de una tienda de conveniencia, desarrollado con Spring Boot y React.

---

## 🧱 Tecnologías utilizadas

| Capa | Tecnología |
|------|-----------|
| Backend | Java 17, Spring Boot 3.2.5, Maven |
| Seguridad | Spring Security + JWT |
| Base de datos | MySQL 8 (XAMPP) |
| ORM | Spring Data JPA + Hibernate |
| Frontend | React 18, Vite, Tailwind CSS |
| HTTP Client | Axios |
| Gráficas | Recharts |
| Documentación API | Swagger / SpringDoc OpenAPI |
| IDE | IntelliJ IDEA |
| Control de versiones | Git / GitHub |

---

## 📂 Estructura del proyecto

```
PROY_CATEDRA/
├── proyecto_final/          ← Backend Spring Boot
│   └── src/main/java/inventario/inventario/
│       ├── entity/          ← Entidades JPA
│       ├── repository/      ← Spring Data JPA
│       ├── service/         ← Lógica de negocio
│       ├── controller/      ← Endpoints REST
│       ├── security/        ← JWT + Spring Security
│       ├── config/          ← CORS, Swagger, DataInitializer
│       └── dto/             ← Objetos de transferencia
└── frontend/                ← Frontend React + Vite
    └── src/
        ├── pages/           ← Dashboard, Productos, Ventas...
        ├── components/      ← Layout, Sidebar
        ├── services/        ← Llamadas a la API (Axios)
        └── context/         ← AuthContext (manejo de JWT)
```

---

## ⚙️ Requisitos previos

- Java 17 o superior
- Maven 3.8+
- Node.js 18+
- XAMPP con MySQL activo en puerto **3306**
- IntelliJ IDEA (recomendado)

---

## 🚀 Procedimiento para correr el proyecto

### 1. Clonar o copiar los archivos
```bash
git clone https://github.com/Gabo-sangan/Proyecto_de_Catedra_DWF_HR242882.git
```
O copiar los archivos a una carpeta vacía.

### 2. Iniciar MySQL
Abrir **XAMPP** y encender el servicio **MySQL** en el puerto 3306.

> La base de datos `tienda_inventario` se crea automáticamente al iniciar el backend.

### 3. Correr el Backend
Abrir IntelliJ IDEA → navegar a:
```
proyecto_final/src/main/java/inventario/inventario/InventarioApplication.java
```
Dar clic derecho → **Run 'InventarioApplication'**

O desde CMD:
```cmd
cd proyecto_final
mvn spring-boot:run
```

✅ Backend corriendo en: `http://localhost:8080`

Al iniciar, el sistema crea automáticamente los usuarios y datos de prueba.

### 4. Correr el Frontend
Abrir una nueva ventana de CMD:
```cmd
cd frontend
npm install
npm run dev
```

✅ Frontend corriendo en: `http://localhost:5173`

---

## 🔑 Credenciales de acceso

| Usuario | Correo | Contraseña | Rol |
|---------|--------|------------|-----|
| Administrador | admin@tienda.com | admin123 | ADMIN |
| Empleado 1 | empleado@tienda.com | empleado123 | EMPLEADO |

---

## 📋 Permisos por rol

| Acción | ADMIN | EMPLEADO |
|--------|-------|----------|
| Ver productos | ✅ | ✅ |
| Crear / Editar / Eliminar productos | ✅ | ❌ |
| Ver categorías | ✅ | ✅ |
| Crear / Editar / Eliminar categorías | ✅ | ❌ |
| Registrar entradas y salidas de inventario | ✅ | ✅ |
| Registrar ventas | ✅ | ✅ |
| Ver dashboard y estadísticas | ✅ | ✅ |

---

## 📡 Documentación de la API — Swagger

Acceder a Swagger UI en:
```
http://localhost:8080/swagger-ui.html
```

### Autenticación en Swagger

**Paso 1** — Ejecutar `POST /api/auth/login`:
```json
{
  "correo": "admin@tienda.com",
  "contrasena": "admin123"
}
```

**Paso 2** — Copiar el `token` de la respuesta.

**Paso 3** — Clic en **🔒 Authorize** → pegar el token (sin la palabra Bearer) → clic **Authorize**.

> El token expira en **7 días**. Si expira, repetir el login.

---

## 🗂 Entidades del sistema

```
Usuario        → id, nombre, correo, contrasena, rol (ADMIN|EMPLEADO)
Categoria      → id, nombre
Producto       → id, nombre, categoria, precio, stock, stockMinimo, descripcion
MovInventario  → id, producto, tipoMovimiento, cantidad, descripcion, fecha
Venta          → id, fecha, totalSinDescuento, descuento, total, usuario
DetalleVenta   → id, venta, producto, cantidad, precioUnitario, subtotal
```

---

## ✅ Funcionalidades implementadas

- [x] Login seguro con JWT
- [x] Roles ADMIN y EMPLEADO con permisos diferenciados
- [x] CRUD completo de productos con validaciones
- [x] CRUD completo de categorías
- [x] Control de stock mínimo con alertas visuales
- [x] Registro de entradas y salidas de inventario
- [x] Registro de ventas con carrito interactivo
- [x] Descuentos por porcentaje en ventas (0%, 5%, 10%, 15%, 20%, 25%, 50%, 75%, 100%)
- [x] Dashboard con gráficas de ventas (Recharts)
- [x] Búsqueda de productos en tiempo real
- [x] Swagger UI para documentación y pruebas de la API
- [x] CORS configurado para desarrollo local
- [x] Manejo global de errores

---

*Desarrollado con Spring Boot + React | DWF404 — Universidad Don Bosco 2026*
