import { useEffect, useState } from 'react';

export const useTelegramWebApp = () => {
  const [webApp, setWebApp] = useState(null);
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Telegram Web App API ni olish
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
      // Web App ni tayyor qilish
      tg.ready();
      tg.expand();
      
      // Theme ranglarini sozlash
      tg.setHeaderColor('#1e293b');
      tg.setBackgroundColor('#1e293b');
      
      setWebApp(tg);
      setUser(tg.initDataUnsafe?.user || null);
      setIsReady(true);

      console.log('Telegram Web App initialized:', {
        user: tg.initDataUnsafe?.user,
        initDataUnsafe: tg.initDataUnsafe,
        platform: tg.platform,
        version: tg.version
      });
    } else {
      console.warn('Telegram Web App SDK topilmadi. Oddiy brauzerda ishlayapti.');
      setIsReady(true);
    }
  }, []);

  const showBackButton = (onClick) => {
    if (webApp?.BackButton) {
      webApp.BackButton.show();
      webApp.BackButton.onClick(onClick);
    }
  };

  const hideBackButton = () => {
    if (webApp?.BackButton) {
      webApp.BackButton.hide();
    }
  };

  const showMainButton = (text, onClick) => {
    if (webApp?.MainButton) {
      webApp.MainButton.setText(text);
      webApp.MainButton.show();
      webApp.MainButton.onClick(onClick);
    }
  };

  const hideMainButton = () => {
    if (webApp?.MainButton) {
      webApp.MainButton.hide();
    }
  };

  const enableMainButton = () => {
    if (webApp?.MainButton) {
      webApp.MainButton.enable();
    }
  };

  const disableMainButton = () => {
    if (webApp?.MainButton) {
      webApp.MainButton.disable();
    }
  };

  const showAlert = (message) => {
    if (webApp) {
      webApp.showAlert(message);
    } else {
      alert(message);
    }
  };

  const showConfirm = (message, callback) => {
    if (webApp) {
      webApp.showConfirm(message, callback);
    } else {
      const result = confirm(message);
      callback(result);
    }
  };

  const close = () => {
    if (webApp) {
      webApp.close();
    }
  };

  return {
    webApp,
    user,
    isReady,
    showBackButton,
    hideBackButton,
    showMainButton,
    hideMainButton,
    enableMainButton,
    disableMainButton,
    showAlert,
    showConfirm,
    close,
  };
};
