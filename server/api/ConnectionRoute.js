const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Mock connection storage
const connections = [];
let connectionIdCounter = 1;

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

// Get all connections for a project
router.get('/project/:projectId', authenticateToken, (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const projectConnections = connections.filter(conn => conn.projectId === projectId);
    
    // Remove sensitive data before sending
    const safeConnections = projectConnections.map(conn => {
      const { password, connectionString, ...safeConn } = conn;
      return safeConn;
    });
    
    res.json(safeConnections);
  } catch (error) {
    console.error('Get connections error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a specific connection
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const connectionId = parseInt(req.params.id);
    const connection = connections.find(c => c.id === connectionId);
    
    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    // Remove sensitive data
    const { password, connectionString, ...safeConnection } = connection;
    res.json(safeConnection);
  } catch (error) {
    console.error('Get connection error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new connection
router.post('/', authenticateToken, [
  body('name').trim().isLength({ min: 1 }).withMessage('Connection name is required'),
  body('projectId').isInt({ min: 1 }).withMessage('Valid project ID is required'),
  body('type').isIn(['mysql', 'postgres', 'mongodb', 'api', 'firebase']).withMessage('Valid connection type is required'),
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
      name, 
      projectId, 
      type, 
      host, 
      port, 
      database, 
      username, 
      password,
      connectionString,
      apiUrl,
      headers 
    } = req.body;

    const connection = {
      id: connectionIdCounter++,
      name,
      projectId: parseInt(projectId),
      type,
      host: host || '',
      port: port || null,
      database: database || '',
      username: username || '',
      password: password || '', // In production, encrypt this
      connectionString: connectionString || '',
      apiUrl: apiUrl || '',
      headers: headers || {},
      active: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    connections.push(connection);

    // Remove sensitive data from response
    const { password: _, connectionString: __, ...safeConnection } = connection;

    res.status(201).json({
      message: 'Connection created successfully',
      ...safeConnection,
    });
  } catch (error) {
    console.error('Create connection error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Test a connection
router.post('/test', authenticateToken, [
  body('type').isIn(['mysql', 'postgres', 'mongodb', 'api', 'firebase']).withMessage('Valid connection type is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { type, host, port, database, username, password, apiUrl } = req.body;

    // Mock connection test - in production, implement actual connection testing
    let testResult = { success: false, message: 'Connection test not implemented' };

    switch (type) {
      case 'mysql':
      case 'postgres':
        if (host && port && database && username) {
          testResult = { success: true, message: 'Database connection successful' };
        } else {
          testResult = { success: false, message: 'Missing required database connection parameters' };
        }
        break;
      
      case 'mongodb':
        if (host || database) {
          testResult = { success: true, message: 'MongoDB connection successful' };
        } else {
          testResult = { success: false, message: 'Missing MongoDB connection parameters' };
        }
        break;
      
      case 'api':
        if (apiUrl) {
          testResult = { success: true, message: 'API connection successful' };
        } else {
          testResult = { success: false, message: 'API URL is required' };
        }
        break;
      
      case 'firebase':
        testResult = { success: true, message: 'Firebase connection successful' };
        break;
      
      default:
        testResult = { success: false, message: 'Unsupported connection type' };
    }

    res.json(testResult);
  } catch (error) {
    console.error('Test connection error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Connection test failed due to server error' 
    });
  }
});

// Update a connection
router.put('/:id', authenticateToken, [
  body('name').optional().trim().isLength({ min: 1 }).withMessage('Connection name cannot be empty'),
  body('type').optional().isIn(['mysql', 'postgres', 'mongodb', 'api', 'firebase']).withMessage('Valid connection type is required'),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const connectionId = parseInt(req.params.id);
    const connectionIndex = connections.findIndex(c => c.id === connectionId);
    
    if (connectionIndex === -1) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    const { 
      name, 
      type, 
      host, 
      port, 
      database, 
      username, 
      password,
      connectionString,
      apiUrl,
      headers,
      active 
    } = req.body;

    if (name !== undefined) connections[connectionIndex].name = name;
    if (type !== undefined) connections[connectionIndex].type = type;
    if (host !== undefined) connections[connectionIndex].host = host;
    if (port !== undefined) connections[connectionIndex].port = port;
    if (database !== undefined) connections[connectionIndex].database = database;
    if (username !== undefined) connections[connectionIndex].username = username;
    if (password !== undefined) connections[connectionIndex].password = password;
    if (connectionString !== undefined) connections[connectionIndex].connectionString = connectionString;
    if (apiUrl !== undefined) connections[connectionIndex].apiUrl = apiUrl;
    if (headers !== undefined) connections[connectionIndex].headers = headers;
    if (active !== undefined) connections[connectionIndex].active = active;
    connections[connectionIndex].updatedAt = new Date();

    // Remove sensitive data from response
    const { password: _, connectionString: __, ...safeConnection } = connections[connectionIndex];

    res.json({
      message: 'Connection updated successfully',
      ...safeConnection,
    });
  } catch (error) {
    console.error('Update connection error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a connection
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const connectionId = parseInt(req.params.id);
    const connectionIndex = connections.findIndex(c => c.id === connectionId);
    
    if (connectionIndex === -1) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    connections.splice(connectionIndex, 1);

    res.json({ message: 'Connection deleted successfully' });
  } catch (error) {
    console.error('Delete connection error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;