const Task = require('../Models/task');
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
