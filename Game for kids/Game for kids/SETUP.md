# 🚀 Quick Setup Guide

Follow these steps to get the Kids Learning Platform running locally.

## Step 1: Install Prerequisites

### Node.js
Download and install from: https://nodejs.org/ (LTS version recommended)

Verify installation:
```bash
node --version  # Should show v18 or higher
npm --version   # Should show v9 or higher
```

### MongoDB Atlas (Cloud Database - Required for Hosting)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Get your connection string from the "Connect" button
4. Replace the `MONGODB_URI` in `backend/.env` with your Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
5. Make sure your IP address is whitelisted in Atlas (0.0.0.0/0 for development)

### MongoDB (Option B - Local Development Only)
Download from: https://www.mongodb.com/try/download/community

Start MongoDB:
```bash
# Windows (run as admin in PowerShell)
net start MongoDB

# Mac (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Ollama (Optional - for AI features)
Download from: https://ollama.ai/

```bash
# Pull a model
ollama pull llama2

# Verify it's running
ollama list
```

## Step 2: Clone/Navigate to Project

```bash
cd "C:\Users\kanik\OneDrive\Desktop\Game for kids"
```

## Step 3: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env

# Edit .env with your settings (use notepad .env)
```

## Step 4: Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env.local from example
copy .env.local.example .env.local
```

## Step 5: Start the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
Server running on: http://localhost:5000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

You should see:
```
Ready in 2.5s
Local: http://localhost:3000
```

## Step 6: Open the App

Open your browser and go to: **http://localhost:3000**

## 🎉 You're Done!

Enter a name and age to start learning!

## Common Issues

### "MongoDB connection error"
- Make sure MongoDB is running
- Check `MONGODB_URI` and `MONGODB_DB_NAME` in backend/.env

### "Port already in use"
- Change `PORT` in backend/.env to `5001`
- Change `NEXT_PUBLIC_API_URL` in frontend/.env.local to `http://localhost:5001`

### "Ollama not available"
- Install Ollama from ollama.ai
- Run: `ollama pull llama2`
- Or just use the built-in fallback questions

### "Module not found"
- Run `npm install` in both backend and frontend folders

## Testing the Features

1. **Login**: Enter a name (e.g., "Alex") and age (e.g., 7)
2. **Select a Game**: Choose Math, Letters, Image, or Rhyme
3. **Play**: Answer questions and earn points
4. **Progress**: Check the Progress page to see stats
5. **Parent Dashboard**: Go to Parent section (PIN: 1234)

## Screen Time Feature

After 45 minutes of play, a break modal will appear. To skip:
1. Click "Parent Override"
2. Enter PIN: `1234`
3. Continue playing

## 🚀 Hosting & Production Deployment

### Environment Variables for Production

#### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=kids-learning
MONGODB_SERVER_SELECTION_TIMEOUT_MS=10000

# Optional: Claude API for AI features
CLAUDE_API_KEY=your_claude_api_key_here

# Optional: Ollama (usually not available in production)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_APP_NAME=Kids Learning Platform
NEXT_PUBLIC_VERSION=1.0.0
```

### Hosting Platforms

**Recommended for Backend:**
- Railway
- Render
- Heroku
- DigitalOcean App Platform

**Recommended for Frontend:**
- Vercel
- Netlify
- Railway
- Render

**Recommended for Database:**
- MongoDB Atlas (already configured)

### Deployment Steps

1. **Set up MongoDB Atlas** (see Step 1 above)
2. **Deploy Backend** to your chosen platform
3. **Update Frontend** `NEXT_PUBLIC_API_URL` with backend URL
4. **Deploy Frontend** to your chosen platform
5. **Test** all features work in production

### Security Notes

- Never commit `.env` files to git
- Use environment variables in your hosting platform
- Keep database credentials secure
- Consider adding rate limiting for production

## Next Steps

- Customize colors in `frontend/tailwind.config.ts`
- Add more questions in `backend/src/services/question-generator.service.ts`
- Change screen time limit in `backend/src/services/screen-time.service.ts`
