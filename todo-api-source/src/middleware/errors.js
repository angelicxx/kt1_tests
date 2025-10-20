export function notFound(req, res, next) {
  res.status(404).json({ error: 'NotFound', message: 'Resource not found' });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'InternalServerError', message: 'Something went wrong' });
}
