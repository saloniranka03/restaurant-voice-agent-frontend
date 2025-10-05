# Chaat Corner Restaurant - Frontend Dashboard

Beautiful, modern, and responsive reservation management dashboard built with React and Tailwind CSS for restaurant staff to manage bookings efficiently.

---

## 🚀 Features

- **📊 Dashboard View** - Today's reservations at a glance with real-time statistics
- **📋 All Reservations** - Complete reservation list with advanced filtering
- **➕ Create Reservations** - Easy-to-use form with validation
- **✏️ Edit Reservations** - Modify existing bookings seamlessly
- **❌ Cancel Reservations** - Cancel with confirmation dialog
- **🔍 Search & Filter** - Find reservations by name, phone, ID, date, or status
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **🎨 Beautiful UI** - Modern design with Tailwind CSS and gradient accents
- **⚡ Real-time Updates** - Instant synchronization with backend API
- **🎯 Smart Special Requests** - Predefined options plus custom requests

---

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** 18+ installed
- **npm** or **yarn** package manager
- **Backend API** running on `http://localhost:3001`

---

## 🛠️ Installation

```bash
# Clone the repository
git clone <repository-url>
cd restaurant-frontend

# Install dependencies
npm install

# Or with yarn
yarn install
```

---

## ⚙️ Configuration

### Backend API URL

Update the API URL in `src/App.js` if your backend is running on a different port:

```javascript
const API_URL = "http://localhost:3001"; // Change to your backend URL
```

### Environment Variables (Optional)

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3001
```

Then update `src/App.js`:
```javascript
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
```

---

## 🏃 Running the Application

### Development Mode
```bash
npm start

# Or with yarn
yarn start
```

The app will automatically open at `http://localhost:3000`

**Features in Development Mode:**
- Hot module replacement (auto-refresh on save)
- Error overlay in browser
- React DevTools support
- Source maps for debugging

### Production Build
```bash
# Create optimized production build
npm run build

# Or with yarn
yarn build
```

**Build output:**
- Optimized bundle in `build/` directory
- Minified JavaScript and CSS
- Asset optimization and compression
- Ready for deployment

### Serve Production Build Locally
```bash
# Install serve globally
npm install -g serve

# Serve the build folder
serve -s build -l 3000
```

---

## 📁 Project Structure

```
src/
├── App.js                  # Main application component
│   ├── ReservationDashboard    # Main container
│   ├── StatCard                # Statistics display
│   ├── ReservationCard         # Individual reservation
│   ├── ReservationForm         # Create/edit form
│   └── Modal                   # Modal wrapper
├── App.test.js             # Component tests
├── index.js                # Application entry point
├── index.css               # Global styles with Tailwind
├── reportWebVitals.js      # Performance monitoring
└── setupTests.js           # Test configuration

public/
├── index.html              # HTML template
├── favicon.ico             # Favicon
├── manifest.json           # PWA manifest
└── robots.txt              # SEO robots file

Configuration Files:
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── .gitignore              # Git ignore rules
```

---

## 🎨 Components

### Main Components

#### **ReservationDashboard**
Main application container that manages all state and API interactions.

**State Management:**
- Reservations data
- Today's reservations
- Dashboard statistics
- UI state (modals, loading, filters)

**Key Functions:**
- `fetchStats()` - Get dashboard statistics
- `fetchTodayReservations()` - Get today's bookings
- `fetchAllReservations()` - Get all reservations with filters
- `handleCreateReservation()` - Create new booking
- `handleUpdateReservation()` - Update existing booking
- `handleCancelReservation()` - Cancel booking

#### **StatCard**
Displays individual statistics with icons.

**Props:**
- `title` - Statistic title
- `value` - Numeric value
- `icon` - Icon component
- `color` - Theme color (blue, green, red)

#### **ReservationCard**
Shows detailed reservation information.

**Props:**
- `reservation` - Reservation object
- `onEdit` - Edit callback
- `onCancel` - Cancel callback

**Displays:**
- Customer name and status badge
- Phone number and party size
- Reservation time and table number
- Special requests (if any)
- Reservation ID

