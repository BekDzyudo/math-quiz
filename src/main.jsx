import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GlobalProvider } from './context/GlobalContext.jsx'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')).render(
    <GlobalProvider>
        <App />
        <ToastContainer position='bottom-right'/>
    </GlobalProvider>
)
