const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Mock project storage
const projects = [];
let projectIdCounter = 1;

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

// Get all projects for the authenticated user
router.get('/', authenticateToken, (req, res) => {
  try {
    const userProjects = projects.filter(project => project.userId === req.user.id);
    res.json(userProjects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a specific project
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const project = projects.find(p => p.id === projectId && p.userId === req.user.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new project
router.post('/', authenticateToken, [
  body('name').trim().isLength({ min: 1 }).withMessage('Project name is required'),
  body('description').optional().trim(),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { name, description } = req.body;

    const project = {
      id: projectIdCounter++,
      name,
      description: description || '',
      userId: req.user.id,
      charts: [],
      connections: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    projects.push(project);

    res.status(201).json({
      message: 'Project created successfully',
      ...project,
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a project
router.put('/:id', authenticateToken, [
  body('name').optional().trim().isLength({ min: 1 }).withMessage('Project name cannot be empty'),
  body('description').optional().trim(),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const projectId = parseInt(req.params.id);
    const projectIndex = projects.findIndex(p => p.id === projectId && p.userId === req.user.id);
    
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { name, description } = req.body;

    if (name !== undefined) projects[projectIndex].name = name;
    if (description !== undefined) projects[projectIndex].description = description;
    projects[projectIndex].updatedAt = new Date();

    res.json({
      message: 'Project updated successfully',
      ...projects[projectIndex],
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a project
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const projectIndex = projects.findIndex(p => p.id === projectId && p.userId === req.user.id);
    
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }

    projects.splice(projectIndex, 1);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;