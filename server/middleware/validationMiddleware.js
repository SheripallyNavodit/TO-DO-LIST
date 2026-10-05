export function validateBody(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (err) {
      if (err.errors) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: err.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid request data'
      });
    }
  };
}

export function validateQuery(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.query);
      req.query = validated;
      next();
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: err.errors ? err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        })) : []
      });
    }
  };
}
