import React from 'react';
import HttpService from '../Utils/HttpService';

const TaskList = ({ tasks, phaseId, onRefresh, onTaskEdit, onNewTask }) => {
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

  return (
    <div>
      {/* New Task Button */}
      <button
        onClick={() => onNewTask && onNewTask(phaseId)}
        className="!bg-blue-600 !text-white px-4 py-2 rounded hover:!bg-blue-700 transition"
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
              <p className="font-semibold text-blue-800">{task.name}</p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleEdit(task)}
                  className="!bg-yellow-400 !text-black px-3 py-1 rounded hover:!bg-yellow-500 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="!bg-red-500 !text-white px-3 py-1 rounded hover:!bg-red-600 transition"
                >
                  Delete
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
