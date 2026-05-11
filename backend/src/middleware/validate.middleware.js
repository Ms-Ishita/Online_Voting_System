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
    const errorMessages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
    return next(new AppError(`Validation failed: ${errorMessages}`, 400));
  }
};

export default validate;
