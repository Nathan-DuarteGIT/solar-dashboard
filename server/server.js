const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (mock)
let panels = [
  {
    id: 'SP-001',
    location: 'North Sector A',
    capacity: 250.0,
    todayProduction: 1856.5,
    status: 'Active',
  },
  {
    id: 'SP-002',
    location: 'South Sector B',
    capacity: 300.0,
    todayProduction: 2234.8,
    status: 'Active',
  },
  {
    id: 'SP-003',
    location: 'East Sector C',
    capacity: 200.0,
    todayProduction: 1423.2,
    status: 'Maintenance',
  },
  {
    id: 'SP-004',
    location: 'West Sector D',
    capacity: 280.0,
    todayProduction: 2087.4,
    status: 'Active',
  },
  {
    id: 'SP-005',
    location: 'Central Sector E',
    capacity: 320.0,
    todayProduction: 2401.6,
    status: 'Active',
  },
  {
    id: 'SP-006',
    location: 'South Sector F',
    capacity: 270.0,
    todayProduction: 1998.3,
    status: 'Active',
  },
  {
    id: 'SP-007',
    location: 'East Sector G',
    capacity: 240.0,
    todayProduction: 1765.8,
    status: 'Inactive',
  },
  {
    id: 'SP-008',
    location: 'North Sector H',
    capacity: 290.0,
    todayProduction: 2156.7,
    status: 'Active',
  },
];

// Mock production data
const productionData = [
  { hour: 1, production: 21.25, type: 'production' },
  { hour: 2, production: 22.5, type: 'production' },
  { hour: 3, production: 23.75, type: 'production' },
  { hour: 4, production: 23.0, type: 'production' },
  { hour: 5, production: 22.0, type: 'production' },
  { hour: 6, production: 18.75, type: 'production' },
  { hour: 7, production: 6.25, type: 'idle' },
  { hour: 8, production: 7.5, type: 'idle' },
  { hour: 9, production: 17.5, type: 'production' },
  { hour: 10, production: 21.25, type: 'production' },
  { hour: 11, production: 20.5, type: 'production' },
  { hour: 12, production: 19.5, type: 'production' },
  { hour: 13, production: 8.75, type: 'idle' },
  { hour: 14, production: 22.0, type: 'production' },
  { hour: 15, production: 23.0, type: 'production' },
  { hour: 16, production: 16.25, type: 'limited' },
  { hour: 17, production: 17.5, type: 'limited' },
  { hour: 18, production: 17.0, type: 'limited' },
  { hour: 19, production: 20.0, type: 'production' },
  { hour: 20, production: 18.75, type: 'production' },
  { hour: 21, production: 10.0, type: 'idle' },
  { hour: 22, production: 8.75, type: 'idle' },
  { hour: 23, production: 7.5, type: 'idle' },
  { hour: 24, production: 21.25, type: 'production' },
];

// Helper function to generate ID
function generateId() {
  const existingIds = panels.map((p) => parseInt(p.id.split('-')[1]));
  const maxId = Math.max(...existingIds);
  return `SP-${String(maxId + 1).padStart(3, '0')}`;
}

// Routes

// GET /api/panels - Get all panels
app.get('/api/panels', (req, res) => {
  res.json({
    success: true,
    data: panels,
  });
});

// GET /api/panels/:id - Get single panel
app.get('/api/panels/:id', (req, res) => {
  const panel = panels.find((p) => p.id === req.params.id);

  if (!panel) {
    return res.status(404).json({
      success: false,
      message: 'Panel not found',
    });
  }

  res.json({
    success: true,
    data: panel,
  });
});

// POST /api/panels - Create new panel
app.post('/api/panels', (req, res) => {
  const { location, capacity, todayProduction, status } = req.body;

  // Validation
  if (!location || !capacity) {
    return res.status(400).json({
      success: false,
      message: 'Location and capacity are required',
    });
  }

  const newPanel = {
    id: generateId(),
    location,
    capacity: parseFloat(capacity),
    todayProduction: parseFloat(todayProduction) || 0,
    status: status || 'Active',
  };

  panels.push(newPanel);

  res.status(201).json({
    success: true,
    message: 'Panel created successfully',
    data: newPanel,
  });
});

// PUT /api/panels/:id - Update panel
app.put('/api/panels/:id', (req, res) => {
  const index = panels.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Panel not found',
    });
  }

  const { location, capacity, todayProduction, status } = req.body;

  // Update panel
  panels[index] = {
    ...panels[index],
    location: location || panels[index].location,
    capacity: capacity ? parseFloat(capacity) : panels[index].capacity,
    todayProduction: todayProduction
      ? parseFloat(todayProduction)
      : panels[index].todayProduction,
    status: status || panels[index].status,
  };

  res.json({
    success: true,
    message: 'Panel updated successfully',
    data: panels[index],
  });
});

// DELETE /api/panels/:id - Delete panel
app.delete('/api/panels/:id', (req, res) => {
  const index = panels.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Panel not found',
    });
  }

  const deletedPanel = panels.splice(index, 1)[0];

  res.json({
    success: true,
    message: 'Panel deleted successfully',
    data: deletedPanel,
  });
});

// GET /api/production - Get production data
app.get('/api/production', (req, res) => {
  res.json({
    success: true,
    data: productionData,
  });
});

// GET /api/stats - Get statistics
app.get('/api/stats', (req, res) => {
  const totalProduction = panels.reduce((sum, p) => sum + p.todayProduction, 0);
  const activePanels = panels.filter((p) => p.status === 'Active').length;
  const totalCapacity = panels.reduce((sum, p) => sum + p.capacity, 0);

  res.json({
    success: true,
    data: {
      totalProduction,
      activePanels,
      totalPanels: panels.length,
      totalCapacity,
      averageProduction: totalProduction / panels.length,
    },
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Solar Energy API running on http://localhost:${PORT}`);
});

module.exports = app;
 