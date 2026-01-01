
<div align="center">

# ZenTask | Productivity Redefined
</div>

ZenTask is a high-performance, professional task management suite designed to eliminate decision fatigue and cognitive overload. Built as a scalable REST-inspired application, it features secure authentication, Role-Based Access Control (RBAC), and the signature **Zen Flow™** adaptive engine.

### 🌿 Signature Feature: Zen Flow™
Traditional task managers cause anxiety with endless lists. **Zen Flow™** shifts the paradigm by presenting only one meaningful task at a time, dynamically selected based on your current state.

- **Morning Check-in:** Aligns your workload with your current energy levels (Low, Medium, High).
- **Time-Aware Logic:** Filters tasks based on your available window (15m, 30m, 1h).
- **One-Task Focus:** An immersive UI removes distractions, showing only the task that matters right now.

### 🚀 Core Features
- **Identity Management:** Secure JWT-based session management with persistent authentication.
- **RBAC Infrastructure:** Distinct modules for Administrators (Global Stats, User Directory) and Standard Users.
- **Full CRUD Entity:** Comprehensive task lifecycle management with metadata for mental effort and time estimation.
- **Adaptive UI:** Responsive glassmorphism design with seamless Dark/Light mode integration.

### 📂 Architecture & Scalability
- **Stateless Design:** Scalable JWT architecture ready for horizontal scaling behind NGINX.
- **Caching Ready:** Designed for Redis integration to handle high-frequency resource retrieval.
- **Resource Decoupling:** Modular service layer allowing for easy replacement of mock controllers with production backends.

---

View app: 

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `API_KEY` in [cp .env.example](.env.local) to your project API key
3. Run the app:
   `npm run dev`
