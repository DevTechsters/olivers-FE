import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button from '@mui/material/Button';
import Header from '../components/Header';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || selectedFile.type === 'application/vnd.ms-excel')) {
      setFile(selectedFile);
    } else {
      alert('Please select a valid Excel file.');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('No file selected');
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
      });

      setSuccess('File uploaded successfully');
      console.log(response.data); // Optionally handle the result
    } catch (err) {
      setError('Error uploading file');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Header />
      <div className='flex justify-center items-center min-h-screen'>
        <div className="p-6 rounded-lg shadow-lg w-2/4 bg-white">
          <h3 className="text-2xl font-bold m-4">Upload File</h3>
          <div className='flex items-center justify-center'>
            <div
              {...getRootProps({ className: 'dropzone' })}
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
              <input
                {...getInputProps()}
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <CloudUploadIcon />
              <p>Drag & drop an Excel file here, or click to select one</p>
              {file && <p>Selected file: {file.name}</p>}
            </div>
          </div>
          <div className='m-2 mt-4 flex justify-end space-x-2'>
            <Button color='dark' variant="outlined">Cancel</Button>
            <Button
              variant="contained"
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
