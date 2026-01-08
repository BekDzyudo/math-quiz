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
      
      // User ma'lumotlarini olish
      let userData = tg.initDataUnsafe?.user;
      
      // Agar initDataUnsafe bo'sh bo'lsa, initData dan parse qilish
      if (!userData && tg.initData) {
        try {
          console.log('⚠️ initDataUnsafe bo\'sh, initData dan parse qilyapman...');
          console.log('initData:', tg.initData);
          
          // initData URL-encoded string, uni parse qilish kerak
          const params = new URLSearchParams(tg.initData);
          const userParam = params.get('user');
          if (userParam) {
            userData = JSON.parse(decodeURIComponent(userParam));
            console.log('✅ User data parsed from initData:', userData);
          }
        } catch (error) {
          console.error('❌ initData parse error:', error);
        }
      }
      
      setUser(userData || null);
      setIsReady(true);

      console.log('Telegram Web App initialized:', {
        user: userData,
        initDataUnsafe: tg.initDataUnsafe,
        initData: tg.initData ? 'exists' : 'empty',
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
      // Eski listenerlarni o'chirish
      webApp.BackButton.offClick(onClick);
      webApp.BackButton.show();
      webApp.BackButton.onClick(onClick);
    }
  };

  const hideBackButton = () => {
    if (webApp?.BackButton) {
      webApp.BackButton.hide();
      // Barcha listenerlarni o'chirish
      webApp.BackButton.offClick();
    }
  };

  const showMainButton = (text, onClick) => {
    if (webApp?.MainButton) {
      // Eski listenerlarni o'chirish
      webApp.MainButton.offClick(onClick);
      webApp.MainButton.setText(text);
      webApp.MainButton.show();
      webApp.MainButton.onClick(onClick);
    }
  };

  const hideMainButton = () => {
    if (webApp?.MainButton) {
      webApp.MainButton.hide();
      // Barcha listenerlarni o'chirish
      webApp.MainButton.offClick();
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
