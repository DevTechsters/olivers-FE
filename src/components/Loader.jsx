import { CircularProgress } from '@mui/material';
import React from 'react';

export default function Loader({ fullScreen = true, withLogo = true }) {
  return (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : 'min-h-[200px]'} bg-white/90 space-y-4`}>
      {withLogo && (
        <div className="mb-8 animate-fade-in">
          <svg 
            className="w-12 h-12 text-[#1d4ed8]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
      )}
      
      <div className="relative">
        <CircularProgress 
          size={60}
          thickness={4}
          sx={{
            color: '#1d4ed8',
            animationDuration: '800ms',
            position: 'relative'
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[#1d4ed8] text-sm font-medium animate-pulse">
            Processing...
          </span>
        </div>
      </div>

      {fullScreen && (
        <div className="mt-8 space-y-2 text-center animate-delayed-fade-in">
          <p className="text-sm text-gray-600 font-medium">
            Secured Connection · AES-256 Encrypted
          </p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-xs text-gray-500">
              Authenticating with enterprise-grade security
            </p>
          </div>
        </div>
      )}
    </div>
  );
}