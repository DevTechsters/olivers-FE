import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button from '@mui/material/Button';
import Header from '../components/Header';
import axios from 'axios';
import { toast } from 'react-toastify';
import { handleApiError } from "../helpers/errorHandler";


const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setError(null);
        toast.info(`File selected: ${acceptedFiles[0].name}`);
      } else {
        setError('Invalid file type. Please upload a valid Excel file.');
      }
    },
  });



  const handleUpload = async () => {
    if (!file) {
      setError('No file selected');
      toast.error('No file selected');
      return;
    }
  
    setUploading(true);
    setError(null);
    setSuccess(null);
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post('http://localhost:8081/api/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // Required if session-based authentication is used
      });
  
      setSuccess('File uploaded successfully');
      toast.success(`File uploaded successfully by ${response.data.uploadedBy}`);
    } catch (err) {
            handleApiError(err)
      
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <>
      <Header title="Upload File" />
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-6 rounded-lg shadow-lg w-2/4 bg-white">
          <h3 className="text-2xl font-bold m-4">Upload File</h3>
          <div className="flex items-center justify-center">
            <div
              {...getRootProps({
                className: 'dropzone',
              })}
              style={{
                border: '2px dashed #cccccc',
                borderRadius: '4px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: '#f9f9f9',
                width: '90%',
              }}
            >
              <input {...getInputProps()} />
              <CloudUploadIcon fontSize="large" />
              <p>Drag & drop an Excel file here, or click to select one</p>
              {file && <p>Selected file: {file.name}</p>}
            </div>
          </div>
          <div className="m-2 mt-4 flex justify-end space-x-2">
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => setFile(null)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
          {error && <p className="mt-4 text-red-500">{error}</p>}
          {success && <p className="mt-4 text-green-500">{success}</p>}
        </div>
      </div>
    </>
  );
};

export default FileUpload;
