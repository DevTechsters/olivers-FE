import { CircularProgress } from '@mui/material'
import React from 'react'

export default function Loader() {
  return (
    <div className='flex items-center justify-center min-h-screen'>
        <CircularProgress/>
    </div>
    
  )
}
