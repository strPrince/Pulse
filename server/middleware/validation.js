const Joi = require('joi');

// Blog validation schemas
const blogSchemas = {
  create: Joi.object({
    title: Joi.string().min(3).max(200).required().messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title cannot exceed 200 characters',
    }),
    content: Joi.string().min(10).required().messages({
      'string.empty': 'Content is required',
      'string.min': 'Content must be at least 10 characters long',
    }),
    tags: Joi.array().items(Joi.string().max(50)).max(5).optional(),
    image: Joi.string().uri().optional(),
    customCategory: Joi.string().max(100).optional(),
  }),
  
  update: Joi.object({
    title: Joi.string().min(3).max(200).optional(),
    content: Joi.string().min(10).optional(),
    tags: Joi.array().items(Joi.string().max(50)).max(5).optional(),
    image: Joi.string().uri().optional(),
    customCategory: Joi.string().max(100).optional(),
  }),
};

// User validation schemas
const userSchemas = {
  updateProfile: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).optional().messages({
      'string.alphanum': 'Username must contain only letters and numbers',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 30 characters',
    }),
    bio: Joi.string().max(500).optional().messages({
      'string.max': 'Bio cannot exceed 500 characters',
    }),
  }),
  
  updateBio: Joi.object({
    bio: Joi.string().max(500).required().messages({
      'string.max': 'Bio cannot exceed 500 characters',
    }),
  }),
  
  updateUsername: Joi.object({
    newUsername: Joi.string().alphanum().min(3).max(30).required().messages({
      'string.alphanum': 'Username must contain only letters and numbers',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 30 characters',
    }),
  }),
};

// Comment validation schemas
const commentSchemas = {
  create: Joi.object({
    content: Joi.string().min(1).max(1000).required().messages({
      'string.empty': 'Comment content is required',
      'string.max': 'Comment cannot exceed 1000 characters',
    }),
  }),
};

// Vote validation schema
const voteSchema = Joi.object({
  action: Joi.string().valid('up', 'down', 'neutral').required().messages({
    'any.only': 'Action must be either "up", "down", or "neutral"',
  }),
});

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details.map(detail => detail.message),
      });
    }
    next();
  };
};

module.exports = {
  blogSchemas,
  userSchemas,
  commentSchemas,
  voteSchema,
  validate,
};
