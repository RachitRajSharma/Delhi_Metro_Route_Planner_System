const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Commented out for development ---
// app.use(express.static(path.join(__dirname, 'client/build')));

// Metro data
const metroData = {
  stations: [
    { id: 1, name: "Central Secretariat", line: "Yellow", coordinates: [28.6143, 77.2289] },
    { id: 2, name: "Patel Chowk", line: "Yellow", coordinates: [28.6262, 77.2167] },
    { id: 3, name: "Rajiv Chowk", line: "Yellow", coordinates: [28.6328, 77.2197] },
    { id: 4, name: "Mandi House", line: "Blue", coordinates: [28.6289, 77.2340] },
    { id: 5, name: "Supreme Court", line: "Blue", coordinates: [28.6315, 77.2426] },
    { id: 6, name: "Indraprastha", line: "Blue", coordinates: [28.6280, 77.2510] },
    { id: 7, name: "Yamuna Bank", line: "Blue", coordinates: [28.6072, 77.2732] },
    { id: 8, name: "Akshardham", line: "Blue", coordinates: [28.6127, 77.2773] },
    { id: 9, name: "Mayur Vihar", line: "Blue", coordinates: [28.5892, 77.2921] },
    { id: 10, name: "Hazrat Nizamuddin", line: "Pink", coordinates: [28.5883, 77.2561] },
    { id: 11, name: "Ashram", line: "Pink", coordinates: [28.5732, 77.2567] },
    { id: 12, name: "Vinobapuri", line: "Pink", coordinates: [28.5652, 77.2569] },
    { id: 13, name: "Lajpat Nagar", line: "Pink", coordinates: [28.5672, 77.2436] },
    { id: 14, name: "South Extension", line: "Pink", coordinates: [28.5667, 77.2232] },
    { id: 15, name: "Dilli Haat INA", line: "Pink", coordinates: [28.5687, 77.2092] },
    { id: 16, name: "Jor Bagh", line: "Yellow", coordinates: [28.5822, 77.2097] },
    { id: 17, name: "Lok Kalyan Marg", line: "Yellow", coordinates: [28.5942, 77.2102] },
    { id: 18, name: "Udyog Bhawan", line: "Yellow", coordinates: [28.6012, 77.2132] },
    { id: 19, name: "Khan Market", line: "Violet", coordinates: [28.6002, 77.2332] },
    { id: 20, name: "JLN Stadium", line: "Violet", coordinates: [28.5822, 77.2342] },
    { id: 21, name: "Jangpura", line: "Violet", coordinates: [28.5732, 77.2432] },
    { id: 22, name: "Janpath", line: "Violet", coordinates: [28.6292, 77.2162] }
  ],
  lines: [
    { name: "Yellow", color: "#FFFF00" },
    { name: "Blue", color: "#0000FF" },
    { name: "Pink", color: "#FF69B4" },
    { name: "Violet", color: "#8F00FF" }
  ]
};

// Helper: Build a graph from the stations and connections
const metroGraph = {};
const stationIdToObj = {};
metroData.stations.forEach(station => {
  metroGraph[station.id] = [];
  stationIdToObj[station.id] = station;
});
// Example connections (add more as needed)
const connections = [
  // Yellow line
  [1, 2, 2, "Yellow"],
  [2, 3, 2, "Yellow"],
  // Blue line
  [3, 4, 2, "Yellow"], // Rajiv Chowk <-> Mandi House (Yellow for interchange)
  [4, 5, 2, "Blue"],
  [5, 6, 2, "Blue"],
  [6, 7, 2, "Blue"],
  [7, 8, 3, "Blue"],
  [8, 9, 2, "Blue"],
  // Pink line
  [10, 11, 2, "Pink"],
  [11, 12, 2, "Pink"],
  [12, 13, 2, "Pink"],
  [13, 14, 2, "Pink"],
  [14, 15, 2, "Pink"],
  // Yellow line continued
  [15, 16, 2, "Yellow"],
  [16, 17, 2, "Yellow"],
  [17, 18, 2, "Yellow"],
  [18, 1, 2, "Yellow"],
  // Violet line
  [19, 20, 2, "Violet"],
  [20, 21, 2, "Violet"],
  [21, 13, 2, "Violet"], // Jangpura <-> Lajpat Nagar (Violet)
  [19, 1, 2, "Violet"], // Khan Market <-> Central Secretariat (Violet)
  [22, 3, 2, "Violet"], // Janpath <-> Rajiv Chowk (Violet)
  // Interchanges
  [3, 4, 2, "Blue"], // Rajiv Chowk <-> Mandi House (Blue for interchange)
  [13, 15, 2, "Pink"], // Lajpat Nagar <-> Dilli Haat INA (Pink)
  [15, 13, 2, "Pink"]  // Dilli Haat INA <-> Lajpat Nagar (Pink)
];
connections.forEach(([from, to, time, line]) => {
  metroGraph[from].push({ to, time, line });
  metroGraph[to].push({ to: from, time, line });
});

function dijkstraRoute(fromId, toId) {
  const dist = {};
  const prev = {};
  const lineUsed = {};
  const pq = new Set(Object.keys(metroGraph));
  Object.keys(metroGraph).forEach(id => dist[id] = Infinity);
  dist[fromId] = 0;

  while (pq.size > 0) {
    // Find node with min dist
    let u = null;
    let minDist = Infinity;
    for (const id of pq) {
      if (dist[id] < minDist) {
        minDist = dist[id];
        u = id;
      }
    }
    if (u === null) break;
    pq.delete(u);
    if (u == toId) break;
    for (const edge of metroGraph[u]) {
      let alt = dist[u] + edge.time;
      // Add interchange penalty if line changes
      if (lineUsed[u] && lineUsed[u] !== edge.line) {
        alt += 5; // 5 min penalty for line change
      }
      if (alt < dist[edge.to]) {
        dist[edge.to] = alt;
        prev[edge.to] = u;
        lineUsed[edge.to] = edge.line;
      }
    }
  }
  // Reconstruct path
  let path = [];
  let lines = [];
  let u = toId;
  while (u !== undefined) {
    path.unshift(Number(u));
    u = prev[u];
  }
  // Build line change info
  let lastLine = null;
  for (let i = 1; i < path.length; ++i) {
    const from = path[i-1];
    const to = path[i];
    const edge = metroGraph[from].find(e => e.to == to);
    if (edge) {
      if (lastLine && lastLine !== edge.line) {
        lines.push({ at: from, changeTo: edge.line });
      }
      lastLine = edge.line;
    }
  }
  return {
    path,
    totalTime: dist[toId] === Infinity ? null : dist[toId],
    lineChanges: lines
  };
}

// API Routes
app.get('/api/stations', (req, res) => {
  res.json(metroData.stations);
});

app.get('/api/lines', (req, res) => {
  res.json(metroData.lines);
});

app.get('/api/route', (req, res) => {
  const { from, to } = req.query;
  const fromId = String(from);
  const toId = String(to);
  if (!metroGraph[fromId] || !metroGraph[toId]) {
    return res.status(400).json({ error: 'Invalid station id' });
  }
  const result = dijkstraRoute(fromId, toId);
  if (!result.path.length || result.totalTime === null) {
    return res.status(404).json({ error: 'No route found' });
  }
  // Calculate fare (simple: Rs. 10 + Rs. 5 per segment)
  const fare = 10 + (result.path.length - 1) * 5;
  res.json({
    path: result.path,
    stations: result.path.map(id => stationIdToObj[id]),
    totalTime: result.totalTime,
    fare: `₹${fare}`,
    lineChanges: result.lineChanges
  });
});

// --- Commented out for development ---
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 