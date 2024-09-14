import { Provider } from 'react-redux'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import AppRouter from './routes'
import store from './redux'

function App() {

 
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
      
    
  )
}

export default App
