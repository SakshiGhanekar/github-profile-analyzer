const Joi = require('joi');

const analyzeProfileSchema = Joi.object({
  username: Joi.string().pattern(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i).required()
    .messages({
      'string.pattern.base': 'Invalid GitHub username format',
      'any.required': 'Username is a required field'
    })
});

const validateAnalyzeProfile = (req, res, next) => {
  const { error } = analyzeProfileSchema.validate(req.params);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  
  next();
};

module.exports = {
  validateAnalyzeProfile
};
