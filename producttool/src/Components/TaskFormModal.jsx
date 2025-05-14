import React, { useState, useEffect } from 'react';
import HttpService from '../Utils/HttpService';

const TaskFormModal = ({ phaseId, task, onClose, onRefresh }) => {
  const [name, setName] = useState('');
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState('');
  const [approvalRequested, setApprovalRequested] = useState(false);
  const [status, setStatus] = useState('Ongoing');
  const [approved, setApproved] = useState(false);
  const [createdAt, setCreatedAt] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [completed, setCompleted] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user?.role || 'Guest';

  useEffect(() => {
    if (task) {
      setName(task.name || '');
      setEstimatedCompletionDate(task.estimatedCompletionDate ? task.estimatedCompletionDate.substring(0, 16) : '');
      setApprovalRequested(task.approvalRequested || false);
      setStatus(task.status || 'Ongoing');
      setApproved(task.approved || false);
      setCreatedAt(task.createdAt || '');
      setDocumentUrl(task.documentUrl || '');
      setCompleted(task.completed || false);
    }
  }, [task]);

  const handleSave = async () => {
   /* let derivedStatus = 'Ongoing';
    if (approvalRequested && approved) {
      derivedStatus = 'Approved';
    } else if (approvalRequested) {
      derivedStatus = 'Approval Pending';
    } else if (completed) {
      derivedStatus = 'Completed';
    }*/

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phaseId', phaseId);
    formData.append('estimatedCompletionDate', estimatedCompletionDate);
    formData.append('approvalRequested', approvalRequested);
    formData.append('approved', approved);
    formData.append('completed', completed);
    formData.append('status', status);
    if (selectedFile) formData.append('document', selectedFile);

    try {
      if (task) {
        await HttpService.putFile(`http://localhost:5000/api/tasks/${task._id}`, formData);
      } else {
        await HttpService.postFile(`http://localhost:5000/api/tasks/create`, formData);
      }
      onRefresh();
      onClose();
    } catch (err) {
      console.error('Error saving task:', err);
    }
  };

  const handleApprovalToggle = () => {
    if (!approvalRequested) {
      setApprovalRequested(true);
      setStatus('Approval Pending');
    } else if (approvalRequested && userRole === 'Admin') {
      setApproved(true);
      setStatus('Approved');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setSelectedFile(file);
    } else {
      alert('File must be less than 5MB');
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-[30rem] shadow-2xl text-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">{task ? 'Edit Task' : 'Add Task'}</h3>
          {createdAt && (
            <div className="text-sm text-gray-600">
              Created At: {new Date(createdAt).toLocaleString()}
            </div>
          )}
        </div>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Task Name"
          className="border p-2 mb-2 w-full"
        />

        <label className="block mb-2">
          Estimated Completion Date:
          <input
            type="datetime-local"
            value={estimatedCompletionDate}
            onChange={(e) => setEstimatedCompletionDate(e.target.value)}
            className="border p-2 w-full mt-1"
          />
        </label>

        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleApprovalToggle}
            disabled={(approvalRequested && userRole !== 'Admin') || approved}
            className={`px-4 py-2 rounded transition !text-white ${
              approved
                ? '!bg-gray-400 cursor-not-allowed'
                : !approvalRequested
                ? '!bg-blue-400 hover:bg-blue-500'
                : userRole === 'Admin'
                ? '!bg-green-400 hover:bg-green-500'
                : '!bg-gray-400 cursor-not-allowed'
            }`}
          >
            {!approvalRequested ? 'Request Approval' : 'Approve'}
          </button>

          {['Admin', 'Finance'].includes(userRole) && (
            <>
              <label
                htmlFor="file-upload"
                className="cursor-pointer !bg-blue-500 !text-white px-4 py-2 rounded inline-block"
              >
                Upload Document
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              {selectedFile && (
                <p className="text-sm !text-gray-600 mt-1">Selected: {selectedFile.name}</p>
              )}
            </>
          )}
        </div>

        {['Admin', 'Finance'].includes(userRole) && documentUrl && (
          <div className="mb-2">
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="!text-blue-600 underline"
            >
              Download Attached File
            </a>
          </div>
        )}

        <div className="text-md mb-4">
          Status:{' '}
          <span
            className={`px-2 py-2 rounded !text-white ${
              status === 'Ongoing'
                ? '!bg-yellow-500'
                : status === 'Approval Pending'
                ? '!bg-orange-500'
                : status === 'Approved'
                ? '!bg-green-600'
                : status === 'Completed'
                ? '!bg-blue-600'
                : '!bg-gray-400'
            }`}
          >
            {status || 'Not set'}
          </span>
        </div>

        <div className="flex justify-end items-center mt-6 space-x-2">
        
          <button
            onClick={handleSave}
            className="!bg-blue-400 !text-white px-4 py-2 rounded hover:!bg-blue-500 transition"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="!bg-blue-400 !text-white px-4 py-2 rounded hover:!bg-blue-500 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskFormModal;
