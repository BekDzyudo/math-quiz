import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';

const TelegramContext = createContext();

export const TelegramProvider = ({ children }) => {
  const telegramHook = useTelegramWebApp();
  const [isTelegramMode, setIsTelegramMode] = useState(false);

  useEffect(() => {
    // Telegram Web App ichida ekanligini tekshirish
    const tg = window.Telegram?.WebApp;
    if (tg && tg.initDataUnsafe && Object.keys(tg.initDataUnsafe).length > 0) {
      setIsTelegramMode(true);
      console.log('✅ Telegram Web App mode enabled');
    } else {
      setIsTelegramMode(false);
      console.log('🌐 Web browser mode');
    }
  }, [telegramHook.user]);

  return (
    <TelegramContext.Provider value={{ ...telegramHook, isTelegramMode }}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within TelegramProvider');
  }
  return context;
};
