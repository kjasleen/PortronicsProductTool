import React, { useState } from 'react';
import TaskList from './TaskList';
import HttpService from '../Utils/HttpService';

const PhaseCard = ({ phase, onRefresh, onEditTask, onNewTask }) => {
  const [expanded, setExpanded] = useState(false);
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const data = await HttpService.get(`http://localhost:5000/api/tasks/phase/${phase._id}`);
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const toggleExpanded = async () => {
    if (!expanded) {
      await fetchTasks();
    }
    setExpanded(!expanded);
  };

  const handleDeletePhase = async () => {
    const confirmed = window.confirm(`Delete phase "${phase.name}"?`);
    if (!confirmed) return;

    try {
      await HttpService.delete(`http://localhost:5000/api/phases/${phase._id}`);
      onRefresh(); // Refresh the phase list
    } catch (err) {
      console.error('Error deleting phase:', err);
      alert('Failed to delete phase');
    }
  };

  return (
    <div className="mb-4 border border-gray-300 rounded">
      <div
        className="p-4 cursor-pointer bg-gray-100 hover:bg-gray-200"
        onClick={toggleExpanded}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{phase.name}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent collapsing when clicking delete
              handleDeletePhase();
            }}
            className="text-red-600 text-sm hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
  
      {expanded && (
        <div className="p-4 bg-white border-t border-gray-300 transition-all duration-300 ease-in-out">
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
