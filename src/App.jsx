import './App.css'
import Home from './pages/Home';
import Upload from './pages/Upload';
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
  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default App
