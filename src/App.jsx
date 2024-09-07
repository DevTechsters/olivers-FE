import './App.css'
import Home from './pages/Home';
import Upload from './pages/Upload';
import LoginPage from './pages/LoginPage';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Home/>
      ),
    },
    {
      path: "upload",
      element: (
        <Upload/>
      )
    },
    {
      path: "login",
      element: (
        <LoginPage/>
      )
    },
  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default App
