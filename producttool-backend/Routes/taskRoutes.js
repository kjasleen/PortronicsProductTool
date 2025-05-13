const express = require('express');
const router = express.Router();
const upload = require('../Middleware/upload');  // Ensure this is set up correctly
const taskController = require('../Controllers/taskController');
const { authMiddleware, allowRoles } = require('../Middleware/authMiddleware');
const handleMulterErrors = require('../Middleware/multerErrorHandler');

// Route for deleting a task (restricted to Admin)
router.delete(
  '/:taskId',
  authMiddleware,
  allowRoles(['Admin']),
  taskController.deleteTask
);

// Route for uploading task document (restricted to Finance and Admin roles)
router.post(
  '/:taskId/upload', 
  authMiddleware, 
  allowRoles(['Finance', 'Admin']), 
  handleMulterErrors(upload.single('document')),   // Middleware for handling file uploads
  taskController.uploadTaskDocument  // Your controller for handling document upload
);

// Route for getting tasks by phase
router.get('/phase/:phaseId', authMiddleware, taskController.getTasksByPhase);

// Route for creating tasks (restricted to Admin)
router.post(
  '/create', 
  authMiddleware, 
  allowRoles(['Admin']), 
  upload.single('document'),  // File upload for task creation
  taskController.createTask  // Controller for creating tasks
);

router.put(
  '/:id',
  authMiddleware,
  allowRoles(['Admin', 'Finance']),
  handleMulterErrors(upload.single('document')), // same field name as in formData
  taskController.updateTask
);

// Route for updating task status (restricted to Admin)
router.patch('/update/:taskId/status', authMiddleware, allowRoles(['Admin']), taskController.updateTaskStatus);

// Route for asking task approval (restricted to Finance and Vendor)
router.post('/:taskId/ask-approval', authMiddleware, allowRoles(['Finance', 'Vendor']), taskController.askForApproval);

// Route for approving tasks (restricted to Admin)
router.post('/:taskId/approve', authMiddleware, allowRoles(['Admin']), taskController.approveTask);

module.exports = router;

