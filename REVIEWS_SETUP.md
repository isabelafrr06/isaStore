# Sistema de Reseñas con OAuth

Este sistema permite a los usuarios dejar reseñas autenticándose con Google o Facebook.

## Configuración Requerida

### Frontend (Vite)

Agregar estas variables de entorno en `.env` o en la configuración de Vercel:

```
VITE_GOOGLE_CLIENT_ID=tu-google-client-id.apps.googleusercontent.com
VITE_FACEBOOK_APP_ID=tu-facebook-app-id
```

### Backend (Railway)

Agregar estas variables de entorno en Railway:

```
FACEBOOK_APP_ID=tu-facebook-app-id
FACEBOOK_APP_SECRET=tu-facebook-app-secret
```

## Configuración de Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a "APIs & Services" > "Credentials"
4. Crea credenciales OAuth 2.0 Client ID
5. Agrega los orígenes autorizados:
   - `http://localhost:5173` (desarrollo)
   - `https://tu-dominio.vercel.app` (producción)
6. Copia el Client ID y agrégalo a `VITE_GOOGLE_CLIENT_ID`

## Configuración de Facebook OAuth

1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. Crea una nueva aplicación
3. Agrega el producto "Facebook Login"
4. En configuración básica, agrega:
   - Dominios autorizados: `tu-dominio.vercel.app`
   - URLs de redirección de OAuth válidas:
     - `http://localhost:5173`
     - `https://tu-dominio.vercel.app`
5. Obtén el App ID y App Secret
6. Agrega `VITE_FACEBOOK_APP_ID` al frontend
7. Agrega `FACEBOOK_APP_ID` y `FACEBOOK_APP_SECRET` al backend

## Funcionalidades

- **Autenticación OAuth**: Los usuarios se autentican con Google o Facebook
- **Reseñas verificadas**: Solo usuarios autenticados pueden dejar reseñas
- **Una reseña por usuario**: Cada usuario (por provider) solo puede dejar una reseña
- **Moderación**: Las reseñas requieren aprobación del admin antes de mostrarse
- **Sistema de calificación**: 1-5 estrellas
- **Comentarios opcionales**: Los usuarios pueden agregar texto adicional

## Endpoints del Backend

- `GET /api/reviews` - Obtener reseñas aprobadas (público)
- `GET /api/admin/reviews` - Obtener todas las reseñas (admin)
- `POST /api/reviews` - Crear nueva reseña (requiere OAuth)
- `PUT /api/admin/reviews/:id` - Actualizar reseña (admin)
- `DELETE /api/admin/reviews/:id` - Eliminar reseña (admin)

## Notas Importantes

- Las reseñas se crean como `approved: false` por defecto y requieren aprobación del admin
- El sistema verifica los tokens OAuth en el backend antes de crear la reseña
- Los usuarios solo pueden dejar una reseña por proveedor (Google o Facebook)

