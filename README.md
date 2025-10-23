# Gestión de Eventos Comunitarios — React + Vite + AdminLTE

Aplicación SPA construida con React (Vite) y AdminLTE como template de dashboard. Incluye Sidebar, Navbar, Footer y un MainContent con rutas y componentes separados.

Este README documenta cómo preparar y desplegar el proyecto en producción sin variables de entorno.

## Requisitos

- Node.js LTS (>= 18)
- npm

## Scripts

- Desarrollo: `npm run dev`
- Build de producción: `npm run build`
- Preview local del build: `npm run preview`
- Linter: `npm run lint`

## Estructura relevante

- `src/App.jsx`: Estructura principal (Navbar, Sidebar, content-wrapper, Footer)
- `src/main.jsx`: Montaje de React + BrowserRouter (usa basename basado en la configuración de Vite)
- `src/components/*`: Componentes separados por carpeta
- `src/style/*`: Estilos globales y de componentes
- `src/api/config.js`: URL base del backend (hardcodeada)
- `src/api/http.js`: Wrapper fetch con manejo de JSON y errores
- `index.html`: Cargas de CSS/JS de AdminLTE desde CDN (Bootstrap 4.6, jQuery 3.6)
- `vite.config.js`: Configuración de Vite para base y build
- `public/_redirects`: Fallback SPA para Netlify

## Configuración para Producción (sin .env)

1) API Base URL
- Edita `src/api/config.js` y reemplaza:
  ```js
  export const API_BASE_URL = 'http://localhost:8080/api/v1';
  ```
  por la URL pública de tu backend, por ejemplo:
  ```js
  export const API_BASE_URL = 'https://api.tu-dominio.com/api/v1';
  ```
- Compromételo cuando el backend esté publicado (sabes que no es lo ideal, pero coincide con tu flujo).

2) Base Path (subruta) de la app
- Si sirves la SPA en el dominio raíz (https://tu-dominio.com), no cambies nada:
  ```js
  // vite.config.js
  export default defineConfig({
    base: '/', // ya configurado
    ...
  })
  ```
- Si vas a servir bajo una subruta (por ejemplo https://tu-dominio.com/miapp/), cambia en `vite.config.js`:
  ```js
  export default defineConfig({
    base: '/miapp/',
    ...
  })
  ```
- El Router ya está preparado: `BrowserRouter` usa `basename={import.meta.env.BASE_URL}` automáticamente a partir de la `base` de Vite. Al ajustar `base`, el enrutamiento se actualiza.

3) Assets y favicon
- `index.html` usa `./vite.svg` para que funcione en subrutas.
- Los assets del build serán prefijados con `base` por Vite.

4) Fallback de SPA (rutas)
- Para Netlify ya se incluye `public/_redirects`:
  ```
  /*    /index.html   200
  ```
- Para Nginx o Apache ver secciones abajo.

## Build y verificación local

1) Instalar dependencias
```
npm install
```

2) Generar build de producción
```
npm run build
```

3) Probar localmente la carpeta `dist`
```
npm run preview
```
- Se levantará en `http://localhost:5173` (o similar). Verifica navegación y llamadas a API.

## Despliegues

### Netlify
- Configuración:
  - Build command: `npm run build`
  - Publish directory: `dist`
- El archivo `public/_redirects` asegura que todas las rutas vayan a `index.html`.
- Si usas subruta a través de un Reverse Proxy, configura el proxy para servir la carpeta `dist` bajo esa subruta y ajusta `base` en `vite.config.js` en consecuencia.

### Vercel
- Proyecto de tipo Vite/React:
  - Build Command: `npm run build`
  - Output Directory: `dist`
- Vercel maneja SPA routes automáticamente si se usa el adaptador estático. No suele requerir reglas adicionales.
- Si sirves bajo subruta en Vercel (poco común), usa rewrites/redirections según tu estructura y ajusta `base`.

### Nginx
Ejemplo de configuración sirviendo en el dominio raíz:
```
server {
    listen 80;
    server_name tu-dominio.com;

    root /var/www/tu-app/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache estática opcional
    location /assets/ {
        access_log off;
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }
}
```
Si usas subruta, por ejemplo `/miapp/`:
```
location /miapp/ {
    alias /var/www/tu-app/dist/;
    try_files $uri $uri/ /miapp/index.html;
}
```
Y recuerda poner `base: '/miapp/'` en `vite.config.js`.

### Apache (htaccess)
Crea un `.htaccess` en el docroot del deploy:
```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```
Si usas subruta, ajusta `RewriteBase /miapp/` y la ruta de `index.html`.

### GitHub Pages
- GH Pages no soporta rewrites completos para SPA; solución común: copiar `index.html` como `404.html` en la carpeta de publicación para que redirija al SPA.
- Asegúrate de:
  - Usar `base: '/NOMBRE_REPO/'` en `vite.config.js`.
  - Publicar la carpeta `dist` al branch configurado (p. ej., `gh-pages`).
  - Añadir un `404.html` que sirva de fallback (puedes copiar el `dist/index.html` tras el build).

## Notas de seguridad
- Evitas `.env` por decisión. Recuerda no exponer secretos en el frontend. La `API_BASE_URL` hardcodeada está bien, pero tokens o credenciales no deben colocarse en el cliente.

## Troubleshooting
- Rutas rotas tras deploy bajo subruta:
  - Verifica `base` en `vite.config.js`.
  - El `BrowserRouter` ya usa `basename` según `base`.
- 404 en rutas internas (SPA):
  - En Netlify debe existir `public/_redirects`.
  - En Nginx/Apache, configura `try_files`/`RewriteRule` para redirigir a `index.html`.
- Llamadas a la API fallan:
  - Revisa `src/api/config.js` y la URL definitiva del backend.
  - Verifica CORS en el backend para el dominio del frontend.

## Desarrollo

- Ejecuta `npm run dev` y abre `http://localhost:5173/` (o el puerto que te indique).
- El dashboard usa AdminLTE desde CDN (Bootstrap 4.6 + jQuery). No se bundlean estas dependencias en el build.
