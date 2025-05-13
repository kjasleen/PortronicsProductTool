const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../Utils/Cloudinary');
const path = require('path'); 

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'PortronicsTaskDocs',
    resource_type: 'raw', // important for non-image files
    public_id: (req, file) => {
      const originalName = path.parse(file.originalname).name;
      return `${Date.now()}-${originalName}`;
    }
  }
});

const upload = multer({ storage:storage });

module.exports = upload;
