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
        className="bg-blue-500 text-black px-3 py-1 rounded mt-4"
      >
        + New Task
      </button>

      {/* Task List */}
      <div className="mt-4">
        {tasks.length === 0 ? (
          <p>No Tasks added yet</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="border p-2 mb-2 rounded">
              <p className="font-semibold">{task.name}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(task)}
                  className="bg-yellow-500 text-black px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="bg-red-500 text-black px-2 py-1 rounded"
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
