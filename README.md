# 🎓 Graspify — AI-Powered Study Canvas

> Stop panicking. Start Graspifying.

Graspify is a full-stack web application that brings together everything a student needs in one intelligent workspace — YouTube videos, notes, PDFs, and an AI assistant — all on a single draggable, resizable canvas.

---

## ✨ Features

### 📋 Canvas System
- Create unlimited study canvases
- Soft delete with full restore history — nothing is ever permanently lost
- Permanent delete option for complete removal
- Canvas persistence across sessions via PostgreSQL

### 🎨 Panel Workspace
- **YouTube Panel** — embed any YouTube video directly on your canvas
- **Notes Panel** — rich text notes with auto-save
- **PDF Panel** — upload and read PDF files without leaving your canvas
- **AI Assistant Panel** — ask questions, get instant answers powered by Groq LLaMA

### 🤖 AI Features
- **Highlight-to-Ask** — select any text on the canvas and instantly ask AI to explain it
- **Context-aware AI** — AI reads your Notes panels for smarter, contextual answers
- Powered by **Groq's LLaMA 3.1 8B Instant** model for fast responses

### ⏱️ Study Session Tracking
- Global persistent timer across all pages
- Track study sessions by subject
- Weekly analytics to monitor progress
- Session notes for reflection

### � User Management
- Email/Password Login & Signup
- Google OAuth integration
- Guest access (30 min limit, 10 actions)
- Customizable user profiles with image upload (up to 5MB)

### 🔐 Authentication
- JWT-based authentication with role-based access
- Secure token storage via Zustand + localStorage
- Guest mode for exploration (no data persistence)

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React + Vite | UI framework |
| Zustand | State management with persistence |
| React Router | Client-side routing |
| Axios | API calls |
| react-pdf | PDF rendering |

### Backend
| Tech | Purpose |
|------|---------|
| Spring Boot 3.2.5 | REST API framework |
| Java 21 | Language |
| PostgreSQL | Database |
| Hibernate/JPA | ORM |
| Flyway | Database migrations |
| JWT (JJWT) | Authentication |
| Spring Security | Endpoint protection |
| Lombok | Boilerplate reduction |

### AI
| Tech | Purpose |
|------|---------|
| Groq API | LLM inference |
| LLaMA 3.1 8B Instant | AI model |
| Gemini API | Backup AI provider |

---

## 🚀 Getting Started

### Prerequisites
- Java 21
- Node.js 18+
- PostgreSQL 16
- Maven

### Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/graspify.git
cd graspify
```

### Backend Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE graspify_db;
CREATE USER graspify_user WITH PASSWORD 'graspify123';
GRANT ALL PRIVILEGES ON DATABASE graspify_db TO graspify_user;
```

2. Navigate to backend directory:
```bash
cd graspify-backend
```

3. Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/graspify_db
spring.datasource.username=graspify_user
spring.datasource.password=graspify123
groq.api.key=YOUR_GROQ_API_KEY
gemini.api.key=YOUR_GEMINI_API_KEY
jwt.secret=your-secret-key-here
jwt.expiration=86400000
cors.allowed-origins=http://localhost:5173
```

4. Run the backend:
```bash
mvn spring-boot:run
```
Backend starts at `http://localhost:8080`

---

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the dev server:
```bash
npm run dev
```
Frontend starts at `http://localhost:5173`

---

## 📁 Project Structure

```
graspify/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── panels/      # PanelContainer, YoutubePanel, NotesPanel, AiPanel, PdfPanel
│   │   │   ├── StudyTimer.jsx
│   │   │   └── UserProfile.jsx
│   │   ├── hooks/           # useAutoSave
│   │   ├── pages/           # Landing, Login, Signup, Dashboard, CanvasWorkspace, Tracker
│   │   └── store/           # Zustand stores (auth, canvas, panel, tracker)
│   ├── index.html
│   └── package.json
└── graspify-backend/
    ├── src/main/java/com/graspify/
    │   ├── config/          # Security config, CORS
    │   ├── controller/      # REST endpoints (Auth, Canvas, Panel, AI, StudySession)
    │   ├── model/           # JPA entities (User, Canvas, Panel, StudySession)
    │   ├── repository/      # Spring Data repositories
    │   ├── security/        # JWT filter & service
    │   └── service/--------- # Business logic + AI service
    └── src/main/resources/
        ├── application.properties
        └── db/migration/    # Flyway migrations
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/guest` | Guest login |
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/google` | Google OAuth |
| GET | `/api/auth/profile` | Get user profile |
| PUT | `/api/auth/profile` | Update user profile |
| POST | `/api/auth/profile/avatar` | Upload profile image |

### Canvases
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/canvases` | Get active canvases |
| POST | `/api/canvases` | Create canvas |
| GET | `/api/canvases/:id` | Get canvas by ID |
| PUT | `/api/canvases/:id` | Update canvas title |
| DELETE | `/api/canvases/:id` | Soft delete canvas |
| GET | `/api/canvases/deleted` | Get deleted canvases |
| POST | `/api/canvases/:id/restore` | Restore deleted canvas |
| DELETE | `/api/canvases/:id/permanent` | Permanently delete canvas |

### Panels
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/canvases/:id/panels` | Get panels for canvas |
| POST | `/api/canvases/:id/panels` | Create panel |
| PUT | `/api/panels/:id` | Update panel position/content |
| DELETE | `/api/panels/:id` | Delete panel |

### Study Sessions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/study-sessions/start` | Start study session |
| POST | `/api/study-sessions/end` | End study session |
| GET | `/api/study-sessions` | Get all sessions |
| GET | `/api/study-sessions/weekly` | Get weekly sessions |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/ask` | Ask AI a question with optional context |

---

## 🎯 Hackathon Highlights

This project was built for a hackathon with a focus on differentiating features:

1. **Highlight-to-Ask AI** — the ability to select any text on the canvas and get an instant AI explanation with a single click, without leaving your workflow.

2. **Study Session Tracking** — a global persistent timer that tracks study time across all pages with weekly analytics.

3. **User Profile Management** — customizable profiles with image upload and Google OAuth integration.

---

## 📸 Screenshots

> Canvas workspace with YouTube, Notes, AI and PDF panels side by side

---

## 👨‍💻 Authors

Built with ☕ and mild panic by **Siddharth**

---

## 📄 License

MIT License — feel free to use, modify and build on this project.
