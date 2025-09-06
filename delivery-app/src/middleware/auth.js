import responseHelpers from "../utils/responseHelpers";

const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  responseHelpers.unauthorizedResponse(
    res,
    "requireAuth: Error: authentication required!"
  );
};

export default requireAuth;
