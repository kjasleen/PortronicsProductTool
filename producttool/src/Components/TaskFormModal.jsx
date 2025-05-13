import React, { useState, useEffect } from 'react';
import HttpService from '../Utils/HttpService';

const TaskFormModal = ({ phaseId, task, onClose, onRefresh }) => {
  const [name, setName] = useState('');
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState('');
  const [needsApproval, setNeedsApproval] = useState(false);
  const [approvalRequested, setApprovalRequested] = useState(false);
  const [createdAt, setCreatedAt] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');

  // Get user role directly from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  console.log("USerRole in TaskFormModal - ", user);
  const userRole = user?.role || 'Guest';
  const [selectedFile, setSelectedFile] = useState(null);

 

  useEffect(() => {
    console.log("TaskFormModel - Task param", task);
    if (task) {
      setName(task.name || '');
      setEstimatedCompletionDate(task.estimatedCompletionDate ? task.estimatedCompletionDate.substring(0, 16) : '');
      setNeedsApproval(task.needsApproval || false);
      setApprovalRequested(task.approvalRequested || false);
      setCreatedAt(task.createdAt || '');
      setDocumentUrl(task.documentUrl || '');
    }
  }, [task]);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('phaseId', phaseId);
    formData.append('estimatedCompletionDate', estimatedCompletionDate);
    formData.append('needsApproval', needsApproval);
    formData.append('approvalRequested', approvalRequested);
    if (selectedFile) 
      formData.append('document', selectedFile);

    try {
      if (task) {
        console.log("Saving task:", formData); // Log payload

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

  const handleApprovalAction = () => {
    if (userRole === 'Admin') {
      setApprovalRequested(false);
      // Optional: show confirmation
    } else {
      setApprovalRequested(true);
      // Optional: show "Approval Requested"
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setSelectedFile(file);
    } else {
      alert("File must be less than 5MB");
    }
  };
  
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)]  flex justify-center items-center z-50">
     <div className="bg-white p-8 rounded-lg w-[30rem] shadow-2xl text-lg">
     <h3 className="text-2xl font-bold mb-6">{task ? 'Edit Task' : 'Add Task'}</h3>

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

        <label className="block mb-2">
          <input
            type="checkbox"
            checked={needsApproval}
            onChange={(e) => setNeedsApproval(e.target.checked)}
            className="mr-2"
          />
          Requires Approval
        </label>

        {needsApproval && (
          <div className="mb-2">
            {userRole === 'Admin' && approvalRequested ? (
              <button
                onClick={handleApprovalAction}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Approve
              </button>
            ) : userRole !== 'Admin' && !approvalRequested ? (
              <button
                onClick={handleApprovalAction}
                className="bg-yellow-500 text-black px-3 py-1 rounded"
              >
                Request Approval
              </button>
            ) : (
              <p className="text-sm text-gray-600">Approval status pending.</p>
            )}
          </div>
        )}

        {['Admin', 'Finance'].includes(userRole) && (
          <div className="mb-2">
            <div className="mb-4">
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded inline-block"
              >
                Upload supporting document
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              {selectedFile && (
                <p className="text-sm text-gray-600 mt-2">Selected file: {selectedFile.name}</p>
              )}
            </div>

          </div>
        )}

        {['Admin', 'Finance'].includes(userRole) && documentUrl && (
          <div className="mb-2">
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Download Attached File
            </a>
          </div>
        )}

        {createdAt && (
          <div className="text-sm text-gray-600 mb-2">
            Created At: {new Date(createdAt).toLocaleString()}
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <button onClick={handleSave} className="bbg-gray-300 px-4 py-2 rounded">
            Save
          </button>
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskFormModal;
