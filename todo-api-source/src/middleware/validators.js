import Joi from 'joi';

export const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  description: Joi.string().allow('').max(1000),
  completed: Joi.boolean().default(false)
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200),
  description: Joi.string().allow('').max(1000),
  completed: Joi.boolean()
}).min(1); // at least one field must be present

export function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'Invalid request body',
        details: error.details.map(d => ({ message: d.message, path: d.path }))
      });
    }
    req.validated = value;
    next();
  };
}
