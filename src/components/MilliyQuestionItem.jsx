import React, { useEffect, useRef, useCallback } from "react";

const MilliyQuestionItem = React.memo(({ index, value, onChange, savolRaqami}) => {
  const mathFieldRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const isInitializedRef = useRef(false);

  // ✅ Debounced onChange - har bir keystroke uchun emas, 300ms kutadi
  const debouncedOnChange = useCallback((newValue) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      onChange(index, newValue, savolRaqami);
    }, 300); // 300ms debounce
  }, [index, onChange, savolRaqami]);

  // ✅ Initial setup - faqat bir marta
  useEffect(() => {
    const mf = mathFieldRef.current;
    if (!mf || isInitializedRef.current) return;

    isInitializedRef.current = true;

    // Boshlang'ich qiymatni o'rnatish
    if (value && value.trim() !== '') {
      mf.value = value;
    }

    const handleInput = () => {
      debouncedOnChange(mf.value);
    };
    
    mf.addEventListener("input", handleInput);

    return () => {
      mf.removeEventListener("input", handleInput);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []); // ✅ Faqat mount vaqtida ishga tushadi

  // ✅ Faqat parent'dan kelgan value o'zgarganda, input bo'sh bo'lsa yangilash
  useEffect(() => {
    const mf = mathFieldRef.current;
    if (!mf || !isInitializedRef.current) return;

    // Faqat input bo'sh bo'lsa va value bor bo'lsa yangilash
    if ((!mf.value || mf.value.trim() === '') && value && value.trim() !== '') {
      mf.value = value;
    }
  }, [value]);

  function getSavolRaqami(index) {
  const start = 36;

  // 36a–45b oralig‘i uchun
  const pairStart = 36;
  const pairEnd = 45;
  const totalPairCount = (pairEnd - pairStart + 1) * 2; // 20 ta (36a,b ... 45a,b)

  if (index < totalPairCount) {
    const number = pairStart + Math.floor(index / 2);
    const suffix = index % 2 === 0 ? "a" : "b";
    return `${number}${suffix}`;
  }

  // qolganlari 46–50
  // const remainingIndex = index - totalPairCount;
  // return `${46 + remainingIndex}`;
}

  // ✅ Math-field setup with built-in keyboard toggle
  useEffect(() => {
    const mf = mathFieldRef.current;
    if (!mf) return;

    // Virtual keyboard ni manual mode'ga o'rnatish
    mf.mathVirtualKeyboardPolicy = 'manual';
    
    // Focus/blur eventlarni handle qilish
    const handleFocus = () => {
      if (window.mathVirtualKeyboard) {
        window.mathVirtualKeyboard.show();
      }
    };

    const handleBlur = () => {
      // Blur hodisasini kechiktirish - toggle button click'ini kutish uchun
      setTimeout(() => {
        if (window.mathVirtualKeyboard && document.activeElement !== mf) {
          window.mathVirtualKeyboard.hide();
        }
      }, 100);
    };

    mf.addEventListener('focus', handleFocus);
    mf.addEventListener('blur', handleBlur);

    // Shadow DOM ichidagi toggle button'ni topish va handle qilish
    setTimeout(() => {
      const toggleBtn = mf.shadowRoot?.querySelector('.ML__virtual-keyboard-toggle');
      if (toggleBtn) {
        const handleToggleClick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          if (window.mathVirtualKeyboard?.visible) {
            window.mathVirtualKeyboard.hide();
            mf.blur();
          } else {
            mf.focus();
            window.mathVirtualKeyboard?.show();
          }
        };
        
        toggleBtn.addEventListener('click', handleToggleClick, true);
        
        // Cleanup uchun saqlash
        mf._toggleBtnCleanup = () => {
          toggleBtn.removeEventListener('click', handleToggleClick, true);
        };
      }
    }, 100);

    return () => {
      mf.removeEventListener('focus', handleFocus);
      mf.removeEventListener('blur', handleBlur);
      if (mf._toggleBtnCleanup) {
        mf._toggleBtnCleanup();
      }
    };
  }, []);

  return (
    <div key={index} className="flex justify-between items-center gap-2">
      <span className="flex w-[22%] max-h-min justify-center items-center text-[14px] md:text-xl font-bold px-2 md:px-4 py-1 bg-[#5e7a9e] rounded text-white whitespace-nowrap">
        {getSavolRaqami(index)}-savol
      </span>
      <math-field
        ref={mathFieldRef}
        smartMode
        virtual-keyboard-mode="manual"
        className="cursor-text outline-0 border border-gray-400 py-2 md:py-0.5 px-1 md:px-2 rounded w-[76%] text-[16px] md:text-[18px] bg-[#3b4d66] touch-action-manipulation"
        style={{
          '--keyboard-zindex': '1000',
          minHeight: '40px',
          fontSize: '16px'
        }}
      ></math-field>
    </div>
  );
});

MilliyQuestionItem.displayName = 'MilliyQuestionItem';

export default MilliyQuestionItem;
