# 🎓 Kids Learning Platform

A gamified, AI-powered learning platform for kids ages 5-10. Built with Next.js, Express, MongoDB, and AI integration (Ollama + Claude).

![Kids Learning](https://img.shields.io/badge/Kids-Learning-FF6B6B?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-8-green?style=for-the-badge&logo=mongodb)

## ✨ Features

### 🎮 Educational Games
- **Math Magic** - Dynamic math problems with adaptive difficulty
- **Letter Land** - Missing letters word puzzles
- **Picture Puzzle** - Image recognition games
- **Rhyme Time** - Rhyming word challenges

### 🤖 AI-Powered
- **Adaptive Learning** - Difficulty adjusts based on performance
- **Smart Question Generation** - Ollama (local) + Claude API (fallback)
- **Personalized Experience** - Tracks accuracy, response time, and mistakes

### 👨‍👩‍👧‍👦 Parent Features
- **Screen Time Control** - 45-minute limit with enforced breaks
- **Progress Dashboard** - Track learning across subjects
- **Parent PIN** - Override breaks when needed
- **Multiple Kids Support** - Manage profiles for different children

### 🏆 Gamification
- **Points System** - Earn points for correct answers
- **Level Progression** - Level up as you learn
- **Badges & Achievements** - Unlock rewards
- **Streak Tracking** - Maintain learning streaks

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│  React 18 | Tailwind CSS | Framer Motion | Zustand      │
└─────────────────────────────────────────────────────────┘
                          │ REST API
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Backend (Express)                     │
│  Node.js | TypeScript | Mongoose | Helmet | CORS        │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
   ┌────────┐      ┌────────┐       ┌──────────┐
   │ Ollama │      │ Claude │       │ MongoDB  │
   │  (AI)  │      │  (AI)  │       │ (Database)│
   └────────┘      └────────┘       └──────────┘
```

## 📁 Project Structure

```
game-for-kids/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth & screen time middleware
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── services/       # AI & business logic
│   │   ├── types/          # TypeScript types
│   │   └── server.ts       # Express entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js pages
│   │   ├── components/     # React components
│   │   │   ├── ui/         # Base UI components
│   │   │   ├── game/       # Game-specific components
│   │   │   └── layout/     # Layout components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilities & API client
│   │   ├── styles/         # Global styles
│   │   └── types/          # TypeScript types
│   ├── package.json
│   └── next.config.js
│
├── .env.example
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB** 6+ ([Download](https://www.mongodb.com/try/download/community)) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Ollama** (optional, for local AI) ([Download](https://ollama.ai/))

### 1. Clone the Repository

```bash
cd "Game for kids"
```

### 2. Setup Backend

```bash
cd backend
npm install

# Create .env file
copy ..\.env.example .\.env
# Edit .env with your configuration
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install

# Create .env.local file
copy ..\.env.example .\.env.local
# Edit .env.local with your configuration
```

### 4. Start MongoDB

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

### 5. Start Ollama (Optional)

```bash
# Install a model
ollama pull llama2

# Start Ollama service
ollama serve
```

### 6. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 7. Open the App

Visit [http://localhost:3000](http://localhost:3000) in your browser!

## 📖 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login/create user |
| GET | `/api/auth/profile/:userId` | Get user profile |
| POST | `/api/auth/stats/:userId` | Update user stats |

### Game
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/game/generate?gameType=math&difficulty=easy` | Generate question |
| POST | `/api/game/session/start` | Start game session |
| POST | `/api/game/submit` | Submit answer |
| POST | `/api/game/session/:sessionId/end` | End session |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/progress/:userId` | Get progress |
| POST | `/api/user/progress` | Update progress |
| GET | `/api/user/leaderboard` | Get leaderboard |

### Screen Time
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/screentime/status/:userId` | Get screen time status |
| POST | `/api/screentime/start/:userId` | Start session |
| POST | `/api/screentime/break/:sessionId` | Start break |
| POST | `/api/screentime/skip-break/:sessionId` | Skip break (PIN) |

## 🎨 Customization

### Colors
Edit `frontend/tailwind.config.ts` to customize the color scheme:

```typescript
colors: {
  primary: { DEFAULT: '#FF6B6B' },  // Coral red
  secondary: { DEFAULT: '#4ECDC4' }, // Turquoise
  accent: { DEFAULT: '#FFE66D' },    // Yellow
}
```

### Screen Time Limit
Edit `backend/src/services/screen-time.service.ts`:

```typescript
private static readonly SCREEN_TIME_LIMIT = 45 * 60; // 45 minutes
```

### Parent PIN
Edit `.env`:

```
PARENT_PIN=1234
```

## 🧪 Testing

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev

# Test API with curl
curl http://localhost:5000/health
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `MONGODB_URI` | MongoDB server or cluster connection string | `mongodb://localhost:27017` |
| `MONGODB_DB_NAME` | MongoDB database name | `kids-learning` |
| `MONGODB_SERVER_SELECTION_TIMEOUT_MS` | MongoDB connection timeout | `5000` |
| `OLLAMA_BASE_URL` | Ollama API endpoint | `http://localhost:11434` |
| `OLLAMA_MODEL` | Ollama model to use | `llama2` |
| `CLAUDE_API_KEY` | Anthropic API key | - |
| `NEXT_PUBLIC_API_URL` | Frontend API URL | `http://localhost:5000` |
| `PARENT_PIN` | Parent override PIN | `1234` |

## 🔒 Security Notes

- Simple username authentication (no passwords) - appropriate for kids' app
- Parent PIN protection for sensitive settings
- CORS enabled for frontend-backend communication
- Helmet.js for security headers
- Rate limiting on API endpoints

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: Failed to connect to MongoDB
```
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`

### Ollama Not Available
```
Warning: Ollama failed, falling back to built-in questions
```
- Install Ollama: `ollama.ai`
- Pull a model: `ollama pull llama2`
- Or set up Claude API key

### Port Already in Use
```
Error: Port 5000 is already in use
```
- Change `PORT` in backend `.env`
- Update `NEXT_PUBLIC_API_URL` in frontend

## 📄 License

MIT License - feel free to use for educational purposes!

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai/) for local AI
- [Anthropic](https://anthropic.com/) for Claude API
- [Next.js](https://nextjs.org/) for the framework
- [MongoDB](https://mongodb.com/) for the database

---

Made with ❤️ for curious minds everywhere! 🌟
