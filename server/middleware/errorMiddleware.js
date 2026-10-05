export function errorHandler(err, req, res, next) {
  console.error('Unhandled server error:', err);

  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' && status === 500
    ? 'An unexpected internal server error occurred'
    : err.message || 'Server error';

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
}
