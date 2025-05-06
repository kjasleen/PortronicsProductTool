import React from 'react';

const TaskList = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return <p className="text-gray-500">No tasks available.</p>;
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="p-4 border rounded shadow-sm bg-white">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-semibold">{task.name}</h4>
            <span className={`text-sm px-2 py-1 rounded ${task.status === 'Approved' ? 'bg-green-200 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {task.status}
            </span>
          </div>
          <div className="text-sm text-gray-600">Due: {task.dueDate}</div>
          <div className="mt-2 flex space-x-4">
            <button className="text-blue-600 underline">Upload Document</button>
            <button className="text-green-600 underline">Approve</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
