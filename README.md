# ConnectKaro (ConnectX) 🚀

> **Username-Based Real-Time Communication Platform**  
> Connect and communicate freely without revealing or requiring your personal phone number.

---

## 📁 Project Architecture

The project is structured into frontend and backend modules inside `connectKaro`:

```
connectKaro/
├── frontend/             # React + Vite Client
│   ├── src/              # Components, Contexts, Pages, Services, Hooks
│   ├── public/           # Static assets, audio ringtones, icons
│   ├── package.json      # Frontend dependencies & scripts
│   └── vite.config.js    # Vite configuration
│
└── backend/              # Spring Boot REST + WebSocket Backend
    ├── src/main/java/    # Controllers, Services, Entities, Repositories, Security
    ├── src/main/resources/ # application.properties, email templates
    └── pom.xml           # Maven build & dependencies
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **HTTP & Sockets**: Axios + WebSocket (STOMP)
- **Routing**: React Router DOM v7

### Backend
- **Framework**: Spring Boot 3.4 (Java 21)
- **Database**: PostgreSQL with Spring Data JPA & Hibernate
- **Real-Time**: Spring WebSocket + STOMP
- **Security**: Spring Security 6 with JWT (Access & Refresh Tokens) + BCrypt
- **Mailing**: Spring Mail with HTML Verification / Password Reset templates
- **Storage**: Cloudinary / S3-compatible file storage

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **Java JDK** (v21)
- **Maven** (or use included `./mvnw`)
- **PostgreSQL** instance running

### 2. Backend Setup
```bash
cd connectKaro/backend
./mvnw spring-boot:run
```
Backend runs by default at `http://localhost:8080`.

### 3. Frontend Setup
```bash
cd connectKaro/frontend
npm install
npm run dev
```
Frontend runs by default at `http://localhost:5173` (or `5174`).

---

## 📜 Key Features
- **Phone-Number-Free Identity**: Sign up with email, communicate using unique `@username`.
- **Real-Time Messaging**: Direct chats, live indicators, message status receipts.
- **Audio & Video Calling**: WebRTC-powered calling with real ringtones and call signaling.
- **Security & Privacy**: Strict JWT authorization, CORS protection, customizable privacy controls.
