import { useState } from 'react';
import { motion } from 'framer-motion';

const FileUpload = ({ onFileSelect, multiple = true, accept = "*" }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
    onFileSelect(droppedFiles);
  };

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    onFileSelect(selectedFiles);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`border-2 border-dashed rounded-lg p-6 text-center ${
        dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer text-blue-500 hover:text-blue-600"
      >
        <div className="space-y-2">
          <div className="text-4xl">📄</div>
          <p>Drag and drop files here or click to select</p>
          {files.length > 0 && (
            <p className="text-sm text-gray-500">
              {files.length} file(s) selected
            </p>
          )}
        </div>
      </label>
    </motion.div>
  );
};

export default FileUpload;