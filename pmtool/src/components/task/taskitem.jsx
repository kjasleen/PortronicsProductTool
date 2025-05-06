// components/task/TaskItem.js
import React from 'react';
import ApproveButton from './approvebutton';

const TaskItem = ({ task }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h4 className="font-semibold">{task.name}</h4>
      <p>{task.description}</p>
      <ApproveButton task={task} />
    </div>
  );
};

export default TaskItem;
