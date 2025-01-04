import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:8081/api/users/signin', {
            username,
            password,
        }, {
            withCredentials: true  // Important: this allows cookies to be sent
        });

        // Store in localStorage or state management
        localStorage.setItem('username', response.data.username);
        
        // Update Redux state
        dispatch(login({ username: response.data.username }));
        
        toast.info("Logged in successfully");
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
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </button>
        </form>
        <p className='m-1 text-center'>Don't have an account? <Link to="/signup">Signup</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;
