import AppError from "../utils/AppError.js";

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error.name === 'ZodError') {
      const errorMessages = error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
      return next(new AppError(`Validation failed: ${errorMessages}`, 400));
    }
    return next(error);
  }
};

export default validate;
