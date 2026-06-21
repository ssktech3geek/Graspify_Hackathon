# 🎓 Graspify — AI-Powered Study Canvas

> Stop panicking. Start Graspifying.

Graspify is a full-stack web application that brings together everything a student needs in one intelligent workspace — YouTube videos, notes, PDFs, and an AI assistant — all on a single draggable, resizable canvas.

---

## ✨ Features

### 📋 Canvas System
- Create unlimited study canvases
- Soft delete with full restore history — nothing is ever permanently lost
- Inline title editing directly from the workspace
- Canvas persistence across sessions via PostgreSQL

### 🎨 Panel Workspace
- **YouTube Panel** — embed any YouTube video directly on your canvas
- **Notes Panel** — rich text notes with auto-save (debounced 800ms)
- **PDF Panel** — upload and read PDF files without leaving your canvas
- **AI Assistant Panel** — ask questions, get instant answers powered by Groq LLaMA

### 🤖 AI Features
- **Highlight-to-Ask** — select any text on the canvas and instantly ask AI to explain it
- **Context-aware AI** — AI reads your Notes panels for smarter, contextual answers
- Powered by **Groq's LLaMA 3.1 8B Instant** model for fast responses

### 💾 Auto-Save & Crash Recovery
- Panels auto-backup to localStorage every 30 seconds
- Crash recovery banner on reopen — restore unsaved changes instantly
- Save status indicator (✓ Saved / ⏳ Saving...)

### 🖼️ Canvas UX
- Freely **drag** panels anywhere on the canvas
- **Resize** panels from the bottom-right corner
- Dot grid background (Figma-style)
- New panels spawn at offset positions to avoid overlap

### 🔐 Authentication
- JWT-based authentication
- Guest login for instant access (no signup required)
- Secure token storage via Zustand + localStorage

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React + Vite | UI framework |
| Zustand | State management |
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
| JWT (JJWT) | Authentication |
| WebFlux WebClient | External API calls |
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

### Backend Setup

1. Clone the backend repo:
```bash
git clone https://github.com/YOUR_USERNAME/graspify-backend.git
cd graspify-backend
```

2. Create PostgreSQL database:
```sql
CREATE DATABASE graspify_db;
CREATE USER graspify_user WITH PASSWORD 'graspify123';
GRANT ALL PRIVILEGES ON DATABASE graspify_db TO graspify_user;
```

3. Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/graspify_db
spring.datasource.username=graspify_user
spring.datasource.password=graspify123
groq.api.key=YOUR_GROQ_API_KEY
gemini.api.key=YOUR_GEMINI_API_KEY
```

4. Run the backend:
```bash
mvn spring-boot:run
```
Backend starts at `http://localhost:8080`

---

### Frontend Setup

1. Clone the frontend repo:
```bash
git clone https://github.com/YOUR_USERNAME/graspify-frontend.git
cd graspify-frontend
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

### Backend
```
graspify-backend/
├── src/main/java/com/graspify/
│   ├── config/          # Security config, CORS
│   ├── controller/      # REST endpoints
│   ├── model/           # JPA entities (User, Canvas, Panel)
│   ├── repository/      # Spring Data repositories
│   ├── security/        # JWT filter & service
│   └── service/         # Business logic + AI service
└── src/main/resources/
    └── application.properties
```

### Frontend
```
graspify-frontend/
├── src/
│   ├── components/
│   │   └── panels/      # PanelContainer, YoutubePanel, NotesPanel, AiPanel, PdfPanel
│   ├── hooks/           # useAutoSave
│   ├── pages/           # Login, Dashboard, CanvasWorkspace
│   └── store/           # Zustand stores (auth, canvas, panel)
└── index.html
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/guest` | Guest login |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |

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

### Panels
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/canvases/:id/panels` | Get panels for canvas |
| POST | `/api/canvases/:id/panels` | Create panel |
| PUT | `/api/panels/:id` | Update panel position/content |
| DELETE | `/api/panels/:id` | Delete panel |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/ask` | Ask AI a question with optional context |

---

## 🎯 Hackathon Highlights

This project was built for a hackathon with a focus on two differentiating features:

1. **Highlight-to-Ask AI** — the ability to select any text on the canvas and get an instant AI explanation with a single click, without leaving your workflow.

2. **Auto-save + Crash Recovery** — a localStorage-backed backup system that saves your canvas state every 30 seconds and offers a one-click restore if the browser crashes.

---

## 📸 Screenshots

> Canvas workspace with YouTube, Notes, AI and PDF panels side by side

---

## 👨‍💻 Author

Built with ☕ and mild panic by **Siddharth**

---

## 📄 License

MIT License — feel free to use, modify and build on this project.
