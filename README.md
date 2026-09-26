# Planner / Study Tracker Pro

Aplicación web Full-Stack para gestionar tareas académicas y sincronizarlas con Google Calendar. 

Actualmente, el proyecto cuenta con el frontend interactivo, el sistema de autenticación (login/registro) y una base de datos local funcional utilizando SQLite. **El objetivo principal para el desarrollador colaborador es implementar la integración real con la API de Google Calendar.**

## 🛠️ Tecnologías Utilizadas
* **Backend:** Node.js, Express
* **Base de Datos:** SQLite3
* **Autenticación:** express-session, bcryptjs
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (Single Page Application)

## 🚀 Estado Actual del Proyecto
El sistema ya tiene implementado y funcionando lo siguiente:
1. **Base de Datos (`study_tracker.db`):** Tablas creadas para `users`, `subjects` (materias) y `tasks` (tareas).
2. **Autenticación:** Registro de usuarios con contraseñas encriptadas y login mediante sesiones.
3. **CRUD Básico:** El usuario puede crear sus propias materias (clases) y agregar tareas manualmente desde el panel interactivo.
4. **Protección de Rutas:** Los endpoints de la API están protegidos mediante el middleware `checkAuth`.

## 🎯 Tareas para el Desarrollador (Google Calendar API)
Necesitamos reemplazar la funcionalidad simulada del botón "Sync Google Calendar" por una integración real bidireccional o de lectura utilizando OAuth 2.0.

**Requisitos específicos:**
1. **Flujo OAuth 2.0:** Implementar la autenticación con Google para que el usuario autorice el acceso a su calendario.
2. **Integración con `googleapis`:** Utilizar la librería oficial para extraer los próximos eventos del usuario.
3. **Mapeo de Datos:** Los eventos traídos de Google Calendar deben insertarse/actualizarse en la tabla `tasks` de la base de datos local SQLite (asignándoles el `user_id` correspondiente). 
4. **Endpoint:** Utilizar o modificar la ruta ya declarada `/api/sync-calendar` en `server.js` para manejar esta lógica.

*Nota:* Si necesitas agregar variables de entorno para los Client ID y Secret, por favor utiliza un paquete como `dotenv`. Asegúrate de no subir claves ni el archivo `.env` al repositorio (ya están ignorados en el `.gitignore`).

## ⚙️ Instrucciones de Instalación local

1. Clona este repositorio.
2. Instala las dependencias del proyecto:
   ```bash
   npm install
