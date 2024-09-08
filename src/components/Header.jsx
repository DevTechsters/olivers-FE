import React from 'react'
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';

function Header() {
  return (
   <nav className='z-50'>
      <div className='h-8vh flex justify-between items-center py-3 px-14  border-b '>
        <div className='flex items-center flex-1'>
          <h2 className='text-3xl font-bold'>Olivers</h2>
        </div>
        <div>
          <ul className='flex gap-8 mr-16 text-[18px]'>
            <li className='hover:border-b-4'><NavLink to="/home">Home</NavLink></li>
            <li className='hover:border-b-4'><NavLink to="/upload">Upload</NavLink></li>
            <li><Button variant="contained">Logout</Button></li>
          </ul>
        </div>
      </div>
   </nav>
    
  )
}

export default Header