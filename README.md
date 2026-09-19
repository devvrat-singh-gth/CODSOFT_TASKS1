# WorkOrbit Project Management Tool

A modern full-stack project management platform designed to help individuals and teams organize projects, manage tasks, track progress, and improve productivity through a clean, responsive, and intuitive workspace.

![Dashboard Preview](./screenshots/dashboard.png)

---

## Overview

WorkOrbit centralizes project and task management into a single workspace where users can create projects, manage tasks, monitor progress, and stay focused on their goals.

The application combines a modern user experience with a scalable architecture to provide efficient workflow management for both individual users and growing teams.

---

## Key Features

### Authentication & Security

- Secure JWT-based authentication
- Protected routes
- Session management
- User profile management

### Project Management

- Create and manage projects
- Update project details
- Track project progress
- Project status monitoring
- Project overview dashboard

### Task Management

- Create and organize tasks
- Priority management
- Status tracking
- Completion monitoring
- Overdue task detection

### Productivity Dashboard

- Completion rate insights
- Project statistics
- Task statistics
- Recent activity overview
- Productivity tracking

### Modern User Experience

- Responsive design
- Mobile-friendly interface
- Smooth animations using Framer Motion
- Clean workspace layout
- Dark mode support

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|----------|
| React | User Interface |
| TypeScript | Type Safety |
| Vite | Development & Build Tool |
| Tailwind CSS | Styling |
| Framer Motion | Animations |

### Backend

| Technology | Purpose |
|------------|----------|
| Node.js | Runtime Environment |
| Express.js | REST API Framework |
| TypeScript | Type Safety |
| JWT | Authentication |
| Prisma ORM | Database Access Layer |

### Database & Infrastructure

| Technology | Purpose |
|------------|----------|
| PostgreSQL | Relational Database |
| Neon | Managed Cloud PostgreSQL |
| Prisma Migrate | Database Schema Management |

---

## Architecture

```text
┌─────────────────────┐
│      Frontend       │
│ React + TypeScript  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     REST APIs       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Express Backend    │
│     Node.js API     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     Prisma ORM      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Neon PostgreSQL DB  │
└─────────────────────┘
```

---

## User Workflow

```text
Login / Register
        │
        ▼
Dashboard
        │
        ├───────────────┐
        ▼               ▼
Projects            Tasks
        │               │
        ▼               ▼
Create/Edit      Create/Edit
Project          Task
        │               │
        ▼               ▼
Track Progress   Update Status
        │               │
        └───────┬───────┘
                ▼
        Productivity Insights
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd ProjectManagementTool
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

### Backend Setup

```bash
cd backend

npm install

npm run dev
```

Backend:

```text
http://localhost:5000
```

---

## Environment Variables

Create a `.env` file inside the backend directory.

```env
DATABASE_URL=
JWT_SECRET=
PORT=5000
```

---

## Future Enhancements

### Collaboration Features

- Team workspaces
- Project member invitations
- Role-based permissions
- Shared project boards

### Productivity Features

- Activity timeline
- Task dependencies
- Sprint management
- Milestone tracking
- Advanced analytics

### Communication Features

- Project discussions
- Mentions and comments
- Real-time notifications
- In-app messaging

### File Management

- File uploads
- Document attachments
- Cloud storage integration
- Project resources library

### Calendar & Scheduling

- Calendar view
- Deadline reminders
- Event scheduling
- Timeline visualization

### Advanced UX/UI Improvements

- Kanban board view
- Drag-and-drop task management
- Custom dashboard widgets
- Workspace personalization
- Theme customization
- Enhanced micro-interactions
- Real-time collaboration indicators

### Enterprise Scalability

- Multi-workspace architecture
- Audit logs
- API integrations
- Webhooks
- Advanced reporting
- Team analytics
- Performance monitoring

---

## Author

Devvrat Singh
