// src/GalleryUploader.js
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { FaTimes } from 'react-icons/fa';

const GalleryUploader = ({ onDrop, files, removeFile }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  return (
    <div {...getRootProps()} className="border border-light p-3">
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
      <div className="d-flex flex-wrap mt-3">
        {files.map((file, index) => (
          <div key={index} className="position-relative me-2">
            <img
              src={URL.createObjectURL(file)}
              alt={`Preview ${index + 1}`}
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
            <button
              onClick={() => removeFile(index)}
              className="position-absolute top-0 end-0 btn btn-light btn-sm rounded-circle"
              style={{ zIndex: 1 }}
            >
              <FaTimes color="red" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryUploader;
