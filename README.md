# 🍽️ Chaat Corner Restaurant - Frontend

- A modern, responsive React-based reservation management system with Voice AI (Retell AI) to reserve table in Restaurant using UI or using Voice call which is answered by Voice AI. 
- Features real-time dashboard, reservation management, and seamless integration with the backend API.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.0-38B2AC)
---

## ✨ Features

### Dashboard & Management
- 📊 **Real-time Dashboard** - Today's reservations and key statistics with All reservations
- 📅 **Reservation Management** - Create, edit, and cancel reservations with ease
- 🔍 **Advanced Search & Filtering** - Search by name, phone, or reservation ID; filter by date and status
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices

### For Customers
- 🎙️ **Voice Reservations** - Call to book via AI phone agent (optional)
- 📧 **Calendar Integration** - Automatic Google Calendar events
- ✉️ **Confirmations** - Instant reservation confirmations

### Technical Features
- ⏰ **Timezone Handling** - All times displayed in Pacific Time (PT)

---

## 🛠️ Technology Stack

### Core Framework
- **React** `18.2.0` - UI library for building interactive interfaces
- **React DOM** `18.2.0` - React rendering for web browsers
- **React Scripts** `5.0.1` - Create React App build tooling

### Styling & UI
- **Tailwind CSS** `3.3.0` - Utility-first CSS framework
- **PostCSS** `8.4.24` - CSS transformation tool
- **Autoprefixer** `10.4.14` - Automatic vendor prefix addition
- **Lucide React Icons** `0.263.1` - Beautiful icon library

### Development Tools
- **@testing-library/react** `13.4.0` - Testing utilities for React
- **@testing-library/jest-dom** `5.16.5` - Custom Jest matchers for DOM
- **@testing-library/user-event** `14.4.3` - User interaction simulation
- **Web Vitals** `3.0.0` - Performance monitoring

