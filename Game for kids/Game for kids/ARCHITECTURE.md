# 🏗️ Architecture & Component Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Game Pages                             │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  ImprovedGameSession (NEW)                         │  │   │
│  │  │  - Manages complete game flow                      │  │   │
│  │  │  - Handles scoring and streaks                     │  │   │
│  │  │  - Integrates all 3D components                    │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Game Components (NEW)                        │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  EnhancedGameDisplay                               │  │   │
│  │  │  - Combines 3D visuals                             │  │   │
│  │  │  - Shows feedback                                  │  │   │
│  │  │  - Triggers particle effects                       │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                ┌─────────────┼─────────────┐                     │
│                ▼             ▼             ▼                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           3D Components (NEW)                            │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │ Animated     │  │ Shape3D      │  │ Particle     │   │   │
│  │  │ Character3D  │  │              │  │ Effect       │   │   │
│  │  │              │  │ - Cube       │  │              │   │   │
│  │  │ - Happy      │  │ - Sphere     │  │ - Success    │   │   │
│  │  │ - Thinking   │  │ - Pyramid    │  │ - Error      │   │   │
│  │  │ - Celebrating│  │ - Cylinder   │  │ - Neutral    │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         Three.js Rendering Engine                        │   │
│  │  - WebGL Context                                         │   │
│  │  - GPU Acceleration                                      │   │
│  │  - Lighting & Materials                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    State Management                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  useReactiveGame Hook (NEW)                              │   │
│  │  - Question generation                                   │   │
│  │  - Answer submission                                     │   │
│  │  - Score tracking                                        │   │
│  │  - Error handling                                        │   │
│  │  - Feedback management                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Error Handling (NEW)                                    │   │
│  │  - lib/errors.ts                                         │   │
│  │  - Validation functions                                  │   │
│  │  - User-friendly messages                                │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Express)                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Error Handler Middleware (NEW)                          │   │
│  │  - utils/error-handler.ts                                │   │
│  │  - Consistent error responses                            │   │
│  │  - Input validation                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  API Routes                                              │   │
│  │  - /api/game/generate                                    │   │
│  │  - /api/game/submit                                      │   │
│  │  - /api/auth/*                                           │   │
│  │  - /api/user/*                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Database (MongoDB)                                      │   │
│  │  - User profiles                                         │   │
│  │  - Game sessions                                         │   │
│  │  - Progress tracking                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App
├── GamePage
│   └── ImprovedGameSession (NEW)
│       ├── Stats Display
│       │   ├── Score Card
│       │   ├── Streak Card
│       │   └── Question Counter
│       ├── Error Display
│       ├── EnhancedGameDisplay (NEW)
│       │   ├── AnimatedCharacter3D (NEW)
│       │   │   └── Three.js Canvas
│       │   │       ├── Character Mesh
│       │   │       ├── Lighting
│       │   │       └── Camera
│       │   ├── Shape3D (NEW)
│       │   │   └── Three.js Canvas
│       │   │       ├── Shape Mesh
│       │   │       ├── Lighting
│       │   │       └── Camera
│       │   └── Feedback Message
│       ├── Question Display
│       ├── Answer Options
│       ├── Feedback Message
│       └── ParticleEffect (NEW)
│           └── Three.js Canvas
│               ├── Particle System
│               ├── Physics
│               └── Lighting
└── Dashboard
    ├── User Stats
    ├── AnimatedCharacter3D (NEW)
    └── Progress Charts
```

## Data Flow

```
User Input
    │
    ▼
ImprovedGameSession
    │
    ├─► useReactiveGame Hook
    │   │
    │   ├─► generateQuestion()
    │   │   │
    │   │   ▼
    │   │   API: /api/game/generate
    │   │   │
    │   │   ▼
    │   │   Backend: Question Service
    │   │   │
    │   │   ▼
    │   │   MongoDB: Fetch Question
    │   │   │
    │   │   ▼
    │   │   Return Question
    │   │
    │   └─► submitAnswer()
    │       │
    │       ▼
    │       API: /api/game/submit
    │       │
    │       ▼
    │       Backend: Validation
    │       │
    │       ▼
    │       MongoDB: Update Score
    │       │
    │       ▼
    │       Return Result
    │
    ├─► Update State
    │   ├─► Score
    │   ├─► Streak
    │   ├─► Feedback
    │   └─► Question Number
    │
    └─► Render Components
        ├─► EnhancedGameDisplay
        │   ├─► AnimatedCharacter3D
        │   ├─► Shape3D
        │   └─► ParticleEffect
        └─► UI Components
```

## Error Handling Flow

```
User Action
    │
    ▼
Try Block
    │
    ├─► Success
    │   │
    │   ▼
    │   Update State
    │   │
    │   ▼
    │   Render Success
    │
    └─► Error
        │
        ▼
        Catch Block
        │
        ├─► GameError
        │   │
        │   ▼
        │   Get Error Message
        │   │
        │   ▼
        │   Show User-Friendly Message
        │
        ├─► Network Error
        │   │
        │   ▼
        │   Show Connection Error
        │
        └─► Unknown Error
            │
            ▼
            Show Generic Error
            │
            ▼
            Log to Console
```

## 3D Rendering Pipeline

```
Three.js Scene
    │
    ├─► Camera
    │   └─► PerspectiveCamera
    │       └─► Position: (0, 0, 3)
    │
    ├─► Lighting
    │   ├─► AmbientLight (0.8 intensity)
    │   └─► PointLight (1.0 intensity)
    │
    ├─► Objects
    │   ├─► Character Mesh
    │   │   ├─► Body (Box)
    │   │   ├─► Head (Sphere)
    │   │   ├─► Eyes (Spheres)
    │   │   ├─► Arms (Boxes)
    │   │   └─► Legs (Boxes)
    │   │
    │   ├─► Shape Mesh
    │   │   ├─► Cube (BoxGeometry)
    │   │   ├─► Sphere (SphereGeometry)
    │   │   ├─► Pyramid (ConeGeometry)
    │   │   └─► Cylinder (CylinderGeometry)
    │   │
    │   └─► Particles
    │       ├─► Position Buffer
    │       ├─► Velocity Buffer
    │       └─► Color Buffer
    │
    ├─► Materials
    │   ├─► MeshStandardMaterial
    │   └─► PointsMaterial
    │
    ├─► Animations
    │   ├─► useFrame Hook
    │   ├─► Rotation
    │   ├─► Position
    │   └─► Scale
    │
    └─► Renderer
        └─► WebGL Canvas
            └─► Display on Screen
```

## State Management

```
useReactiveGame Hook
    │
    ├─► State
    │   ├─► question: Question | null
    │   ├─► isLoading: boolean
    │   ├─► error: string | null
    │   ├─► score: number
    │   ├─► streak: number
    │   ├─► questionNumber: number
    │   └─► feedback: Feedback | null
    │
    ├─► Actions
    │   ├─► generateQuestion()
    │   ├─► submitAnswer()
    │   ├─► reset()
    │   ├─► clearError()
    │   └─► clearFeedback()
    │
    └─► Effects
        ├─► Cleanup AbortController
        └─► Prevent Memory Leaks
```

## File Dependencies

```
ImprovedGameSession.tsx
    │
    ├─► useReactiveGame.ts
    │   └─► lib/errors.ts
    │
    ├─► EnhancedGameDisplay.tsx
    │   ├─► AnimatedCharacter3D.tsx
    │   │   └─► three
    │   │   └─► @react-three/fiber
    │   │   └─► @react-three/drei
    │   │
    │   ├─► Shape3D.tsx
    │   │   └─► three
    │   │   └─► @react-three/fiber
    │   │   └─► @react-three/drei
    │   │
    │   └─► ParticleEffect.tsx
    │       └─► three
    │       └─► @react-three/fiber
    │
    ├─► Button.tsx
    ├─► framer-motion
    └─► react-hot-toast
```

## Performance Optimization

```
Rendering Pipeline
    │
    ├─► GPU Acceleration
    │   └─► WebGL Context
    │
    ├─► Particle Optimization
    │   ├─► BufferGeometry
    │   ├─► PointsMaterial
    │   └─► 100 Particles Max
    │
    ├─► Memory Management
    │   ├─► Cleanup on Unmount
    │   ├─► AbortController
    │   └─► No Memory Leaks
    │
    └─► Frame Rate
        └─► Target: 60 FPS
```

## Integration Points

```
Existing Code
    │
    ├─► Game Pages
    │   └─► Can use ImprovedGameSession
    │
    ├─► Dashboard
    │   └─► Can use AnimatedCharacter3D
    │
    ├─► Math Games
    │   └─► Can use Shape3D
    │
    ├─► Feedback System
    │   └─► Can use ParticleEffect
    │
    └─► Error Handling
        └─► Can use lib/errors.ts
```

## Deployment Architecture

```
Development
    │
    ├─► Frontend: npm run dev
    ├─► Backend: npm run dev
    └─► Database: MongoDB local
    
    │
    ▼
    
Staging
    │
    ├─► Frontend: npm run build
    ├─► Backend: npm run build
    └─► Database: MongoDB Atlas
    
    │
    ▼
    
Production
    │
    ├─► Frontend: Vercel/Netlify
    ├─► Backend: Heroku/AWS
    └─► Database: MongoDB Atlas
```

## Summary

The new architecture adds:
- **3D Graphics Layer** - Three.js rendering
- **Enhanced State Management** - useReactiveGame hook
- **Error Handling Layer** - Centralized error management
- **Particle System** - Visual feedback
- **Animation System** - Smooth transitions

All components are:
- ✅ Modular and reusable
- ✅ Well-documented
- ✅ Performance optimized
- ✅ Error handled
- ✅ Mobile responsive

---

**The architecture is clean, scalable, and ready for production!** 🚀
