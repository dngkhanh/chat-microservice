# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a realtime chat application built with a microservices architecture. The system consists of:

- **Backend Services** (3 microservices deployed on Render):
  - User Service (NestJS/FastAPI) - Authentication, user management, roles (PostgreSQL)
  - Chat Service (NestJS/FastAPI) - Conversations, messages, WebSocket gateway (MongoDB)
  - Notification Service (NestJS/FastAPI) - Notifications, RabbitMQ consumer (MongoDB)

- **Frontend** (React deployed on AWS S3 + CloudFront):
  - React + Vite/Next.js
  - Tailwind CSS + shadcn/ui
  - State management: Recoil/Zustand
  - HTTP client: Axios

- **Infrastructure**:
  - Message Broker: RabbitMQ on CloudAMQP (Free Tier)
  - Databases: Render PostgreSQL + MongoDB Atlas
  - Realtime: WebSocket Gateway on Render
  - CI/CD: GitHub Actions (testing) + Render auto-deploy

## Architecture

### Microservices Communication
- Services communicate via RabbitMQ for event-driven architecture
- Chat Service publishes `new_message` events to RabbitMQ Exchange
- Notification Service subscribes to RabbitMQ Queue to consume events and create notifications
- All services connect to CloudAMQP using connection strings from environment variables

### Realtime Communication
- WebSocket Gateway runs directly on Render Web Service (within Chat Service)
- Frontend connects to WebSocket server on Render for realtime chat and notifications
- Events: `new_message`, `new_notification`

### Data Storage
- **PostgreSQL** (Render): User, Role tables
- **MongoDB Atlas**: Conversation, Message, Notification collections

## Development Workflow

### Project Structure
The codebase will be organized as either:
- Monorepo with 3 service folders, OR
- 3 separate repositories: user-service, chat-service, notification-service

### Environment Configuration
Each service requires:
- Database connection strings (PostgreSQL for User Service, MongoDB for Chat/Notification)
- RabbitMQ connection string from CloudAMQP
- JWT secrets for authentication
- CORS configuration for frontend domain

### Testing
- Backend: Jest (NestJS) or Pytest (FastAPI) for unit and integration tests
- Frontend: Playwright or Cypress for E2E UI tests
- CI runs tests via GitHub Actions

### Deployment
- **Backend**: Auto-deploy to Render on git push
- **Frontend**: Deploy to S3 + CloudFront with domain configuration
- Environment variables configured in Render dashboard

## Key Technical Decisions

### Authentication
- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Role-based access control (RBAC)

### Realtime Features
- WebSocket Gateway for bidirectional communication
- Event-driven notifications via RabbitMQ
- Message persistence in MongoDB before event publishing

### UI/UX Structure
- Sidebar for conversation list
- Chat box for message display and input
- Header notification bell with badge and dropdown

## Development Phases

The project follows a 5-sprint plan (see PROJECT_PLAN.md):
1. Setup & Architecture - Infrastructure, DevOps, skeleton apps
2. Authentication & User - Login, register, user management
3. Chat Service - MongoDB, WebSocket, RabbitMQ integration
4. Notification Service - RabbitMQ consumer, realtime notifications
5. Integration, Testing, Deployment - E2E testing, monitoring

## Frontend Tasks

### Sprint 1 - Setup & Architecture
- **FE-001**: Tạo React project (React + Vite/Next.js + routing cơ bản)
- **FE-002**: Setup UI framework (Tailwind + shadcn/ui + Zustand + Axios)
- **FE-003**: Tạo layout chính (sidebar, chat box, header notification)

### Sprint 2 - Authentication & User
- **FE-101**: UI Login/Register (form, validation)
- **FE-102**: Kết nối API Auth (gọi backend API, lưu JWT)
- **FE-103**: UI User list (hiển thị danh sách user)

### Sprint 3 - Chat Service
- **FE-201**: UI danh sách hội thoại (conversation list)
- **FE-202**: UI chat realtime (chat box với WebSocket)
- **FE-203**: UI tạo group chat (popup chọn user)

### Sprint 4 - Notification
- **FE-301**: UI Notification dropdown (bell icon + badge + dropdown)
- **FE-302**: Realtime notification (subscribe WebSocket event)

### Sprint 5 - Testing & Deployment
- **FE-401**: Deploy frontend (S3 + CloudFront + domain)
- **FE-402**: UI test (Playwright/Cypress - test login, chat)

## Important Notes

- WebSocket server runs on Render (not a separate service)
- RabbitMQ is hosted on CloudAMQP, not self-hosted
- All three backend services deploy to Render Web Services
- Frontend connects to backend via Render domains
- Logging should be configured for all services (check Render logs)