#### **ReservationForm**
Form for creating or editing reservations.

**Props:**
- `reservation` - Existing reservation (for edit mode)
- `onSubmit` - Submit callback
- `onCancel` - Cancel callback

**Features:**
- Input validation
- Date picker (prevents past dates)
- Time slot dropdown
- Party size selector (1-12 guests)
- Special requests buttons
- Custom request input

**Predefined Special Requests:**
- Window seat
- High chair
- Birthday celebration
- Anniversary
- Vegetarian options
- Gluten-free options
- Wheelchair accessible
- Quiet area
- Outdoor seating

#### **Modal**
Reusable modal wrapper component.

**Props:**
- `children` - Modal content
- `onClose` - Close callback
- `title` - Modal title

**Features:**
- Semi-transparent backdrop
- Sticky header when scrolling
- Close button
- Max height (90vh) with scroll

---

## 🔌 API Integration

The frontend communicates with the backend via REST API:

### Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/reservations/stats` | Dashboard statistics |
| GET | `/reservations/today` | Today's reservations |
| GET | `/reservations` | All reservations (with filters) |
| GET | `/reservations/:id` | Single reservation |
| POST | `/reservations` | Create reservation |
| PATCH | `/reservations/:id` | Update reservation |
| DELETE | `/reservations/:id` | Cancel reservation |

### Request/Response Examples

#### Create Reservation
```javascript
// Request
POST http://localhost:3001/reservations
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "+15551234567",
  "email": "john@example.com",
  "partySize": 4,
  "date": "2024-12-25",
  "time": "7:00 PM",
  "specialRequests": ["Window seat"]
}

// Response
{
  "_id": "abc123...",
  "name": "John Doe",
  "phone": "+15551234567",
  "email": "john@example.com",
  "partySize": 4,
  "date": "2024-12-25T00:00:00.000Z",
  "time": "7:00 PM",
  "tableNumber": 5,
  "specialRequests": ["Window seat"],
  "status": "confirmed",
  "reservationId": "RES-1234567890-ABC123",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### Get Statistics
```javascript
// Request
GET http://localhost:3001/reservations/stats

// Response
{
  "todayReservations": 12,
  "totalReservations": 150,
  "cancelledToday": 2
}
```

---

## 🎨 Styling with Tailwind CSS

### Tailwind Configuration

The app uses Tailwind CSS utility classes exclusively. Configuration in `tailwind.config.js`:

```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Custom theme extensions here
    },
  },
  plugins: [],
};
```

### Key Design Elements

**Color Palette:**
- Primary: Amber/Orange gradient (`from-amber-500 to-orange-500`)
- Success: Green (`green-500`)
- Error: Red (`red-500`)
- Info: Blue (`blue-500`)
- Background: Slate gradients

**Typography:**
- Headers: Bold, large sizes (text-3xl, text-2xl)
- Body: Medium weight (font-medium)
- Labels: Small, uppercase for emphasis

**Spacing:**
- Consistent padding (p-4, p-6)
- Grid gaps (gap-4, gap-6)
- Margin utilities (mt-4, mb-2)

**Shadows & Borders:**
- Cards: `shadow-lg` with `border border-slate-200`
- Buttons: `shadow-lg hover:shadow-xl`
- Rounded corners: `rounded-lg`, `rounded-xl`

---

## 📱 Responsive Design

The dashboard is fully responsive across all devices:

### Breakpoints
- **Mobile:** < 768px (1 column layout)
- **Tablet:** 768px - 1024px (2 column layout)
- **Desktop:** > 1024px (3 column layout)

### Responsive Features
```javascript
// Statistics cards
className="grid grid-cols-1 md:grid-cols-3 gap-6"

// Reservation info
className="grid grid-cols-2 md:grid-cols-4 gap-4"

// Filters
className="grid grid-cols-1 md:grid-cols-3 gap-4"
```

---

## 🧪 Testing

### Run Tests
```bash
npm test

