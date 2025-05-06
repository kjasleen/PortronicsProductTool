const express = require('express');
const router = express.Router();
const upload = require('../Middleware/upload');
const { uploadTaskDocument } = require('../Controllers/taskController');
const { authMiddleware, allowRoles } = require('../middleware/auth');

router.post(
  '/:taskId/upload',
  authMiddleware,
  allowRoles(['Finance', 'Admin']),
  upload.single('document'),
  uploadTaskDocument
);

router.post('/', authMiddleware, allowRoles(['Admin']), createTask);
router.patch('/:taskId/status', authMiddleware, allowRoles(['Admin']), updateTaskStatus);

const {
  askForApproval,
  approveTask
} = require('../Controllers/taskController');

router.post('/:taskId/ask-approval', authMiddleware, allowRoles(['Finance', 'Vendor']), askForApproval);
router.post('/:taskId/approve', authMiddleware, allowRoles(['Admin']), approveTask);
