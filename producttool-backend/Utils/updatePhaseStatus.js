const Task = require('../Models/task');
const Phase = require('../Models/phase');
const updateProductStatus = require('../Utils/updateProductStatus');

async function updatePhaseStatus(phaseId) {
  const phase = await Phase.findById(phaseId);
  if (!phase) return;

  const tasks = await Task.find({ phase: phaseId });
  const allCompleted = tasks.length > 0 && tasks.every(task => task.status === 'Completed');

  phase.status = allCompleted ? 'Completed' : 'Ongoing';
  await phase.save();

  await updateProductStatus(phase.product); // Update parent product
}

module.exports = updatePhaseStatus;
