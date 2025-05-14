import React from 'react';
import HttpService from '../Utils/HttpService';

const TaskList = ({ tasks, phaseId, onRefresh, onTaskEdit, onNewTask }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user?.role || 'Guest';

  const handleEdit = (task) => {
    if (typeof onTaskEdit === 'function') {
      onTaskEdit(task);
    } else {
      console.warn('onTaskEdit is not defined');
    }
  };

  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (confirmDelete) {
      try {
        await HttpService.delete(`http://localhost:5000/api/tasks/${taskId}`);
        if (onRefresh) onRefresh(); // Refresh task list after deletion
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  };

  const handleMarkAsComplete = async (task) => {
    try {
      await HttpService.put(`http://localhost:5000/api/tasks/${task._id}`, {
        ...task,
        completed: true,
        status: 'Completed'
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error marking task as completed:', err);
    }
  };

  return (
    <div>
      {/* New Task Button */}
      <button
        onClick={() => onNewTask && onNewTask(phaseId)}
        className="!bg-cyan-500 !text-white px-4 py-2 rounded hover:!bg-blue-700 transition"
      >
        + New Task
      </button>

      {/* Task List */}
      <div className="mt-4 space-y-3">
        {tasks.length === 0 ? (
          <p className="!text-blue-500">No Tasks added yet</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="border border-blue-200 bg-blue-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header Row: Task Name and Status */}
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold text-blue-800">{task.name}</p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold !text-white
                    ${task.status === 'Ongoing' ? 'bg-yellow-500' :
                      task.status === 'Approval Pending' ? 'bg-orange-500' :
                      task.status === 'Approved' ? 'bg-green-600' :
                      task.status === 'Completed' ? 'bg-blue-600' :
                      'bg-gray-400'}`}
                >
                  {task.status}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-3 flex-wrap">
                <button
                  onClick={() => handleEdit(task)}
                  className="!bg-teal-400 !text-white px-4 py-2 rounded hover:!bg-teal-500 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="!bg-teal-400 !text-white px-4 py-2 rounded hover:!bg-teal-500 transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleMarkAsComplete(task)}
                  disabled={task.completed || (task.approvalRequested && !task.approved)}
                  className={`px-4 py-2 rounded text-white transition
                    ${task.completed || (task.approvalRequested && !task.approved)
                      ? '!bg-gray-400 cursor-not-allowed'
                      : '!bg-purple-400 hover:!bg-purple-500'
                    }`}
                >
                  {task.completed ? 'Completed' : 'Mark as Completed'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
