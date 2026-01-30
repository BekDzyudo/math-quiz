import { FaUser } from "react-icons/fa";
import NavbarMilliy from "../components/NavbarMilliy";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { useTelegram } from "../context/TelegramContext";
import "mathlive";
import { FaEdit } from "react-icons/fa";
import MilliyQuestionItem from "../components/MilliyQuestionItem";
import Result from "../components/modal/Result";
import { toast } from "react-toastify";

function MilliyTestQuiz() {

  const code = (() => {
    try {
      return localStorage.getItem("test-code");
    } catch (error) {
      return null;
    }
  })();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Submit holatini boshqarish
  const isSubmittingRef = useRef(false); // ✅ Ref orqali ham boshqarish (immediate check)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // ✅ Confirmation modal
  const [unansweredCount, setUnansweredCount] = useState(0); // ✅ Javob berilmagan savollar soni
  const [isOnline, setIsOnline] = useState(navigator.onLine); // ✅ Network status tracking

  const ochiqSavollar = Array.from({ length: 35 });

  // ✅ 20 ta yopiq savol uchun boshlang'ich struktura
  const yopiqSavollarRaqamlari = ["36a", "36b", "37a", "37b", "38a", "38b", "39a", "39b", "40a", "40b",
    "41a", "41b", "42a", "42b", "43a", "43b", "44a", "44b", "45a", "45b"];

  const [yopiqQuizAnswers, setYopiqQuizAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem("answers_yopiq");
      if (saved) {
        return JSON.parse(saved);
      }
      // ✅ Boshlang'ich 20 ta bo'sh javob yaratish
      return yopiqSavollarRaqamlari.map(raqam => ({
        savol_raqami: raqam,
        javob: ""
      }));
    } catch (error) {
      return yopiqSavollarRaqamlari.map(raqam => ({
        savol_raqami: raqam,
        javob: ""
      }));
    }
  });

  // ✅ Virtual keyboard handling for mobile
  useEffect(() => {
    let lastScrollY = 0;

    const handleFocusIn = (e) => {
      // Math-field yoki input focus bo'lganda
      if (e.target.tagName === 'MATH-FIELD' || e.target.tagName === 'INPUT') {
        lastScrollY = window.scrollY;
        document.body.classList.add('keyboard-open');

        // Scroll to input with delay
        setTimeout(() => {
          e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    };

    const handleFocusOut = (e) => {
      if (e.target.tagName === 'MATH-FIELD' || e.target.tagName === 'INPUT') {
        document.body.classList.remove('keyboard-open');

        // Restore scroll position
        setTimeout(() => {
          window.scrollTo({ top: lastScrollY, behavior: 'smooth' });
        }, 100);
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
      document.body.classList.remove('keyboard-open');
    };
  }, []);

  const { userData, activeModal, setActiveModal, result, setResult, setUserData } = useContext(GlobalContext);
  const {
    user,
    isTelegramMode,
    showBackButton,
    hideBackButton,
    showMainButton,
    hideMainButton,
    disableMainButton,
    enableMainButton,
    showConfirm,
    close
  } = useTelegram() || {}; // ✅ Fallback agar context undefined bo'lsa

  // Telegram Web App da auto-login
  useEffect(() => {
    const telegramLogin = async () => {
      if (isTelegramMode && user && user.id) {
        if (!userData) {
          try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/telegram-login/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                telegram_id: user.id,
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                username: user.username || ''
              })
            });

            if (response.ok) {
              const data = await response.json();
              setUserData(data);
            }
          } catch (error) {
          }
        }
        setIsLoading(false);
      } else if (!isTelegramMode) {
        setIsLoading(false);
      }
    };

    telegramLogin();
  }, [isTelegramMode, user, userData, setUserData]);

  // Web siteda login tekshiruvi (Telegram Web App da emas)
  useEffect(() => {
    if (!isLoading && !isTelegramMode && !userData) {
      toast.error("Iltimos, avval login qiling");
      navigate("/login");
    }
  }, [isLoading, isTelegramMode, userData, navigate]);

  // ✅ Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('✅ Internet aloqasi qayta tiklandi');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('⚠️ Internet aloqasi yo\'q! Javoblaringiz localStorage\'da saqlanmoqda.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (!navigator.onLine) {
      setIsOnline(false);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);


  const [selectedAnswersM, setSelectedAnswersM] = useState(() => {
    try {
      const saved = localStorage.getItem("answersM");
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
    } catch (error) {
      console.error('localStorage ochiq answers yuklanmadi:', error);
    }
    return {};
  });

  // ✅ localStorage tozalash utility function
  const clearTestAnswers = () => {
    try {
      localStorage.removeItem("answersM");
      localStorage.removeItem("saved_answersM");
      localStorage.removeItem("answers_yopiq");
      localStorage.removeItem("selectOptionM");
    } catch (error) {
      console.error('localStorage tozalashda xato:', error);
    }
  };

  // ❌ Component mount bo'lganda localStorage'ni tozalash OLIB TASHLANDI
  // Test topshirilgandan keyin tozalanadi (handleSubmit ichida)
  // useEffect(() => {
  //   clearTestAnswers();
  // }, []);

  // ✅ Telegram Web App uchun: visibility change'da localStorage'dan qayta yuklash
  useEffect(() => {
    if (!isTelegramMode) return;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        try {
          const saved = localStorage.getItem("answersM");
          if (saved) {
            const parsed = JSON.parse(saved);
            setSelectedAnswersM(parsed);
          }
        } catch (error) {
          console.error('Reload error:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Telegram Web App viewportChanged event
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.onEvent('viewportChanged', () => {
        handleVisibilityChange();
      });
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isTelegramMode]);

  const handleAnswerChange = (question_number, selectedOption, optionIndex) => {
    const questionKey = question_number.toString();
    setSelectedAnswersM(prev => {
      const updated = {
        ...prev,
        [questionKey]: optionIndex
      };
      // localStorage'ga saqlash (immediate sync)
      try {
        localStorage.setItem("answersM", JSON.stringify(updated));
        
        // Telegram Web App uchun: CloudStorage'ga ham saqlash
        if (isTelegramMode && window.Telegram?.WebApp?.CloudStorage) {
          window.Telegram.WebApp.CloudStorage.setItem(`answersM_${code}`, JSON.stringify(updated), (error) => {
            if (error) {
              console.error('☁️ CloudStorage save error:', error);
            }
          });
        }
      } catch (error) {
        console.error('localStorage saqlashda xato:', error);
      }
      return updated;
    });
  };


  const savolNum = ["36a", "36b", "37a", "37b", "38a", "38b", "39a", "39b", "40a", "40b",
    "41a", "41b", "42a", "42b", "43a", "43b", "44a", "44b", "45a", "45b"];

  // ✅ useCallback bilan optimizatsiya - funksiya har safar qayta yaratilmaydi
  const handleAnswerChangeYopiq = useCallback((index, newValue, question_number) => {
    setYopiqQuizAnswers((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          javob: newValue
        };
      }
      // localStorage'ga saqlash
      try {
        localStorage.setItem("answers_yopiq", JSON.stringify(updated));
      } catch (error) {
        console.error('localStorage yopiq savollar saqlashda xato:', error);
      }
      return updated;
    });
  }, []); // ✅ Har doim 20 ta element saqlanadi, input bo'sh bo'lsa ham

  // ✅ Barcha 55 savolni to'ldirib yuborish (bo'sh bo'lsa ham)
  const ensureAllAnswers = (yopiqAnswersToUse = null) => {
    // ✅ Agar parameter berilmasa, default state'dan olish
    const yopiqSource = yopiqAnswersToUse || yopiqQuizAnswers;

    // ✅ CRITICAL: localStorage'dan to'g'ridan-to'g'ri o'qish (state lag muammosi)
    let currentAnswers = selectedAnswersM;
    try {
      const saved = localStorage.getItem("answersM");
      if (saved) {
        currentAnswers = JSON.parse(saved);
      } else {
        console.warn('⚠️ localStorage answersM is EMPTY - using state');
      }
    } catch (error) {
      console.error('❌ Error reading localStorage:', error);
      currentAnswers = {}; // Fallback to empty object
    }

    // 1-35 ochiq savollar (test variant javoblari)
    const ochiqJavoblar = Array.from({ length: 35 }, (_, i) => {
      const questionNum = (i + 1).toString();
      const optionIndex = currentAnswers[questionNum];
      // 33, 34, 35 (0-index: 32, 33, 34) uchun 6 ta variant
      const has6Options = i >= 32 && i <= 34;
      const options = has6Options ? ['A', 'B', 'C', 'D', 'E', 'F'] : ['A', 'B', 'C', 'D'];
      
      // ✅ CRITICAL: optionIndex 0 bo'lishi mumkin (A variant), shuning uchun !== undefined va !== null tekshiramiz
      // Bo'sh javob bo'lsa, empty string yuborish (backend uchun)
      const javob = (optionIndex !== undefined && optionIndex !== null) ? options[optionIndex] : "";
      
      return {
        savol_raqami: questionNum,
        javob: javob  // Bo'sh string ham yuboriladi
      };
    });


    // 36a-45b yopiq savollar (20 ta yozma javob)
    const savolNum = ["36a", "36b", "37a", "37b", "38a", "38b", "39a", "39b", "40a", "40b",
      "41a", "41b", "42a", "42b", "43a", "43b", "44a", "44b", "45a", "45b"];

    const yopiqJavoblar = savolNum.map(raqam => {
      const existing = yopiqSource.find(a => a.savol_raqami === raqam);
      return {
        savol_raqami: raqam,
        javob: existing?.javob || ""  // Bo'sh string ham yuboriladi
      };
    });


    const allAnswers = [...ochiqJavoblar, ...yopiqJavoblar];
    
    // ✅ CRITICAL VALIDATION: Barcha 55 ta javob borligini tekshirish
    if (allAnswers.length !== 55) {
      console.error('❌ CRITICAL ERROR: Expected 55 answers, got', allAnswers.length);
      console.error('Missing answers! This should never happen!');
    } else {
    }

    return allAnswers;
  };

  // Telegram Web App buttons
  useEffect(() => {
    if (!isTelegramMode) return;

    // Handlerlarni ref da saqlash (cleanup uchun)
    const handleBack = () => {
      showConfirm("Testni to'xtatmoqchimisiz?", (confirmed) => {
        if (confirmed) {
          navigate("/tasdiqlash-kodi");
        }
      });
    };

    const handleMainButtonClick = () => {
      if (!isSubmitting) {
        handleSubmitPermition(new Event('submit'));
      }
    };

    // Back button
    showBackButton(handleBack);

    // Main button (Testni yakunlash)
    showMainButton("Testni yakunlash", handleMainButtonClick);

    // ✅ Submit holatiga qarab tugmani disable/enable qilish
    if (isSubmitting && disableMainButton) {
      disableMainButton();
    } else if (!isSubmitting && enableMainButton) {
      enableMainButton();
    }

    return () => {
      hideBackButton();
      hideMainButton();
    };
  }, [isTelegramMode, isSubmitting, showBackButton, hideBackButton, showMainButton, hideMainButton, disableMainButton, enableMainButton, showConfirm]);

  const handleSubmit = (e, skipValidation = false, customYopiqAnswers = null) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }


    // ✅ Agar allaqachon yuborilayotgan bo'lsa, qayta yubormaslik (ref orqali tekshirish)
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true; // ✅ Ref'ni darhol o'zgartirish
    setIsSubmitting(true);

    // Telegram user ID ni ishlatish
    const userId = isTelegramMode ? user?.id : userData?.user_id;
    const telegramId = isTelegramMode ? user?.id : "";

    // FISH (Full Name) - Bot registratsiyasidan yoki web login'dan
    let fullName = "";
    if (isTelegramMode && user) {
      // Telegram: first_name + last_name
      fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    } else if (userData?.first_name && userData?.last_name) {
      // Web: user data'dan
      fullName = `${userData.first_name} ${userData.last_name}`.trim();
    }

    // ✅ Barcha 55 savolni to'ldirib olish (bo'sh javoblar bilan)
    // ✅ CRITICAL: Agar customYopiqAnswers berilsa (flush qilingan data), uni ishlat!
    const yopiqToUse = customYopiqAnswers || yopiqQuizAnswers;
    const allAnswers = ensureAllAnswers(yopiqToUse);

    // ✅ FINAL VALIDATION: 55 ta javob borligini ta'minlash
    if (allAnswers.length !== 55) {
      console.error('❌ CRITICAL: Cannot submit! Expected 55 answers, got', allAnswers.length);
      toast.error('Xatolik: Barcha javoblar tayyorlanmadi. Qaytadan urinib ko\'ring.');
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      return;
    }


    // ✅ Network status check
    if (!navigator.onLine) {
      console.error('❌ No internet connection');
      toast.error('Internet aloqasi yo\'q. Iltimos, internetni tekshiring.');
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      return;
    }

    // ✅ Request with timeout and retry
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    fetch(`${import.meta.env.VITE_BASE_URL}/check/${code}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        telegram_id: telegramId,
        full_name: fullName,
        javoblar: allAnswers,
      }),
      signal: controller.signal, // ✅ Add abort signal
    })
      .then(async (res) => {
        clearTimeout(timeoutId); // ✅ Clear timeout on success
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(JSON.stringify(errorData));
        }
        return res.json();
      })
      .then((data) => {
        isSubmittingRef.current = false;
        setIsSubmitting(false);

        // Backend natija qaytaradi
        if (data.status === 'success' && data.natija) {

          // ✅ Faqat javoblarni tozalash - test-code ni saqlab qolish
          clearTestAnswers();

          setResult(data.natija);

          // ✅ State update'dan keyin modal ochish
          setTimeout(() => {
            setActiveModal(true);
          }, 100);

          toast.success('✅ Test topshirildi!');
        } else if (data.status === 'error') {
          console.error('❌ Backend error:', data.message);
          toast.error(data.message || 'Xatolik yuz berdi');
        } else {
          console.error('❌ Unexpected response format:', data);
          toast.error('Kutilmagan xatolik yuz berdi');
        }
      })
      .catch((err) => {
        clearTimeout(timeoutId); // ✅ Clear timeout on error
        console.error('❌ Submission error:', err);
        isSubmittingRef.current = false;
        setIsSubmitting(false);
        
        // ✅ Network-specific error handling
        if (err.name === 'AbortError') {
          console.error('❌ Request timeout');
          toast.error('⏱️ Server javob bermadi (30s). Internet aloqasini tekshiring va qaytadan urinib ko\'ring.');
        } else if (!navigator.onLine) {
          console.error('❌ Lost internet connection');
          toast.error('📡 Internet aloqasi uzilib qoldi. Iltimos, qaytadan ulanib, testni qayta topshiring.');
        } else {
          try {
            const parsed = JSON.parse(err.message);
            toast.error(parsed.message || 'Testni yuborishda xatolik yuz berdi');
          } catch {
            // Network error yoki boshqa xatolar
            if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
              toast.error('🌐 Server bilan bog\'lanib bo\'lmadi. Internet aloqasini tekshiring.');
            } else {
              toast.error('Testni yuborishda xatolik yuz berdi. Qaytadan urinib ko\'ring.');
            }
          }
        }
      });
  };

  // ✅ Submit permission checker - incomplete answers ga confirmation modal ko'rsatish
  const handleSubmitPermition = (e) => {
    e.preventDefault();

    // ✅ Agar allaqachon yuborilayotgan bo'lsa, qayta yubormaslik
    if (isSubmittingRef.current) {
      return;
    }


    // ✅ CRITICAL: Force flush all pending debounced values from math fields
    // In Telegram WebApp, users might submit quickly after typing
    const allMathFields = document.querySelectorAll('math-field');
    const updatedYopiqAnswers = [...yopiqQuizAnswers];
    let flushCount = 0;
    
    
    allMathFields.forEach((mf, index) => {
      const currentValue = mf.value || '';
      const savolRaqami = yopiqSavollarRaqamlari[index];
      
      if (currentValue.trim() !== '') {
        if (savolRaqami && updatedYopiqAnswers[index]) {
          const oldValue = updatedYopiqAnswers[index].javob || '';
          updatedYopiqAnswers[index] = {
            savol_raqami: savolRaqami,
            javob: currentValue
          };
          if (oldValue !== currentValue) {
            flushCount++;
          } else {
          }
        }
      } else {
      }
    });

    if (flushCount > 0) {
      setYopiqQuizAnswers(updatedYopiqAnswers);
      // ✅ localStorage'ga ham saqlash
      try {
        localStorage.setItem("answers_yopiq", JSON.stringify(updatedYopiqAnswers));
      } catch (error) {
        console.error('localStorage saqlashda xato:', error);
      }
    } else {
    }

    // To'ldirilgan javoblar sonini hisoblash (flushed values bilan)
    // ✅ CRITICAL: localStorage'dan to'g'ridan-to'g'ri o'qish (state lag muammosini hal qilish)
    let currentSelectedAnswers = selectedAnswersM;
    try {
      const savedAnswers = localStorage.getItem("answersM");
      if (savedAnswers) {
        currentSelectedAnswers = JSON.parse(savedAnswers);
      } else {
        console.warn('⚠️ localStorage answersM is empty!');
      }
    } catch (error) {
      console.error('localStorage o\'qishda xato:', error);
    }
    
    // ✅ Faqat valid (undefined yoki null emas) javoblarni sanash
    const validEntries = Object.entries(currentSelectedAnswers).filter(
      ([key, value]) => value !== undefined && value !== null && value !== ''
    );
    const filledOchiqCount = validEntries.length;
    
    const filledYopiqCount = updatedYopiqAnswers.filter(item => item?.javob && item.javob.trim() !== '').length;
    const filledCount = filledOchiqCount + filledYopiqCount;

    const totalQuestions = 55;
    const unanswered = totalQuestions - filledCount;
    
    // ✅ DEBUG: Javoblar sonini ko'rsatish

   

    // Agar barcha javoblar to'ldirilgan bo'lsa, to'g'ridan-to'g'ri yuborish
    if (unanswered === 0) {
   
      handleSubmit(e, true, updatedYopiqAnswers);
      return;
    }

    // ✅ Telegram Web App da native confirm, oddiy browserda custom modal
    if (isTelegramMode && showConfirm) {
      showConfirm(`${unanswered} ta savol belgilanmagan. Testni topshirmoqchimisiz?`, (confirmed) => {
        if (confirmed) {
          // ✅ CRITICAL: Flush qilingan updatedYopiqAnswers ni uzatish!
          handleSubmit(null, true, updatedYopiqAnswers);
        } else {
          // ✅ Bekor qilinganda isSubmitting ni false qilish kerak
          isSubmittingRef.current = false; // ✅ Ref'ni ham reset qilish
          setIsSubmitting(false);
        }
      });
    } else {
      // Oddiy browser uchun custom modal
      setUnansweredCount(unanswered);
      setShowConfirmationModal(true);
    }
  };

  // ✅ Confirmation modal'dan tasdiqlash
  const handleConfirmSubmit = () => {
    setShowConfirmationModal(false);
    
    // ✅ CRITICAL: Oddiy browserda ham math field'lardan flush qilish
    const allMathFields = document.querySelectorAll('math-field');
    const updatedYopiqAnswers = [...yopiqQuizAnswers];
    let flushCount = 0;
    
    allMathFields.forEach((mf, index) => {
      if (mf.value && mf.value.trim() !== '') {
        const savolRaqami = yopiqSavollarRaqamlari[index];
        if (savolRaqami && updatedYopiqAnswers[index]) {
          const oldValue = updatedYopiqAnswers[index].javob;
          updatedYopiqAnswers[index] = {
            ...updatedYopiqAnswers[index],
            javob: mf.value
          };
          if (oldValue !== mf.value) {
            flushCount++;
          }
        }
      }
    });

    if (flushCount > 0) {
    }
    
    // Modal yopilgandan keyin submit qilish (state update tugashini kutish)
    setTimeout(() => {
      // ✅ Flush qilingan updatedYopiqAnswers ni uzatish
      handleSubmit(null, true, updatedYopiqAnswers);
    }, 150);
  };

  // ✅ Confirmation modal'dan bekor qilish
  const handleCancelSubmit = () => {
    setShowConfirmationModal(false);
  };

  return (
    <div className="min-h-screen overflow-y-auto">
      <NavbarMilliy />
      <div className="px-3 md:px-5 md:max-w-[700px] md:w-full md:mr-auto md:ml-auto md:px-[50px] flex md:gap-10 items-start justify-between h-full pt-5 pb-32 md:pb-10">
        <form className="w-full h-full" onSubmit={handleSubmitPermition}>
          <div className="w-full grid grid-cols-1 md:grid-cols-1 gap-3 md:gap-4 mb-5 pb-10 md:pb-20">
            {ochiqSavollar.map((item, index) => {
              // 33-35 savollar uchun 6 ta variant (A, B, C, D, E, F)
              const has6Options = index >= 32 && index <= 34; // 33, 34, 35 (0-indexed: 32, 33, 34)
              const options = has6Options
                ? ['A', 'B', 'C', 'D', 'E', 'F']
                : ['A', 'B', 'C', 'D'];

              return (
                <div
                  key={index}
                  className={`bg-[#3b4d66] rounded-lg p-3 md:p-4 border-b-2 border-gray-600`}
                >
                  <div className="flex items-center justify-between gap-2 md:gap-3">
                    <span className="text-sm md:text-xl font-bold px-3 md:px-4 py-1 bg-[#5e7a9e] rounded text-white whitespace-nowrap flex-shrink-0">
                      {index + 1}.
                    </span>
                    <div className="flex gap-1">
                      {options.map((option, optionIndex) => (
                        <label
                          key={option}
                          className="test-label group flex justify-center items-center cursor-pointer"
                        >
                          <div
                            className={`test-letter text-center text-[13px] md:text-[16px] font-bold ${
                              selectedAnswersM[(index + 1).toString()] === optionIndex
                                ? "bg-info text-white"
                                : "bg-gray-300"
                            } px-2 py-2 md:px-3 md:py-3 rounded group-hover:text-[#00A4F2] text-gray-500 w-[40px] md:w-[50px]`}
                          >
                            {option}
                          </div>
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={option}
                            checked={selectedAnswersM[(index + 1).toString()] === optionIndex}
                            onChange={() => handleAnswerChange(index + 1, option, optionIndex)}
                            className="hidden"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <h2 className="text-md text-white flex items-center gap-3 border-t border-gray-400 pt-5 mb-3">
            <FaEdit className="text-xl" /> Yozma javoblar (36-50)
          </h2>
          <div className="mt-1 grid grid-cols-1 md:grid-cols-1 gap-3 md:gap-4">
            {yopiqQuizAnswers.map((item, index) => {
              return (
                <MilliyQuestionItem
                  key={index}
                  index={index}
                  value={yopiqQuizAnswers[index]?.javob || ""}
                  onChange={handleAnswerChangeYopiq}
                  savolRaqami={index + 36}
                />
              );
            })}
          </div>
          {!isTelegramMode && (
            <div className="flex justify-center mt-10 md:mt-20">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-1/2 md:w-1/2 btn btn-outline btn-info btn-md md:btn-xl text-white rounded-2xl ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Yuborilmoqda...' : 'Testni yakunlash'}
              </button>
            </div>
          )}
        </form>

        {/* <div className="hidden md:block sidebar w-[30%] p-5 border border-gray-400 sticky top-32 rounded-xl">
          <div className="user flex items-center gap-5 border-b border-gray-400 pb-1">
            <FaUser style={{ color: "gray", fontSize: "25px" }} />{" "}
            <h1 className="text-center text-2xl font-semibold text-white">
              {userData?.last_name + " " + userData?.first_name}
            </h1>
          </div>
          <div className="w-full flex flex-col items-center mt-5">
            <Link
              type="button"
              className={`w-full btn btn-outline btn-info btn-xl text-white rounded-2xl`}
            >
              Testni yakunlash
            </Link>
          </div>
        </div> */}
      </div>
      {activeModal && result && <Result />}

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
            <p className="text-xl font-bold text-gray-800">Test yuborilmoqda...</p>
            <p className="text-sm text-gray-600">Iltimos kuting</p>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Incomplete Submission */}
      {showConfirmationModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          {/* Backdrop - clicking closes modal */}
          <div
            className="absolute inset-0 bg-black opacity-70"
            onClick={handleCancelSubmit}
          ></div>

          {/* Modal Content */}
          <div 
            className="relative text-white flex justify-center items-center shadow-2xl rounded-2xl p-6 w-[90%] max-w-[450px] md:p-8 border-2 border-orange-500 bg-gradient-to-br from-[#263244] to-[#1a2332]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-5 items-center w-full">
              {/* Warning Icon */}
              <div className="text-6xl">⚠️</div>

              {/* Message */}
              <div className="text-center">
                <p className="text-xl md:text-2xl font-bold text-orange-400 mb-2">Diqqat!</p>
                <p className="text-base md:text-lg text-gray-300">
                  Belgilanmagan savollar mavjud.
                </p>
                <p className="text-sm text-gray-400 mt-2">Testni topshirmoqchimisiz?</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={handleCancelSubmit}
                  className="flex-1 btn btn-outline btn-error text-white text-base md:text-lg py-3 hover:scale-105 transition-transform"
                >
                  Yo'q, qaytish
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  className="flex-1 btn btn-success text-white text-base md:text-lg py-3 hover:scale-105 transition-transform"
                >
                  Ha, topshirish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MilliyTestQuiz;
