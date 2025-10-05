# Chaat Corner,SFO - Restaurant Reservation Frontend

Beautiful, modern reservation management dashboard for Chaat Corner,SFO restaurant.

## Features

- 📊 **Dashboard View** - Today's reservations at a glance
- 📋 **All Reservations** - Complete reservation list with filtering
- ➕ **Create Reservations** - Easy-to-use reservation form
- ✏️ **Edit Reservations** - Modify existing bookings
- ❌ **Cancel Reservations** - Cancel with confirmation
- 🔍 **Search & Filter** - Find reservations quickly
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Beautiful UI** - Modern design with Tailwind CSS

## Prerequisites

- Node.js 18+ installed
- Backend API running on http://localhost:3001
- npm or yarn package manager

## Installation

```bash
# Install dependencies
npm install

# Or with yarn
yarn install
```

## Running the Application

```bash
# Start development server
npm start

# Or with yarn
yarn start
```

The app will open at `http://localhost:3000`

## Building for Production

```bash
# Create production build
npm run build

# Or with yarn
yarn build
```

## Project Structure

```
src/
├── App.js              # Main application component
├── App.test.js         # Component tests
├── index.js            # Application entry point
├── index.css           # Global styles with Tailwind
├── reportWebVitals.js  # Performance monitoring
└── setupTests.js       # Test configuration
```

## Configuration

### Backend API URL

Update the API URL in `src/App.js`:

```javascript
const API_URL = "http://localhost:3001"; // Change to your backend URL
```

### Tailwind CSS

Tailwind is configured in `tailwind.config.js`. All utility classes are available.

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (⚠️ one-way operation)

## Components

### Main Components

- **ReservationDashboard** - Main app container
- **StatCard** - Statistics display cards
- **ReservationCard** - Individual reservation display
- **ReservationForm** - Create/edit reservation form
- **Modal** - Reusable modal wrapper

### Features by Component

**ReservationDashboard**

- State management for all reservations
- API integration
- Tab navigation (Dashboard/All Reservations)
- Search and filter logic

**StatCard**

- Displays key metrics
- Color-coded by type (blue, green, red)
- Animated icons

**ReservationCard**

- Shows reservation details
- Edit/Cancel actions
- Status badges
- Special requests display

**ReservationForm**

- Full validation
- Common special requests
- Custom request input
- Date/time selection

**Modal**

- Backdrop overlay
- Scroll support
- Close on backdrop click

## Styling

Uses Tailwind CSS with custom configuration:

- Gradient backgrounds
- Responsive grid layouts
- Hover effects
- Smooth transitions
- Custom scrollbar styling

## API Integration

Communicates with backend via REST API:

- `GET /reservations/stats` - Dashboard statistics
- `GET /reservations/today` - Today's reservations
- `GET /reservations` - All reservations with filters
- `POST /reservations` - Create reservation
- `PATCH /reservations/:id` - Update reservation
- `DELETE /reservations/:id` - Cancel reservation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Styles not loading

1. Check `src/index.css` has Tailwind directives
2. Verify `tailwind.config.js` exists
3. Restart development server

### API errors

1. Ensure backend is running
2. Check API_URL in App.js
3. Verify CORS is enabled on backend
4. Check browser console for errors

### Build errors

1. Clear node_modules and reinstall
2. Delete build folder
3. Check for conflicting dependencies

## License

Private - Chaat Corner Restaurant

## Support

For issues or questions, contact the development team.

---

Built with ❤️ using React and Tailwind CSS
