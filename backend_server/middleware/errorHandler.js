
function errorHandler(err, req, res, next) {
    console.error(err.stack);
  
        const statusCode = err.statusCode || 500;
  
    res.status(statusCode).json({
      success: false,
      message: err.message || "An unknown error occurred",
      stack: process.env.NODE_ENV === "production" ? null : err.stack, // Hide stack trace in production
    });
  };
  
  module.exports = errorHandler;
  