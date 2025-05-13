// middleware/multerErrorHandler.js
const multer = require('multer');

const handleMulterErrors = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
     
      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        return res.status(400).json({ message: `Multer Error: ${err.message}` });
      } else if (err) {
        console.error('Unknown upload error:', err);
        return res.status(500).json({ message: `Upload Error: ${err.message}` });
      }
      next();
    });
  };
};

module.exports = handleMulterErrors;