### Build Requirements
- **Node.js** `≥18.0.0`
- **npm** `≥9.0.0`

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js 18+**
   ```bash
   # Check Node.js version
   node --version
   # Should output: v18.x.x or higher
   ```
   Download: [https://nodejs.org](https://nodejs.org)

2. **npm 9+**
   ```bash
   # Check npm version
   npm --version
   # Should output: 9.x.x or higher
   ```

3. **Backend API Running**
   - The backend must be running before starting the frontend
   - Default backend URL: `http://localhost:3001`
   - See [Backend README](../restaurant-backend/README.md) for setup instructions

### Installation

1. **Clone the repository** (if not already done)
   ```bash
   git clone <repository-url>
   cd restaurant-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example environment file
   cp .env.local.example .env.local
   
   # Edit .env.local with your settings
   nano .env.local  # or use your preferred editor
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   ```
   Navigate to: http://localhost:3000
   ```

The application will automatically reload when you make changes to the code.

---

## ⚙️ Environment Variables

### Local Development (.env.local)

Create a `.env.local` file in the `restaurant-frontend` folder with the following variables:

```bash
# ==================== REQUIRED VARIABLES ====================

# Backend API URL (where your backend is running)
REACT_APP_API_URL=http://localhost:3001

# API Key (MUST match the API_KEY in backend .env file)
REACT_APP_API_KEY=dev-local-api-key-12345

# Restaurant phone number (displayed in header)
REACT_APP_RESERVATION_PHONE=+1(xxx)xxx-xxx
```

**Important Notes:**
- Variable names MUST start with `REACT_APP_` (React requirement)
- Do NOT add trailing slash to API_URL: ✅ `http://localhost:3001` ❌ `http://localhost:3001/`
- API key must match backend exactly (case-sensitive)
- Restart the frontend after changing `.env.local`
- Never commit `.env.local` to git

### Production Environment (Vercel)

Set these environment variables in your Vercel dashboard:

```bash
# ==================== PRODUCTION VARIABLES ====================

# Backend API URL (your deployed backend on Railway or any other platform)
REACT_APP_API_URL=https://your-backend.railway.com

# Production API Key (different from development: MUST match the API_KEY in backend .env file)
REACT_APP_API_KEY=production-secure-32-char-key-here

# Restaurant phone number
REACT_APP_RESERVATION_PHONE=+1(667)327-1604
```

**Production Requirements:**
- Use HTTPS for API_URL (not HTTP)
- Use a strong, unique API key (32+ characters)
- Different API key than development
- Generate secure key: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Use the same API Key in both frontend and backend 

### Environment Variable Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REACT_APP_API_URL` | Yes | `http://localhost:3001` | Backend API base URL |
| `REACT_APP_API_KEY` | Yes | None | API authentication key |
| `REACT_APP_RESERVATION_PHONE` | No | `+1(667)327-1604` | Phone number shown in header |

---

## 🧪 Testing

### Local Testing

#### 1. Start Backend First
```bash
# In a separate terminal
cd restaurant-backend
npm run start:dev

# Verify backend is running
curl http://localhost:3001/health
# Should return: {"status":"ok","timestamp":"..."}
```

#### 2. Start Frontend
```bash
cd restaurant-frontend
npm start
```

#### 3. Verify Configuration
1. Open browser to `http://localhost:3000`
2. Open DevTools (F12) → Console tab
3. Look for configuration log:
   ```
   🔧 Application Configuration:
     API URL: http://localhost:3001
     API Key: ✅ Set
     Phone: +1(667)327-1604
     Environment: development
   ```

#### 4. Test Core Features

**Dashboard:**
- [ ] Statistics cards load (Today's Reservations, Total, Cancelled)
- [ ] "Today's Schedule" section displays reservations
- [ ] All data loads without errors in console

**Create Reservation via Call:**
- [ ] Dial phone number shown on website to make reservation. Example : Dial 1(667)327-1604
- [ ] AI answers the call and ask for reservation details
- [ ] Provide details for Reservation : name, phone number, party size(number of guests), reservation date and time
- [ ] New reservation should be confirmed on call
- [ ] New reservation appears in dashboard
- [ ] New reservation appears in Google Calendar for Restaurant
- 
**Create Reservation:**
- [ ] Click "New Reservation" button
- [ ] Fill in all required fields (Name, Phone, Date)
- [ ] Select party size, time, and add special requests
- [ ] Submit successfully
- [ ] New reservation appears in dashboard
- [ ] New reservation appears in Google Calendar for Restaurant

**Edit Reservation:**
- [ ] Click edit icon on a confirmed reservation
- [ ] Modify fields (time, party size, etc.)
- [ ] Save changes successfully
- [ ] Changes reflected immediately

**Cancel Reservation:**
- [ ] Click delete icon on a confirmed reservation
- [ ] Confirm cancellation in dialog
- [ ] Reservation status changes to "cancelled"
- [ ] Statistics update correctly

**Search & Filter:**
- [ ] Switch to "All Reservations" tab
- [ ] Search by name, phone, or reservation ID
- [ ] Filter by date
- [ ] Filter by status (confirmed, cancelled, completed)
- [ ] Results update correctly

**Network Status:**
- [ ] Disable network (DevTools → Network → Offline)
- [ ] Yellow offline banner appears
- [ ] Buttons become disabled
- [ ] Re-enable network
- [ ] Green "connection restored" message
- [ ] Functionality restored

#### 5. Check Browser Console

No errors should appear in the console. Look for:
- ✅ Successful API requests (green checkmarks)
- ✅ Configuration loaded correctly
- ❌ No CORS errors
- ❌ No 401 Unauthorized errors
- ❌ No network errors

### Production Testing

After deploying to Vercel, test the live application:

#### 1. Verify Deployment
```bash
# Check backend health
curl https://your-backend.railway.com/health

# Should return: {"status":"ok",...}
```

#### 2. Test Live Frontend

Visit your Vercel URL: `https://your-frontend.vercel.app`

**Configuration Check:**
1. Open DevTools Console
2. Should NOT see localhost in API URL
3. Should see production API URL with HTTPS

**Functionality Check:**
- [ ] Dashboard loads with real data
- [ ] Can create new reservations
- [ ] Can edit existing reservations
- [ ] Can cancel reservations
- [ ] Search and filters work
- [ ] No console errors

**Performance Check:**
- [ ] Page loads in < 3 seconds
- [ ] Smooth transitions and animations
- [ ] Responsive on mobile devices
- [ ] No layout shifts

#### 3. Cross-Browser Testing

Test on multiple browsers:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

#### 4. Mobile Testing

Test responsive design:
- [ ] Layout adapts to small screens
- [ ] Touch targets are large enough (44×44px minimum)
- [ ] Modal dialogs fit on screen
- [ ] Forms are easy to fill on mobile
- [ ] No horizontal scrolling

### Running Automated Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- App.test.js
```

### Common Testing Issues

**Issue: "401 Unauthorized" on all requests**
- ✅ Check API keys match between frontend and backend
- ✅ Verify `REACT_APP_API_KEY` is set correctly
- ✅ Restart frontend after changing `.env.local`

**Issue: "CORS error" in console**
- ✅ Check backend `FRONTEND_URL` matches frontend domain exactly
- ✅ Restart backend after changing environment variables
- ✅ Check backend CORS configuration allows your origin

**Issue: "Network error" message**
- ✅ Verify backend is running (`curl http://localhost:3001/health`)
- ✅ Check `REACT_APP_API_URL` is correct
- ✅ Check firewall isn't blocking port 3001

**Issue: Configuration not loading**
- ✅ File named `.env.local` (with the dot)
- ✅ File in `restaurant-frontend` folder (same level as `package.json`)
- ✅ Variables start with `REACT_APP_`
- ✅ Restart frontend after creating file
- ✅ Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)

---

## 🚀 Deployment

### Prerequisites for Deployment

1. **Backend Deployed** - Deploy backend first (see [Backend README](../restaurant-backend/README.md))
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Git Repository** - Code pushed to GitHub/GitLab/Bitbucket

### Deploy to Vercel (Free Tier)

#### Option 1: Vercel Dashboard (Recommended)

1. **Push code to Git**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your Git repository
   - Choose `restaurant-frontend` folder as root directory

3. **Configure Build Settings**
   ```
   Framework Preset: Create React App
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

4. **Add Environment Variables**
   
   In Vercel dashboard → Settings → Environment Variables:
   
   | Name | Value |
   |------|-------|
   | `REACT_APP_API_URL` | `https://your-backend.railway.com` |
   | `REACT_APP_API_KEY` | `your-production-api-key` |
   | `REACT_APP_RESERVATION_PHONE` | `+1(667)327-1604` |
   
   **Important:**
   - Use HTTPS for API_URL (not HTTP)
   - Use production API key (different from development)
   - No trailing slash in API_URL

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Visit your deployment URL

#### Option 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd restaurant-frontend
   vercel
   ```

4. **Add Environment Variables**
   ```bash
   vercel env add REACT_APP_API_URL production
   # Enter: https://your-backend.railway.com
   
   vercel env add REACT_APP_API_KEY production
   # Enter: your-production-api-key
   
   vercel env add REACT_APP_RESERVATION_PHONE production
   # Enter: +1(667)327-1604
   ```

5. **Redeploy with Environment Variables**
   ```bash
   vercel --prod
   ```

### Post-Deployment Checklist

After deploying, verify everything works:

- [ ] Visit Vercel URL (e.g., `https://your-app.vercel.app`)
- [ ] Dashboard loads without errors
- [ ] Open DevTools Console:
  - [ ] No errors in console
  - [ ] API URL shows production backend (HTTPS)
  - [ ] No localhost references
- [ ] Test creating a reservation via Calling on Restaurant Number
- [ ] Test creating a reservation via Dashboard
- [ ] Test editing a reservation
- [ ] Test canceling a reservation
- [ ] Check MongoDB Atlas for new data
- [ ] Test on mobile device
- [ ] Test in different browsers

### Continuous Deployment

Vercel automatically redeploys when you push to Git:

```bash
# Make changes to code
git add .
git commit -m "Update feature X"
git push origin main

# Vercel automatically detects push and redeploys
```

### Custom Domain (Optional)

1. Go to Vercel dashboard → Settings → Domains
2. Add your custom domain (e.g., `reservations.chaatcorner.com`)
3. Update DNS records as instructed by Vercel
4. SSL certificate automatically provisioned

### Rollback Deployment

If something goes wrong:

1. Go to Vercel dashboard → Deployments
2. Find previous working deployment
3. Click "...
