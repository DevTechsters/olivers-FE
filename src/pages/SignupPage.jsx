import React, { useState } from 'react';
import axios from 'axios';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [passkey, setPasskey] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await axios.post('/api/users/signup', {
        username,
        password,
        passkey,
      });

      setSuccessMessage('User registered successfully!');
      setUsername('');
      setPasskey('');
      setPassword('');
    } catch (error) {
      if (error.response) {
        // Assuming the backend sends an error message in the response body
        setErrorMessage('Signup failed: ' + (error.response.data || 'Something went wrong'));
      } else if (error.request) {
        setErrorMessage('No response from the server. Please try again later.');
      } else {
        setErrorMessage('An error occurred: ' + error.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        {/* Centered success message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
            {successMessage}
          </div>
        )}

        {/* Centered error message */}
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
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="passkey">
              Passkey
            </label>
            <input
              type="text"
              id="passkey"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
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
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
