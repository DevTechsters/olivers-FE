import React from 'react'

function Fallback({errorMessage}) {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold text-red-600">Something Went Wrong</h1>
                <p className="mt-4 text-gray-600">{errorMessage}</p>
                <button
                    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => window.location.reload()}
                >
                    Refresh Page
                </button>
            </div>
        </div>
    )
}

export default Fallback