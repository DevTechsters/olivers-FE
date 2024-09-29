import React from 'react';
import Button from '@mui/material/Button';
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const logoutCall = () => {
    dispatch(logout());
    navigate("/");
  }

  const saveCall = () => {
    // Add save functionality here
    console.log("Save functionality to be implemented.");
  }

  return (
    <nav className='z-50'>
      <div className='flex justify-between items-center h-16 px-8 border-b border-gray-300'>
        <div className='flex items-center flex-1'>
          {/* Styled NavLink for the organization name */}
          <NavLink 
            to="/home" 
            className='text-3xl font-bold text-gray-800 hover:text-blue-500 transition duration-200 no-underline'
          >
            Olivers
          </NavLink>
        </div>
        <div className='flex items-center gap-4'>
          {location.pathname === '/home' && (  // Conditionally render the Save button
            <Button 
              variant="contained" 
              color="primary" 
              onClick={saveCall} 
              className='bg-blue-600 text-white hover:bg-blue-700 transition duration-200'
            >
              Save
            </Button>
          )}
          <Button 
            variant="outlined" 
            color="primary" 
            component={NavLink} 
            to="/upload" 
            className='text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition duration-200 no-underline'
          >
            Upload
          </Button>
          <Button 
            variant="contained" 
            onClick={logoutCall} 
            className='bg-red-600 text-white hover:bg-red-700 transition duration-200'
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Header;
