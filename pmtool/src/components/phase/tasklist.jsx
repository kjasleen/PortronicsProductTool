// components/phase/TaskList.js
import React from 'react';
import TaskItem from '../task/taskitem';

const TaskList = ({ tasks }) => {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-2">Tasks</h4>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
