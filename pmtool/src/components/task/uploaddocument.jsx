import React, { useState } from "react";

const UploadDocument = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file && onUpload) {
      onUpload(file);
      setFile(null);
    }
  };

  return (
    <div className="flex items-center space-x-2 mt-2">
      <input
        type="file"
        onChange={handleChange}
        className="text-sm"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
      >
        Upload
      </button>
    </div>
  );
};

export default UploadDocument;
