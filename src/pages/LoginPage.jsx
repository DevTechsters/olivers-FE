import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import { toast } from 'react-toastify';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';

const { Title, Text } = Typography;

const LoginPage = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('http://localhost:8081/api/users/signin', {
        username: values.username,
        password: values.password,
      }, {
        withCredentials: true
      });

      localStorage.setItem('username', response.data.username);
      dispatch(login({ username: response.data.username }));
      toast.success("Logged in successfully");
      navigate("/home");
    } catch (error) {
      if (error.response) {
        const { message, status, path } = error.response.data || {};
        setErrorMessage(`${message || 'Error'} (Status: ${status || 'Unknown'} at ${path || 'Unknown path'})`);
      } else if (error.request) {
        setErrorMessage('No response received');
      } else {
        setErrorMessage('Error setting up the request');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg" bordered={false}>
        <Title level={2} className="text-center">Login</Title>
        {errorMessage && <Alert message={errorMessage} type="error" showIcon className="mb-4" />}
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please enter your username' }]}> 
            <Input value={username} onChange={(e) => setUsername(e.target.value)} />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password' }]}> 
            <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Login</Button>
        </Form>
        {/* <Text className='block text-center mt-2'>Don't have an account? <Link to="/signup">Signup</Link></Text> */}
      </Card>
    </div>
  );
};

export default LoginPage;