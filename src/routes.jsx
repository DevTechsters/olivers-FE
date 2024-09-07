// src/routes.js
import React from 'react';
import { createBrowserRouter, RouterProvider ,Navigate} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import Upload from './pages/Upload';

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = useSelector((store)=>store.auth.isAuthenticated)

  console.log(isAuthenticated )

  return isAuthenticated ? element : <Navigate to="/" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/home",
    element: <ProtectedRoute element={<Home/>} />,
  },
  {
    path: "/upload",
    element: <ProtectedRoute element={<Upload/>} />,
  },
]);

const AppRouter = () => (
  <RouterProvider router={router} />
);

export default AppRouter;
