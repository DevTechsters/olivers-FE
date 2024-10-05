// src/routes.js
import React from 'react';
import { createBrowserRouter, RouterProvider ,Navigate} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import Upload from './pages/Upload';
import ErrorBoundary from './components/ErrorBoundary';

const ProtectedRoute = ({ element }) => {

  const isAuthenticated = sessionStorage.getItem("user")

  return isAuthenticated ? element : <Navigate to="/" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element:<ErrorBoundary> <LoginPage /></ErrorBoundary>,
  },
  {
    path: "/signup",
    element: <ErrorBoundary><SignupPage /></ErrorBoundary>,
  },
  {
    path: "/home",
    element:<ErrorBoundary><ProtectedRoute element={<Home/>} /> </ErrorBoundary>,
  },
  {
    path: "/upload",
    element:<ErrorBoundary> <ProtectedRoute element={<Upload/>} /></ErrorBoundary>,
  },
]);

const AppRouter = () => (
  <RouterProvider router={router} />
);

export default AppRouter;
