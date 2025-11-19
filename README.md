# Chat Realtime - Microservices Application

Ứng dụng chat thời gian thực với kiến trúc microservices.

## 🏗️ Kiến trúc

### Frontend (React)
- **Framework**: React + Vite + TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **HTTP**: Axios
- **Realtime**: Socket.IO Client

### Backend (3 Microservices)
- **User Service** - Authentication, user management (PostgreSQL)
- **Chat Service** - Conversations, messages, WebSocket (MongoDB)
- **Notification Service** - Notifications, RabbitMQ consumer (MongoDB)

### Infrastructure
- **Message Broker**: RabbitMQ (CloudAMQP)
- **Databases**: PostgreSQL (Render) + MongoDB (Atlas)
- **Deployment**:
  - Frontend: AWS S3 + CloudFront
  - Backend: Render Web Services

## 📁 Cấu trúc Project

```
CHAT-REALTIME/
├── frontend/          # React frontend app
├── user-service/      # User & Auth microservice (TODO)
├── chat-service/      # Chat & WebSocket microservice (TODO)
├── notification-service/  # Notification microservice (TODO)
├── CLAUDE.md          # Hướng dẫn cho Claude Code
└── README.md
```

## 🚀 Cài đặt & Chạy

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📝 Tính năng đã implement (Frontend)

### ✅ Sprint 1 - Setup & Architecture
- [x] FE-001: Tạo React project
- [x] FE-002: Setup UI framework
- [x] FE-003: Tạo layout chính

### ✅ Sprint 2 - Authentication & User
- [x] FE-101: UI Login/Register
- [x] FE-102: Kết nối API Auth
- [x] FE-103: UI User list

### ✅ Sprint 3 - Chat Service
- [x] FE-201: UI danh sách hội thoại
- [x] FE-202: UI chat realtime (WebSocket)
- [x] FE-203: UI tạo group chat

### ⏳ Sprint 4 - Notification (TODO)
- [ ] FE-301: UI Notification dropdown
- [ ] FE-302: Realtime notification

### ⏳ Sprint 5 - Testing & Deployment (TODO)
- [ ] FE-401: Deploy frontend
- [ ] FE-402: UI test

## 🔧 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite 7
- Tailwind CSS 3
- Zustand (State Management)
- Axios (HTTP Client)
- Socket.IO Client (WebSocket)
- React Router 6
- Lucide React (Icons)

**Backend:** (Coming soon)
- NestJS / FastAPI
- PostgreSQL + MongoDB
- RabbitMQ
- Socket.IO Server
- JWT Authentication

## 📚 Tài liệu

Xem [CLAUDE.md](./CLAUDE.md) để biết thêm chi tiết về kiến trúc và workflow.

---

🤖 Generated with Claude Code
