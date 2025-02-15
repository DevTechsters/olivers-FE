import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import Button from '@mui/material/Button';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutCall = () => {
    dispatch(logout());
    navigate("/");
  }

  return (
    <nav className='z-50 border-b border-[#e5e7eb] bg-white shadow-sm'>
      <div className='flex justify-between items-center h-16 px-8'>
        <div className='flex items-center space-x-4'>
          <NavLink 
            to="/home" 
            className='flex items-center space-x-3 group no-underline'
          >
            <div className='p-2 rounded-lg bg-[#f3f4f6]'>
              <svg 
                className='w-7 h-7 text-[#1d4ed8]'
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className='text-2xl font-semibold text-[#111827] tracking-tight font-inter'>
              OLIVERS
             
            </span>
          </NavLink>
        </div>
        
        <div className='flex items-center gap-4'>
          <Button 
            component={NavLink} 
            to="/audit"
            className='!font-medium !rounded-md !px-5 !py-2 !transition-all
              !bg-transparent !text-[#374151] !hover:bg-[#f3f4f6]
              !border !border-[#e5e7eb] hover:!border-[#d1d5db]'
          >
            Audit Logs
          </Button>
          
          <Button 
            component={NavLink} 
            to="/upload"
            className='!font-medium !rounded-md !px-5 !py-2 !transition-all
              !bg-[#1d4ed8] !text-white hover:!bg-[#1e40af]
              !shadow-sm hover:!shadow-md'
          >
            Upload
          </Button>
          
          <Button 
            onClick={logoutCall} 
            className='!font-medium !rounded-md !px-5 !py-2 !transition-all
              !bg-transparent !text-[#6b7280] hover:!bg-[#f3f4f6]
              hover:!text-[#1f2937]'
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Header;