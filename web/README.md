# Pastelería Real - Frontend Web

Aplicación web frontend desarrollada con React + TypeScript + Vite que consume la API REST de Pastelería Real.

## Tecnologías Utilizadas

- **React 19**: Biblioteca de UI
- **TypeScript**: Tipado estático
- **Vite**: Build tool y dev server
- **React Router DOM**: Enrutamiento
- **Bootstrap 5**: Framework CSS
- **Bootstrap Icons**: Iconos
- **Vitest**: Testing framework

## Requisitos

- Node.js 18+ o superior
- npm o pnpm

## Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd pasteleria-web
```

### 2. Instalar dependencias

```bash
npm install
# o
pnpm install
```

### 3. Configurar la URL de la API

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8080/api
```

### 4. Ejecutar en modo desarrollo

```bash
npm run dev
# o
pnpm dev
```

La aplicación estará disponible en: `http://localhost:5173`

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter
- `npm run test` - Ejecuta los tests
- `npm run test:watch` - Ejecuta los tests en modo watch
- `npm run test:coverage` - Genera reporte de cobertura

## Estructura del Proyecto

```
src/
├── components/      # Componentes reutilizables
│   ├── footer/
│   ├── header/
│   ├── parallaxHero/
│   ├── product/
│   └── ui/
├── context/         # Contextos de React (Auth, Cart)
├── data/            # Datos estáticos (DEPRECADO - usar API)
├── hooks/           # Custom hooks
├── pages/           # Páginas de la aplicación
│   ├── account/
│   ├── admin/
│   ├── auth/
│   ├── blog/
│   ├── cart/
│   ├── checkout/
│   ├── contacto/
│   ├── home/
│   ├── nosotros/
│   └── productos/
├── routes/          # Componentes de rutas protegidas
├── styles/          # Estilos globales
├── types/           # Definiciones de tipos TypeScript
└── utils/           # Utilidades y helpers
```

## Integración con la API

### Configuración de Axios (Recomendado)

Crear un archivo `src/services/api.ts`:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Ejemplo de uso

```typescript
import api from './services/api';

// Login
const login = async (correo: string, password: string) => {
  const response = await api.post('/auth/login', { correo, password });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

// Obtener productos
const getProductos = async () => {
  const response = await api.get('/productos');
  return response.data;
};

// Crear producto (requiere autenticación)
const createProducto = async (producto) => {
  const response = await api.post('/productos', producto);
  return response.data;
};
```

## Autenticación

### Flujo de autenticación

1. **Login**: El usuario ingresa correo y contraseña
2. **Token JWT**: La API devuelve un token que se almacena en `localStorage`
3. **Requests autenticados**: El token se incluye en el header `Authorization`
4. **Logout**: Se elimina el token de `localStorage`

### Gestión de sesión

El contexto `AuthContext` maneja:
- Estado de autenticación del usuario
- Almacenamiento del token JWT
- Persistencia de sesión (localStorage)
- Roles y permisos del usuario

## Rutas Protegidas

### Componentes de protección

- **ProtectedRoute**: Requiere autenticación
- **RequireAdmin**: Requiere rol de administrador
- **RequireCartNotEmpty**: Requiere carrito con productos

### Ejemplo de uso

```typescript
<Route 
  path="/admin" 
  element={
    <ProtectedRoute>
      <RequireAdmin>
        <Admin />
      </RequireAdmin>
    </ProtectedRoute>
  } 
/>
```

## Restricciones de Acceso por Rol

| Página/Funcionalidad | Cliente | Vendedor | Administrador | SuperAdmin |
|---------------------|---------|----------|---------------|------------|
| Ver productos | ✅ | ✅ | ✅ | ✅ |
| Comprar productos | ✅ | ✅ | ✅ | ✅ |
| Crear productos | ❌ | ✅ | ✅ | ✅ |
| Editar productos | ❌ | ✅ | ✅ | ✅ |
| Eliminar productos | ❌ | ❌ | ✅ | ✅ |
| Gestionar categorías | ❌ | ❌ | ✅ | ✅ |
| Panel de administración | ❌ | ❌ | ✅ | ✅ |
| Gestionar usuarios | ❌ | ❌ | ❌ | ✅ |

## Características Implementadas

### ✅ Integración con API REST
- Consumo de endpoints de la API
- Manejo de tokens JWT
- Interceptores de Axios

### ✅ Gestión de Sesiones
- Persistencia en localStorage
- Renovación automática de sesión
- Logout seguro

### ✅ Restricciones de Acceso
- Rutas protegidas por autenticación
- Control de acceso basado en roles
- Redirección automática

### ✅ Interfaz de Usuario
- Diseño responsive con Bootstrap 5
- Componentes reutilizables
- Experiencia de usuario fluida

## Migración de Datos Locales a API

### Antes (datos locales)
```typescript
import productos from './data/products/productos.json';
```

### Después (API REST)
```typescript
import api from './services/api';

const productos = await api.get('/productos');
```

## Testing

```bash
# Ejecutar todos los tests
npm run test

# Tests en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

## Build para Producción

```bash
npm run build
```

Los archivos compilados se generarán en la carpeta `dist/`

## Despliegue

### Vercel / Netlify

1. Conectar el repositorio
2. Configurar variables de entorno:
   - `VITE_API_URL`: URL de la API en producción
3. Deploy automático

### Servidor tradicional

```bash
npm run build
# Copiar el contenido de dist/ al servidor web
```

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base de la API | `http://localhost:8080/api` |

## Usuarios de Prueba

| Correo | Password | Rol |
|--------|----------|-----|
| ana.maria@gmail.cl | password123 | SuperAdmin |
| luis.felipe@gmail.com | password123 | Administrador |
| claudia.isabel@duoc.cl | password123 | Cliente |

## Solución de Problemas

### Error de CORS

Verificar que la API tenga configurado CORS para la URL del frontend:

```properties
# En application.properties del backend
cors.allowed-origins=http://localhost:5173
```

### Token expirado

El token JWT expira después de 24 horas. Si recibes error 401, vuelve a iniciar sesión.

### API no responde

Verificar que el backend esté ejecutándose en `http://localhost:8080`

## Contacto y Soporte

Para consultas o reportar problemas, contacta al equipo de desarrollo.

---

**Desarrollado para Evaluación Parcial 3 - DSY1104 Desarrollo Fullstack II**
