# Delhi Metro Route Planner

A modern web application for planning routes on the Delhi Metro network. This application provides an interactive map, route planning, and station information.

## Features

- Interactive metro map visualization
- Route planning between stations
- Fare calculation
- Station information and search
- Responsive design for all devices

## Tech Stack

- Frontend: React.js with Material-UI
- Backend: Node.js with Express
- Maps: Leaflet.js
- Styling: Material-UI components

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd delhi-metro-planner
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
```

## Running the Application

1. Start the backend server:
```bash
# From the root directory
npm run dev
```

2. Start the frontend development server:
```bash
# From the client directory
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
delhi-metro-planner/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   └── App.js        # Main application component
│   └── package.json
├── server.js              # Express backend server
└── package.json
```

## API Endpoints

- GET `/api/stations` - Get all metro stations
- GET `/api/lines` - Get all metro lines
- GET `/api/route` - Get route between two stations
  - Query parameters: `from` and `to` (station IDs)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 