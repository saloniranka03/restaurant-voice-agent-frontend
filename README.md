# 🍽️ Chaat Corner Restaurant - Reservation Management System

A complete, production-ready restaurant reservation system with voice AI integration, Google Calendar sync, and modern web interface.

![System Status](https://img.shields.io/badge/status-production--ready-brightgreen)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 🌟 Features

### For Restaurant Staff
- 📊 **Real-time Dashboard** - Today's reservations at a glance
- 📅 **Reservation Management** - Create, edit, cancel with ease
- 🔍 **Advanced Search** - Filter by date, status, customer
- 📱 **Responsive Design** - Works on desktop, tablet, mobile
- 🎨 **Beautiful UI** - Modern design with Tailwind CSS

### For Customers
- 🎙️ **Voice Reservations** - Call to book via AI phone agent (optional)
- 📧 **Calendar Integration** - Automatic Google Calendar events
- ✉️ **Confirmations** - Instant reservation confirmations

### Technical Features
- 🔐 **API Authentication** - Secure with API key protection
- 🚦 **Rate Limiting** - Prevent abuse (100 req/15min)
- 🗄️ **MongoDB Database** - Scalable document storage
- 📊 **Structured Logging** - Professional debugging
- 🏥 **Health Monitoring** - Built-in health check endpoint
- 🌐 **Production Ready** - Deploy to Render + Vercel (free tier!)

---
### Technology Stack

**Frontend:**
- React 19 - UI library
- Tailwind CSS - Styling
- Lucide React - Icons
- Fetch API - HTTP requests

**Hosting (Free Tier):**
- Vercel - Frontend hosting
- MongoDB Atlas - Database hosting

---

## 📁 Project Structure

```
chaat-corner-reservation/
├── restaurant-backend/          # NestJS API backend
│   ├── src/
│   │   ├── auth/               # Authentication guard
│   │   ├── calendar/           # Google Calendar integration
│   │   ├── reservation/        # Reservation management
│   │   ├── retell/            # Voice AI integration
│   │   └── utils/             # Logging utilities
│   ├── .env.example           # Environment template
│   ├── QUICK_SETUP.md         # 10-minute setup guide
│   └── README.md              # Backend documentation
│
├── restaurant-frontend/         # React web interface
│   ├── src/
│   │   ├── services/          # API service layer
│   │   ├── config.js          # Environment configuration
│   │   └── App.js             # Main application
│   ├── .env.local.example     # Environment template
│   └── README.md              # Frontend documentation
│
├── QUICK_SETUP.md              # Quick local setup guide
├── DEPLOYMENT.md               # Production deployment guide
└── README.md                   # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ ([download](https://nodejs.org))
- npm 9+
- MongoDB Atlas account (free tier)

### Option 1: Follow the Quick Setup Guide (Recommended)

**👉 [QUICK_SETUP.md](./restaurant-backend/QUICK_SETUP.md)** - Complete setup in 10 minutes!

### Option 2: Manual Setup

#### 1. Clone Repository
```bash
git clone <repository-url>
cd chaat-corner-reservation
```

#### 2. Setup Backend
```bash
cd restaurant-backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and API key
npm run start:dev
```

#### 3. Setup Frontend (new terminal)
```bash
cd restaurant-frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with backend URL and API key
npm start
```

#### 4. Open Browser
Navigate to http://localhost:3000

---

## 📖 Documentation

### Setup & Configuration
- **[Quick Setup Guide](./restaurant-backend/QUICK_SETUP.md)** - Get started in 10 minutes
- **[Backend README](./restaurant-backend/README.md)** - Detailed backend documentation
- **[Frontend README](./restaurant-frontend/README.md)** - Frontend documentation
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment instructions

### Environment Variables
- **[Backend .env Example](./restaurant-backend/.env.example)** - Backend configuration
- **[Frontend .env Example](./restaurant-frontend/.env.local.example)** - Frontend configuration

---

## 🏗️ Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │────────▶│   Frontend   │────────▶│   Backend   │
│  (React)    │  HTTPS  │   (Vercel)   │   API   │  (Render)   │
└─────────────┘         └──────────────┘         └─────────────┘
                                                        │
                                                        ▼
                                              ┌──────────────────┐
                                              │  MongoDB Atlas   │
                                              │   (Database)     │
                                              └──────────────────┘
                                                        │
                        ┌───────────────────────────────┼────────────────┐
                        ▼                               ▼                ▼
                ┌──────────────┐              ┌──────────────┐  ┌──────────────┐
                │   Google     │              │  Retell AI   │  │  UptimeRobot │
                │   Calendar   │              │   (Voice)    │  │ (Monitoring) │
                └──────────────┘              └──────────────┘  └──────────────┘
```

### Technology Stack

**Backend:**
- NestJS - Node.js framework
- MongoDB - NoSQL database
- Mongoose - ODM for MongoDB
- Google Calendar API - Calendar integration
- Retell AI - Voice reservations (optional)
- Helmet - Security headers
- Express Rate Limit - API protection

**Frontend:**
- React 19 - UI library
- Tailwind CSS - Styling
- Lucide React - Icons
- Fetch API - HTTP requests

**Hosting (Free Tier):**
- Render.com - Backend hosting
- Vercel - Frontend hosting
- MongoDB Atlas - Database hosting

---

## 🔐 Security Features

### Authentication
- ✅ API key authentication on all endpoints
- ✅ Separate keys for development and production
- ✅ Environment variable configuration

### Protection
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Helmet security headers (XSS, clickjacking protection)
- ✅ CORS configuration (whitelist allowed origins)
- ✅ Input validation on all endpoints

### Best Practices
- ✅ No sensitive data in git repository
- ✅ Separate development and production configs
- ✅ Structured logging for audit trails
- ✅ Health check endpoint for monitoring

---

## 🧪 Testing

### Local Testing

**Backend:**
```bash
cd restaurant-backend

# Test health check (no auth)
curl http://localhost:3001/health

# Test authenticated endpoint
curl -H "X-API-Key: your-api-key" \
  http://localhost:3001/reservations/stats
```

**Frontend:**
1. Open http://localhost:3000
2. Create test reservation
3. Verify in dashboard
4. Check MongoDB Atlas for data

### Production Testing

After deployment:
```bash
# Test backend health
curl https://your-backend.onrender.com/health

# Test frontend
open https://your-frontend.vercel.app
```

---

## 🚀 Deployment

### Quick Deployment (Free Tier)

**👉 [DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide

**Summary:**
1. Deploy backend to Render.com (free tier)
2. Deploy frontend to Vercel (free tier)
3. Use MongoDB Atlas (free tier)
4. Update environment variables
5. Test production deployment

**Total Cost:** $0/month (free tier)

### Production Checklist

- [ ] MongoDB Atlas cluster created
- [ ] API key generated (32+ characters)
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] Google Calendar configured (optional)
- [ ] Retell AI webhook updated (optional)
- [ ] Health check endpoint working
- [ ] Test reservation creation
- [ ] Monitoring setup (UptimeRobot)

---

## 📊 API Endpoints

### Public Endpoints (No Authentication)
- `GET /` - API information
- `GET /health` - Health check

### Protected Endpoints (Require X-API-Key header)
- `GET /reservations` - List all reservations
- `GET /reservations/today` - Today's reservations
- `GET /reservations/stats` - Dashboard statistics
- `GET /reservations/:id` - Get single reservation
- `POST /reservations` - Create reservation
- `PATCH /reservations/:id` - Update reservation
- `DELETE /reservations/:id` - Cancel reservation
- `GET /reservations/check-availability` - Check table availability

### Webhook Endpoints
- `POST /retell/webhook` - Retell AI voice agent webhook

**Full API documentation:** See [Backend README](./restaurant-backend/README.md)

---

## 🎙️ Voice Integration (Optional)

Enable phone reservations with Retell AI:

1. Sign up at https://retell.ai
2. Create voice agent
3. Configure webhook: `https://your-backend.onrender.com/retell/webhook`
4. Add credentials to backend environment variables
5. Test by calling your Retell phone number

**Features:**
- Natural conversation flow
- Collects all reservation details
- Automatic data extraction from transcript
- 3-layer fallback system for reliability
- Handles various speech patterns

---

## 📅 Google Calendar Integration (Optional)

Sync reservations with Google Calendar:

1. Create Google Cloud project
2. Enable Google Calendar API
3. Create service account
4. Download credentials JSON
5. Share calendar with service account email
6. Add credentials to backend environment variables

**Features:**
- Automatic event creation
- 2-hour reservation blocks