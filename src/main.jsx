import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GlobalProvider } from './context/GlobalContext.jsx'
import { TelegramProvider } from './context/TelegramContext.jsx'
import { ToastContainer } from 'react-toastify'
import { clearLegacyGenericKeys } from './utils/quizStorage'

// Eski generic quiz kalitlari (answers, result, showResult, savedQuizId, selectOption,
// remainingTime) boshqa quiz state'iga ta'sir qilishi mumkin edi — bir marta tozalanadi.
// Quiz-specific legacy kalitlar (saved_answers_N, remainingTime_N) readQuizState() ichida
// foydalanuvchi tegishli quizga kirganda blob'ga migratsiya qilinadi.
const LEGACY_FLAG = "quiz_storage_migrated_v1";
if (!localStorage.getItem(LEGACY_FLAG)) {
  clearLegacyGenericKeys();
  localStorage.setItem(LEGACY_FLAG, "1");
}

createRoot(document.getElementById('root')).render(
    <TelegramProvider>
        <GlobalProvider>
            <App />
            <ToastContainer position='bottom-right'/>
        </GlobalProvider>
    </TelegramProvider>
)
