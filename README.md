# Sistema de Chat en Tiempo Real 💬

Este proyecto es una aplicación web de chat en tiempo real desarrollada para aprender e implementar conceptos avanzados como WebSockets, autenticación segura con JWT, persistencia en base de datos y diseño de interfaces responsivas y modernas (UI/UX).

El sistema cuenta con un backend robusto en **FastAPI** y un frontend dinámico en **React** con estilo *Glassmorphism* usando Tailwind CSS.

---

## 🚀 Características Principales

- **Autenticación Segura**: Registro e inicio de sesión de usuarios con contraseñas encriptadas (`bcrypt`) y manejo de sesiones seguras mediante tokens JWT (`localStorage`).
- **Salas de Chat Dinámicas**: Creación automática y unión a salas de chat independientes.
- **Mensajería en Tiempo Real**: Comunicación instantánea (bidireccional) gracias a la implementación de **WebSockets**.
- **Historial Persistente**: Los mensajes y las salas se guardan automáticamente en una base de datos PostgreSQL mediante SQLAlchemy. Al unirse a una sala, se recupera el historial completo.
- **Deep Linking (Invitaciones)**: Las salas pueden compartirse mediante enlaces de invitación (ej. `?room=General`), permitiendo que otros usuarios se unan con un solo clic gracias a la API nativa de portapapeles.
- **Diseño UI/UX Premium**: Interfaz *Responsive* (Mobile-First) con animaciones fluidas, fondos degradados, efecto vidrio (Glassmorphism), fuentes modernas (Inter) y autoscroll.

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Python 3.12+**
- **FastAPI**: Framework web moderno y de alto rendimiento.
- **WebSockets**: Para la comunicación en tiempo real (`websockets`).
- **SQLAlchemy**: ORM para la gestión de la base de datos PostgreSQL.
- **Pydantic**: Validación de datos y serialización.
- **Passlib & Bcrypt**: Encriptación y seguridad de contraseñas.
- **Jose (JWT)**: Generación y validación de JSON Web Tokens.

### Frontend
- **React 19**: Biblioteca para construir interfaces de usuario.
- **Vite**: Entorno de desarrollo ultrarrápido para React.
- **TypeScript**: Tipado estático para un código más seguro y predecible.
- **Tailwind CSS**: Framework de utilidades CSS para diseño responsivo y *Glassmorphism*.

---

## ⚙️ Instalación y Configuración (Local)

Para correr este proyecto en tu propia computadora, debes iniciar ambos servicios (Backend y Frontend).

### 1. Configuración del Backend
Abre tu terminal en la carpeta `/back`:

1. Crea tu entorno virtual:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Instala las dependencias necesarias:
   ```bash
   pip install fastapi uvicorn[standard] sqlalchemy python-jose[cryptography] passlib bcrypt pydantic python-dotenv python-multipart websockets
   ```
3. Configura tu archivo `.env` en la carpeta `/back` con tus credenciales de PostgreSQL y tus secretos JWT:
   ```env
   DATABASE_URL=postgresql://usuario:password@localhost/tu_base_de_datos
   SECRET_KEY=tu_clave_secreta_muy_segura
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```
4. Inicia el servidor de FastAPI:
   ```bash
   python3 app.py
   ```
   *(El servidor estará disponible en `http://localhost:8000`)*

### 2. Configuración del Frontend
Abre una nueva pestaña de terminal en la carpeta `/front`:

1. Instala las dependencias de Node.js (usando pnpm, npm o yarn):
   ```bash
   pnpm install
   ```
2. Crea tu archivo `.env` en la carpeta `/front`:
   ```env
   VITE_BACKEND_URL=http://localhost:8000
   ```
3. Inicia el entorno de desarrollo:
   ```bash
   pnpm dev
   ```
   *(La aplicación estará disponible en `http://localhost:5173`)*

---

## 📚 Arquitectura de la Base de Datos
- **Users**: Almacena credenciales y datos básicos del usuario.
- **Rooms**: Almacena las salas de chat que han sido creadas.
- **Messages**: Almacena el contenido del mensaje, la fecha/hora y las llaves foráneas apuntando al usuario que lo envió y a la sala a la que pertenece.
