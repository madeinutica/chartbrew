const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Mock dataset storage
const datasets = [];
let datasetIdCounter = 1;

const JWT_SECRET = process.env.CB_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Get all datasets for a chart
router.get('/chart/:chartId', authenticateToken, (req, res) => {
  try {
    const chartId = parseInt(req.params.chartId);
    const chartDatasets = datasets.filter(dataset => dataset.chartId === chartId);
    res.json(chartDatasets);
  } catch (error) {
    console.error('Get datasets error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a specific dataset
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const datasetId = parseInt(req.params.id);
    const dataset = datasets.find(d => d.id === datasetId);
    
    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    res.json(dataset);
  } catch (error) {
    console.error('Get dataset error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new dataset
router.post('/', authenticateToken, [
  body('chartId').isInt({ min: 1 }).withMessage('Valid chart ID is required'),
  body('connectionId').isInt({ min: 1 }).withMessage('Valid connection ID is required'),
  body('query').optional().trim(),
  body('apiEndpoint').optional().trim(),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { 
      chartId, 
      connectionId, 
      query, 
      apiEndpoint, 
      xAxis, 
      yAxis, 
      filters 
    } = req.body;

    const dataset = {
      id: datasetIdCounter++,
      chartId: parseInt(chartId),
      connectionId: parseInt(connectionId),
      query: query || '',
      apiEndpoint: apiEndpoint || '',
      xAxis: xAxis || '',
      yAxis: yAxis || '',
      filters: filters || [],
      data: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    datasets.push(dataset);

    res.status(201).json({
      message: 'Dataset created successfully',
      ...dataset,
    });
  } catch (error) {
    console.error('Create dataset error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a dataset
router.put('/:id', authenticateToken, [
  body('query').optional().trim(),
  body('apiEndpoint').optional().trim(),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const datasetId = parseInt(req.params.id);
    const datasetIndex = datasets.findIndex(d => d.id === datasetId);
    
    if (datasetIndex === -1) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    const { 
      query, 
      apiEndpoint, 
      xAxis, 
      yAxis, 
      filters, 
      data 
    } = req.body;

    if (query !== undefined) datasets[datasetIndex].query = query;
    if (apiEndpoint !== undefined) datasets[datasetIndex].apiEndpoint = apiEndpoint;
    if (xAxis !== undefined) datasets[datasetIndex].xAxis = xAxis;
    if (yAxis !== undefined) datasets[datasetIndex].yAxis = yAxis;
    if (filters !== undefined) datasets[datasetIndex].filters = filters;
    if (data !== undefined) datasets[datasetIndex].data = data;
    datasets[datasetIndex].updatedAt = new Date();

    res.json({
      message: 'Dataset updated successfully',
      ...datasets[datasetIndex],
    });
  } catch (error) {
    console.error('Update dataset error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Execute dataset query and return data
router.post('/:id/execute', authenticateToken, (req, res) => {
  try {
    const datasetId = parseInt(req.params.id);
    const dataset = datasets.find(d => d.id === datasetId);
    
    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    // Mock data execution - in production, execute actual queries
    const mockData = [
      { x: '2024-01', y: 100 },
      { x: '2024-02', y: 150 },
      { x: '2024-03', y: 200 },
      { x: '2024-04', y: 175 },
      { x: '2024-05', y: 225 },
    ];

    // Update dataset with new data
    const datasetIndex = datasets.findIndex(d => d.id === datasetId);
    datasets[datasetIndex].data = mockData;
    datasets[datasetIndex].updatedAt = new Date();

    res.json({
      message: 'Dataset executed successfully',
      data: mockData,
    });
  } catch (error) {
    console.error('Execute dataset error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a dataset
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const datasetId = parseInt(req.params.id);
    const datasetIndex = datasets.findIndex(d => d.id === datasetId);
    
    if (datasetIndex === -1) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    datasets.splice(datasetIndex, 1);

    res.json({ message: 'Dataset deleted successfully' });
  } catch (error) {
    console.error('Delete dataset error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;