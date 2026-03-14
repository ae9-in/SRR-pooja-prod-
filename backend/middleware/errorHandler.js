export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500

  res.status(statusCode).json({
    success: false,
    error: error.message || 'Internal server error.',
    name: error.name,
    stack: error.stack,
    details: error
  })
}
