// components/task/ApproveButton.js
import React from 'react';

const ApproveButton = ({ task }) => {
  return task.needsApproval ? (
    <button className="bg-blue-500 text-black py-2 px-4 rounded mt-2">
      Approve
    </button>
  ) : null;
};

export default ApproveButton;
