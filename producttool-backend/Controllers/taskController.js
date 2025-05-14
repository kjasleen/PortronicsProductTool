const Task = require('../Models/task');
const updatePhaseStatus = require('../Utils/updatePhaseStatus');
const cloudinary = require('../Utils/Cloudinary');
// Create a new task


exports.createTask = async (req, res) => {
  const {
    name,
    phaseId,
    estimatedCompletionDate,
    approvalRequested,
    approved,
    completed, 
    status
  } = req.body;

  console.log("TaskController - CreateTask",JSON.stringify(req.body) );
  if (!name || !phaseId) {
    return res.status(400).json({ message: 'Task name and phaseId are required' });
  }

  try {
    let uploadedUrl = '';

    if (req.file) {
      // Upload file to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'tasks',
        resource_type: 'auto',
      });
      uploadedUrl = result.secure_url;
    }

    const task = await Task.create({
      name,
      phase: phaseId,
      status:status,
      estimatedCompletionDate: estimatedCompletionDate || null,
      approved: approved === 'true',
      approvalRequested: approvalRequested === 'true',
      completed:completed === 'true',
      documentUrl: uploadedUrl || undefined,
    });

    await updatePhaseStatus(phaseId);
    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ message: 'Failed to create task', error: err.message });
  }
};

exports.deleteTask = async(req, res) =>{

  try
  {
    const { taskId } = req.params;
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Update task status
exports.updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  if (!['Ongoing', 'Completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.status = status;
    await task.save();

    await updatePhaseStatus(task?.phase);
    res.json(task);
  } catch (err) {
    console.error('Error in updateTaskStatus:', err);
    res.status(500).json({ message: 'Failed to update task status', error: err.message });
  }
};

// Upload document for task
exports.uploadTaskDocument = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    task.documentUrl = req.file.path;
    await task.save();

    res.json({ message: 'Document uploaded successfully', task });
  } catch (err) {
    console.error('Error in uploadTaskDocument:', err);
    res.status(500).json({ message: 'Failed to upload document', error: err.message });
  }
};

// Request approval for a task
exports.askForApproval = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!task.needsApproval) {
      return res.status(400).json({ message: 'Task does not require approval' });
    }

    task.approved = false; // explicitly unapproved
    await task.save();

    res.json({ message: 'Approval request sent', task });
  } catch (err) {
    console.error('Error in askForApproval:', err);
    res.status(500).json({ message: 'Failed to request approval', error: err.message });
  }
};

// Approve a task
exports.approveTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!task.needsApproval) {
      return res.status(400).json({ message: 'Task does not require approval' });
    }

    task.approved = true;
    await task.save();

    res.json({ message: 'Task approved by Admin', task });
  } catch (err) {
    console.error('Error in approveTask:', err);
    res.status(500).json({ message: 'Failed to approve task', error: err.message });
  }
};

exports.getTasksByPhase = async (req, res) => {
  const { phaseId } = req.params;

  try {
    const tasks = await Task.find({ phase: phaseId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error('Error in getTasksByPhase:', err);
    res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  const { name, estimatedCompletionDate, approved, approvalRequested,completed, status } = req.body;
  const taskId = req.params.id;
  
  try {
    const updateFields = {
      name,
      estimatedCompletionDate,
      approved: approved === 'true',
      status:status,
      completed:completed,
      approvalRequested: approvalRequested === 'true',
    };

    console.log("updateTask", JSON.stringify(updateFields));

    // If a new file is uploaded, upload to Cloudinary and update documentUrl
    if (req.file) {
      console.log("Req File present", req.file);
    
      const result = await cloudinary.uploader.upload(req.file.path);

      console.log("Upload result ", result);
      updateFields.documentUrl = result.secure_url;
    }

    //console.log("Before update");
    const updatedTask = await Task.findByIdAndUpdate(taskId, updateFields, { new: true });

    if (!updatedTask) {
      console.log("Not found error");
      return res.status(404).json({ message: 'Task not found' });
    }

    //console.log("UPdated task ", updatedTask);
    res.status(200).json(updatedTask);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ message: 'Failed to update task', error: err.message });
  }
};


/*const Task = require('../Models/task');
const updatePhaseStatus = require('../Utils/updatePhaseStatus');

exports.createTask = async (req, res) => {
  const { name, phaseId, estimatedCompletionDate, needsApproval } = req.body;

  try {
    const task = await Task.create({
      name,
      phase: phaseId,
      estimatedCompletionDate,
      needsApproval
    });

    await updatePhaseStatus(phaseId); // Update phase after task added
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.status = status;
    await task.save();

    await updatePhaseStatus(task.phase); // Update phase after task status change
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadTaskDocument = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    task.documentUrl = req.file.path;
    await task.save();

    res.json({ message: 'Document uploaded', task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.askForApproval = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task || !task.needsApproval)
      return res.status(400).json({ message: 'Task does not require approval' });

    task.approved = false;
    await task.save();

    res.json({ message: 'Approval requested', task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task || !task.needsApproval)
      return res.status(400).json({ message: 'Task does not require approval' });

    task.approved = true;
    await task.save();

    res.json({ message: 'Task approved by Admin', task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
*/