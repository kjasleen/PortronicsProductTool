import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HttpService from '../Utils/HttpService';
import PhaseCard from './../Components/PhaseCard';
import TaskFormModal from './../Components/TaskFormModal';

const ProductPhases = () => {
  const { id } = useParams();
  const [phases, setPhases] = useState([]);
  const [newPhase, setNewPhase] = useState('');
  const [taskToEdit, setTaskToEdit] = useState(null); // for edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhaseId, setCurrentPhaseId] = useState(null);
  const [taskRefetchFn, setTaskRefetchFn] = useState(() => () => {});

  const handleEditTask = (task, phaseId, refetchTasks) => {
    setTaskToEdit(task);
    setCurrentPhaseId(phaseId);
    setTaskRefetchFn(() => refetchTasks); // wrap in function
    setIsModalOpen(true);
  };
  
  const handleNewTask = (phaseId, refetchTasks) => {
    setTaskToEdit(null);
    setCurrentPhaseId(phaseId);
    setTaskRefetchFn(() => refetchTasks); // wrap in function
    setIsModalOpen(true);
  };
  

  const fetchPhases = async () => {
    const data = await HttpService.get(`/api/phases/${id}`);
    setPhases(data);
  };

  useEffect(() => { fetchPhases(); }, [id]);

  const handleAddPhase = async () => {
    if(newPhase.length ==0)
    {
      alert("Please enter the name for the phase !");
      return;
    }

    await HttpService.post(`/api/phases/create`, { name: newPhase, productId: id });
    setNewPhase('');
    fetchPhases();
  };

  /*const handleEditTask = (task, phaseId) => {
    setTaskToEdit(task);
    setCurrentPhaseId(phaseId);
    setIsModalOpen(true);
  };

  const handleNewTask = (phaseId) => {
    setTaskToEdit(null);
    setCurrentPhaseId(phaseId);
    setIsModalOpen(true);
  };*/

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 !text-blue-900">Phases for Product ID: {id}</h2>

      <div className="mb-6 flex gap-2">
        <input
          value={newPhase}
          onChange={e => setNewPhase(e.target.value)}
          placeholder="New Phase"
          className="border !border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:!ring-blue-400"
        />
        <button
          onClick={handleAddPhase}
          className="!bg-blue-600 !text-white px-4 py-2 rounded hover:!bg-blue-700 transition"
        >
          + Add Phase
        </button>
      </div>

      {phases.map(phase => (
        <PhaseCard
          key={phase._id}
          phase={phase}
          onRefresh={fetchPhases}
          onEditTask={(task, phaseId, refetchTasks) => handleEditTask(task, phaseId, refetchTasks)}
          onNewTask={(phaseId, refetchTasks) => handleNewTask(phaseId, refetchTasks)}
        />
      ))}

      {isModalOpen && (
        <TaskFormModal
          task={taskToEdit}
          phaseId={currentPhaseId}
          onClose={() => setIsModalOpen(false)}
          onRefresh={taskRefetchFn}
        />
      )}
    </div>
  );
};

export default ProductPhases;
