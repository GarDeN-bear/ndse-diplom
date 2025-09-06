export const successResponse = (
  res,
  data = null,
  statusCode = 200,
  message = "Success"
) => {
  return res.status(statusCode).json({
    status: "ok",
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const errorResponse = (
  res,
  message = "Internal Server Error",
  statusCode = 500,
  errors = null
) => {
  const response = {
    status: "error",
    message,
    timestamp: new Date().toISOString(),
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

export const notFoundResponse = (res, resource = "Resource") => {
  return errorResponse(res, `${resource} not found`, 404);
};

export const validationErrorResponse = (
  res,
  message = "Validation failed",
  errors
) => {
  return errorResponse(res, message, 422, errors);
};

export const unauthorizedResponse = (res, message = "Unauthorized") => {
  return errorResponse(res, message, 401);
};

export const forbiddenResponse = (res, message = "Forbidden") => {
  return errorResponse(res, message, 403);
};

export const duplicateEntryResponse = (res, message = "Duplicate") => {
  return errorResponse(res, message, 409);
};

export default responseHelper = {
  successResponse,
  errorResponse,
  notFoundResponse,
  validationErrorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  duplicateEntryResponse,
};
