import { Provider } from 'react-redux'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './components/ErrorBoundary';
import AppRouter from './routes'
import store from './redux'

function App() {

 
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <AppRouter />
        <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        />
      </ErrorBoundary>
    </Provider>
      
    
  )
}

export default App
