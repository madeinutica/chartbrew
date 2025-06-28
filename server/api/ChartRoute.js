const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Mock chart storage
const charts = [];
let chartIdCounter = 1;

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

// Get all charts for a project
router.get('/project/:projectId', authenticateToken, (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const projectCharts = charts.filter(chart => chart.projectId === projectId);
    res.json(projectCharts);
  } catch (error) {
    console.error('Get charts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a specific chart
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const chartId = parseInt(req.params.id);
    const chart = charts.find(c => c.id === chartId);
    
    if (!chart) {
      return res.status(404).json({ message: 'Chart not found' });
    }

    res.json(chart);
  } catch (error) {
    console.error('Get chart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new chart
router.post('/', authenticateToken, [
  body('name').trim().isLength({ min: 1 }).withMessage('Chart name is required'),
  body('projectId').isInt({ min: 1 }).withMessage('Valid project ID is required'),
  body('type').isIn(['line', 'bar', 'pie', 'doughnut', 'radar', 'polar', 'table']).withMessage('Valid chart type is required'),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { name, projectId, type, description } = req.body;

    const chart = {
      id: chartIdCounter++,
      name,
      projectId: parseInt(projectId),
      type,
      description: description || '',
      data: {},
      options: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    charts.push(chart);

    res.status(201).json({
      message: 'Chart created successfully',
      ...chart,
    });
  } catch (error) {
    console.error('Create chart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a chart
router.put('/:id', authenticateToken, [
  body('name').optional().trim().isLength({ min: 1 }).withMessage('Chart name cannot be empty'),
  body('type').optional().isIn(['line', 'bar', 'pie', 'doughnut', 'radar', 'polar', 'table']).withMessage('Valid chart type is required'),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const chartId = parseInt(req.params.id);
    const chartIndex = charts.findIndex(c => c.id === chartId);
    
    if (chartIndex === -1) {
      return res.status(404).json({ message: 'Chart not found' });
    }

    const { name, type, description, data, options } = req.body;

    if (name !== undefined) charts[chartIndex].name = name;
    if (type !== undefined) charts[chartIndex].type = type;
    if (description !== undefined) charts[chartIndex].description = description;
    if (data !== undefined) charts[chartIndex].data = data;
    if (options !== undefined) charts[chartIndex].options = options;
    charts[chartIndex].updatedAt = new Date();

    res.json({
      message: 'Chart updated successfully',
      ...charts[chartIndex],
    });
  } catch (error) {
    console.error('Update chart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a chart
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const chartId = parseInt(req.params.id);
    const chartIndex = charts.findIndex(c => c.id === chartId);
    
    if (chartIndex === -1) {
      return res.status(404).json({ message: 'Chart not found' });
    }

    charts.splice(chartIndex, 1);

    res.json({ message: 'Chart deleted successfully' });
  } catch (error) {
    console.error('Delete chart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;