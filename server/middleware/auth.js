const { asyncHandler } = require('./errorHandler');

// Authentication middleware
const authenticate = asyncHandler(async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'Please log in to access this resource'
    });
  }
  next();
});

// Optional authentication (for public routes that can benefit from user context)
const optionalAuth = (req, res, next) => {
  // User data will be available in req.user if authenticated, null otherwise
  next();
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions'
      });
    }
    
    next();
  };
};

// Resource ownership check
const checkOwnership = (resourceModel, userField = 'author') => {
  return asyncHandler(async (req, res, next) => {
    const resource = await resourceModel.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    if (resource[userField] !== req.user.username && resource[userField] !== req.user.id) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'You can only modify your own resources'
      });
    }
    
    req.resource = resource;
    next();
  });
};

module.exports = {
  authenticate,
  optionalAuth,
  authorize,
  checkOwnership
};
