import React, { useState } from 'react';
import { Upload, Button, Typography, Progress, message, Space, Card } from 'antd';
import { UploadOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import Header from '../components/Header';
import axios from 'axios';
import { handleApiError } from "../helpers/errorHandler";
import styled from 'styled-components';

const { Title, Text } = Typography;

const StyledCard = styled(Card)`
  width: 80%;
  max-width: 600px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const UploadContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
`;

const StyledUpload = styled(Upload.Dragger)`
  .ant-upload {
    padding: 24px;
  }
  
  &.ant-upload-drag {
    border: 2px dashed #d9d9d9;
    border-radius: 8px;
    background: #fafafa;
    transition: all 0.3s;
  }
  
  &.ant-upload-drag:hover {
    border-color: #1890ff;
  }
  
  &.ant-upload-drag-uploading {
    border-color: #1890ff;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
`;

const MessageContainer = styled.div`
  margin-top: 16px;
`;

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);

  const beforeUpload = (file) => {
    const isExcel = 
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
      file.type === 'application/vnd.ms-excel';
    
    if (!isExcel) {
      message.error('You can only upload Excel files!');
    } else {
      setFile(file);
      setIsUploaded(false);
      message.info(`File selected: ${file.name}`);
    }
    
    return false;
  };

  const handleUpload = async () => {
    if (!file) {
      message.error('No file selected');
      return;
    }
  
    setUploading(true);
    setSuccess(null);
    setUploadProgress(0);
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post('http://localhost:8081/api/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
  
      setSuccess(`File uploaded successfully by ${response.data.uploadedBy}`);
      setIsUploaded(true);
      message.success(`File uploaded successfully by ${response.data.uploadedBy}`);
    } catch (err) {
      handleApiError(err);
    } finally {
      setUploading(false);
    }
  };
  
  const handleRemove = () => {
    setFile(null);
    setSuccess(null);
    setUploadProgress(0);
    setIsUploaded(false);
  };
  
  return (
    <>
      <Header title="Upload File" />
      <UploadContainer>
        <StyledCard>
          <Title level={4} style={{ textAlign: 'center', marginBottom: 24 }}>
            Upload Your Excel File
          </Title>
          
          <StyledUpload
            name="file"
            multiple={false}
            showUploadList={false}
            beforeUpload={beforeUpload}
            fileList={file ? [file] : []}
            className={uploading ? 'ant-upload-drag-uploading' : ''}
          >
            <p className="ant-upload-drag-icon">
              {isUploaded ? <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 48 }} /> : 
               file ? <CheckCircleOutlined style={{ color: '#1890ff', fontSize: 48 }} /> : 
                     <UploadOutlined style={{ color: '#1890ff', fontSize: 48 }} />}
            </p>
            <p className="ant-upload-text">
              {isUploaded ? 'File uploaded successfully' :
               file ? 'File ready for upload' : 
                     'Click or drag an Excel file to this area'}
            </p>
            <p className="ant-upload-hint">
              {!file && 'Support for Excel files (.xlsx, .xls)'}
            </p>
          </StyledUpload>
          
          {file && (
            <div style={{ marginTop: 16 }}>
              <Card size="small" style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <Space>
                    <Text strong>{file.name}</Text>
                    <Text type="secondary">({(file.size / 1024).toFixed(1)} KB)</Text>
                  </Space>
                  <Button 
                    type="text" 
                    icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />} 
                    onClick={handleRemove}
                    disabled={uploading}
                  />
                </div>
              </Card>
            </div>
          )}
          
          {uploading && (
            <div style={{ marginTop: 16 }}>
              <Progress percent={uploadProgress} status="active" />
            </div>
          )}
          
          <ActionContainer>
            <Space>
              <Button
                onClick={handleRemove}
                disabled={uploading || !file}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleUpload}
                disabled={uploading || !file || isUploaded}
                loading={uploading}
                icon={<UploadOutlined />}
              >
                {uploading ? 'Uploading' : 'Upload'}
              </Button>
            </Space>
          </ActionContainer>
          
          {success && (
            <MessageContainer>
              <Text type="success" style={{ display: 'block', textAlign: 'center' }}>
                {success}
              </Text>
            </MessageContainer>
          )}
        </StyledCard>
      </UploadContainer>
    </>
  );
};

export default FileUpload;