export function notFoundHandler(req, res) {
  return res.status(404).json({
    error: {
      message: `Route not found: ${req.method} ${req.path}`
    }
  });
}
