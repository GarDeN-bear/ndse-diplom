const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    error: "requireAuth: Error: authentication required!",
    status: "error",
  });
};

export default requireAuth;
