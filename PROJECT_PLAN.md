## 🟢 Sprint 1 – Setup & Kiến trúc
**Goal:** Có skeleton backend trên Render, frontend trên AWS, CI/CD cơ bản, setup message broker.

| Epic | Task | Description | Type | Priority |
| :--- | :--- | :--- | :--- | :--- |
| 🧩 DevOps | BE-001: Setup Render environment | Tạo Project, Render Web Service (cho 3 services), Render PostgreSQL. | Backend | High |
| 🧩 DevOps | BE-002: CI/CD pipeline | Kết nối GitHub với Render (auto-deploy). Cấu hình GitHub Actions chỉ để chạy Test (CI). | Backend | High |
| 🧩 DevOps | ⭐️ BE-003: Setup Message Broker | Tạo instance RabbitMQ trên CloudAMQP (Free Tier). Lấy connection string. | Backend | High |
| ⚙️ Backend Core | BE-004: Init monorepo hoặc chia repo | Tạo 3 repo: user-service, chat-service, notification-service | Backend | Medium |
| ⚙️ Backend Core | BE-005: Setup NestJS/FastAPI base | Cấu trúc code + setup logging cơ bản + config dotenv + connect DBs & RabbitMQ. | Backend | High |
| 💻 Frontend Setup | FE-001: Tạo React project | Dựng app React + Vite/Next.js + routing cơ bản | Frontend | High |
| 💻 Frontend Setup | FE-002: Setup UI framework | Cài Tailwind + shadcn/ui + Recoil/Zustand + Axios | Frontend | Medium |
| 💻 Frontend Setup | FE-003: Tạo layout khung UI | Layout: sidebar, chat box, header notification | Frontend | Medium |

---

## 🟠 Sprint 2 – Authentication & User
**Goal:** Có thể đăng ký, đăng nhập, quản lý user cơ bản (UI đến Render DB).
*(Sprint này không thay đổi)*

| Epic | Task | Description | Type | Priority |
| :--- | :--- | :--- | :--- | :--- |
| 🔐 User Service | BE-101: Thiết kế bảng User & Role (PostgreSQL) | Tạo migration, entity cho user, role trên **Render PostgreSQL**. | Backend | High |
| 🔐 User Service | BE-102: API /auth/register, /auth/login, /auth/refresh | JWT, bcrypt, refresh token | Backend | High |
| 🔐 User Service | BE-103: API /users, /roles (CRUD) | Quản lý user và role cho admin | Backend | Medium |
| 💻 Auth UI | FE-101: Trang Login / Register UI | Form, validation, mock API | Frontend | High |
| 💻 Auth UI | FE-102: Kết nối API Auth thật | Gọi API backend (trên Render) qua Axios, lưu JWT. | Frontend | High |
| 💻 User List | FE-103: Trang danh sách User | Dùng API /users hiển thị table | Frontend | Medium |

---

## 🔵 Sprint 3 – Chat Service (MongoDB + RabbitMQ)
**Goal:** Chat hoạt động thật (tạo cuộc trò chuyện, gửi/nhận tin nhắn realtime).

| Epic | Task | Description | Type | Priority |
| :--- | :--- | :--- | :--- | :--- |
| 💬 Chat Service | BE-201: Setup MongoDB schema | Conversation, Message schema trên **Mongo Atlas**. | Backend | High |
| 💬 Chat Service | BE-202: API /conversations, /messages | CRUD hội thoại & tin nhắn | Backend | High |
| 💬 Chat Service | BE-203: Realtime WebSocket Gateway | Build WebSocket Gateway (vd: NestJS Gateway) chạy **trực tiếp trên Render Web Service**. | Backend | High |
| 💬 Chat Service | ⭐️ BE-204: RabbitMQ Integration | Publish event (vd: `new_message`) tới RabbitMQ Exchange (trên CloudAMQP). | Backend | Medium |
| 💻 Chat UI | FE-201: Trang danh sách hội thoại | Hiển thị list conversation | Frontend | High |
| 💻 Chat UI | FE-202: Trang chi tiết chat box | Gửi, nhận tin nhắn realtime, socket connect tới **Render**. | Frontend | High |
| 💻 Chat UI | FE-203: UI tạo nhóm chat | Popup chọn user, tạo conversation group | Frontend | Medium |

---

## 🟣 Sprint 4 – Notification Service & Realtime
**Goal:** Người dùng nhận được thông báo tin nhắn mới qua RabbitMQ và WebSocket.

| Epic | Task | Description | Type | Priority |
| :--- | :--- | :--- | :--- | :--- |
| 🔔 Notification Service | BE-301: Schema Notification (MongoDB) | Mô hình thông báo user (trên Mongo Atlas) | Backend | Medium |
| 🔔 Notification Service | BE-302: API /notifications | Lấy, tạo, đánh dấu read | Backend | Medium |
| 🔔 Notification Service | ⭐️ BE-303: Subcribe RabbitMQ event | Viết consumer để lắng nghe event từ RabbitMQ Queue và tạo notification. | Backend | High |
| 💻 Notification UI | FE-301: UI thông báo trong header | Bell icon + dropdown + badge | Frontend | Medium |
| 💻 Notification UI | FE-302: Lắng nghe realtime thông báo | Subcribe socket event “new_notification” từ **WebSocket server (Render)**. | Frontend | High |

---

## 🟡 Sprint 5 – Integration, Testing, Deployment
**Goal:** Hệ thống full chạy end-to-end, CI/CD hoàn chỉnh, có giám sát.

| Epic | Task | Description | Type | Priority |
| :--- | :--- | :--- | :--- | :--- |
| 🚀 CI/CD | BE-401: Deploy backend services lên Render | Cấu hình 3 Web Services trên Render, setup Environment Variables, domain. | Backend | High |
| 🚀 CI/CD | FE-401: Deploy frontend lên S3 + CloudFront | (Giữ nguyên) Tích hợp domain CloudFront. | Frontend | High |
| 🔍 Testing | BE-402: Unit + Integration test | Jest/Pytest cho từng service (chạy trên GitHub Actions). | Backend | Medium |
| 🔍 Testing | FE-402: UI test (Playwright / Cypress) | Test login, chat | Frontend | Medium |
| 🧩 DevOps | ⭐️ BE-403: Setup Logs & Monitoring | Kiểm tra và cấu hình (nếu cần) log trên Render. Setup Dashboard (Grafana) nếu có thời gian. | Backend | Low |