# Or with yarn
yarn test
```

### Test Coverage
```bash
npm test -- --coverage
```

### Example Test
```javascript
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders restaurant name", () => {
  render(<App />);
  const linkElement = screen.getByText(/Chaat Corner/i);
  expect(linkElement).toBeInTheDocument();
});
```

---

## 🔧 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Start | `npm start` | Run development server |
| Build | `npm run build` | Create production build |
| Test | `npm test` | Run test suite |
| Eject | `npm run eject` | Eject from Create React App ⚠️ |

**⚠️ Warning:** Ejecting is a one-way operation and cannot be undone!

---

## 🌐 Browser Support

Supports all modern browsers:

| Browser | Version |
|---------|---------|
| Chrome | Latest |
| Firefox | Latest |
| Safari | Latest |
| Edge | Latest |
| Mobile Safari | iOS 12+ |
| Chrome Mobile | Latest |

**Note:** Internet Explorer is not supported.

---

## 🔍 Troubleshooting

### Styles Not Loading

**Problem:** Tailwind classes not applying

**Solutions:**
1. Verify `src/index.css` contains Tailwind directives:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
2. Check `tailwind.config.js` content array includes your files
3. Restart development server: `npm start`
4. Clear browser cache and hard reload (Cmd/Ctrl + Shift + R)

### API Connection Errors

**Problem:** Cannot connect to backend

**Solutions:**
1. Verify backend is running: `http://localhost:3001`
2. Check `API_URL` in `src/App.js` matches backend port
3. Ensure CORS is enabled on backend
4. Check browser console for specific errors
5. Verify network tab in DevTools shows correct requests

### Build Errors

**Problem:** Build fails or shows errors

**Solutions:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf build
npm run build

# Check for dependency conflicts
npm ls
```

### Port Already in Use

**Problem:** Port 3000 already in use

**Solutions:**
```bash
# Option 1: Kill process on port 3000
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Option 2: Use different port
PORT=3001 npm start
```

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Various Platforms

#### **Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### **Netlify**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=build
```

#### **GitHub Pages**
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json
"homepage": "https://yourusername.github.io/restaurant-frontend",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

# Deploy
npm run deploy
```

#### **AWS S3 + CloudFront**
```bash
# Build
npm run build

# Upload to S3 bucket
aws s3 sync build/ s3://your-bucket-name

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Environment Variables for Production

Update your production environment with:
```env
REACT_APP_API_URL=https://api.yourrestaurant.com
```

---

## 📦 Dependencies

### Production Dependencies
- `react` (^19.2.0) - Core React library
- `react-dom` (^19.2.0) - React DOM rendering
- `lucide-react` (^0.544.0) - Icon library
- `web-vitals` (^2.1.4) - Performance metrics

### Development Dependencies
- `react-scripts` (5.0.1) - Create React App scripts
- `tailwindcss` (^3.4.18) - Utility-first CSS
- `autoprefixer` (^10.4.21) - CSS vendor prefixes
- `postcss` (^8.5.6) - CSS transformations
- `@testing-library/react` (^16.3.0) - React testing utilities
- `@testing-library/jest-dom` (^6.9.1) - Jest matchers

---

## 🎯 Performance Optimization

### Built-in Optimizations
- Code splitting with React.lazy (if needed)
- Production build minification
- Asset optimization and compression
- Tree shaking to remove unused code

### Web Vitals Monitoring
```javascript
// In src/index.js
import reportWebVitals from './reportWebVitals';

reportWebVitals(console.log); // Log to console
// or
reportWebVitals(sendToAnalytics); // Send to analytics service
```

### Performance Tips
1. Use React DevTools Profiler
2. Implement pagination for large reservation lists
3. Add debounce to search input
4. Use React.memo for expensive components
5. Lazy load images and components

---

### Code Style Guidelines
- Use functional components with hooks
- Follow Tailwind utility-first approach
- Add comprehensive comments
- Use meaningful variable names
- Keep components focused and small

---

## 🎓 Learn More

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Create React App](https://create-react-app.dev)
- [Lucide Icons](https://lucide.dev)

---

Built with ❤️ using React and Tailwind CSS