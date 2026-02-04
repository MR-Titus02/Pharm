import bcrypt from "bcryptjs";

// Middleware to hash password before saving user
export const hashPassword = async (req, res, next) => {
  try {
    if (!req.body.password) {
      return next(); // no password to hash
    }

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    next(); // continue to controller
  } catch (err) {
    next(err); // pass error to Express
  }
};
