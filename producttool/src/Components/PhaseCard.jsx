import React, { useState } from 'react';
import TaskList from './TaskList';
import HttpService from '../Utils/HttpService';

const PhaseCard = ({ phase, onRefresh, onEditTask, onNewTask }) => {
  const [expanded, setExpanded] = useState(false);
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const data = await HttpService.get(`/api/tasks/phase/${phase._id}`);
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const toggleExpanded = async () => {
    if (!expanded) await fetchTasks();
    setExpanded(!expanded);
  };

  const handleDeletePhase = async () => {
    const confirmed = window.confirm(`Delete phase "${phase.name}"?`);
    if (!confirmed) return;

    try {
      await HttpService.delete(`/api/phases/${phase._id}`);
      onRefresh();
    } catch (err) {
      console.error('Error deleting phase:', err);
      alert('Failed to delete phase');
    }
  };

  return (
    <div className="mb-4 border border-blue-200 rounded-lg shadow-sm">
      <div
        className="p-4 cursor-pointer bg-blue-50 hover:!bg-blue-100 transition-colors duration-200 rounded-t-lg"
        onClick={toggleExpanded}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold !text-blue-800">{phase.name}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeletePhase();
            }}
            className="!text-red-500 text-sm hover:underline"
          >
            Delete
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-4 !bg-white border-t !border-blue-200 transition-all duration-300 ease-in-out">
          <TaskList
            tasks={tasks}
            phaseId={phase._id}
            onRefresh={fetchTasks}
            onTaskEdit={(task) => onEditTask(task, phase._id, fetchTasks)}
            onNewTask={() => onNewTask(phase._id, fetchTasks)}
          />
        </div>
      )}
    </div>
  );
};


export default PhaseCard;
