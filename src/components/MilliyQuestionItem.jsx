import React, { useEffect, useRef, useCallback, useState } from "react";
import { FaKeyboard } from "react-icons/fa";

const MilliyQuestionItem = React.memo(({ index, value, onChange, savolRaqami }) => {
  const mathFieldRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const isInitializedRef = useRef(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // ✅ Debounced onChange - har bir keystroke uchun emas, lekin Telegram uchun tezroq
  const debouncedOnChange = useCallback((newValue) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      console.log(`📝 Debounced onChange for savol ${savolRaqami}:`, newValue);
      onChange(index, newValue, savolRaqami);
    }, 150); // 150ms debounce - Telegram uchun tezroq
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

    // Faqat parentdan value o'zgarganda inputni yangilash
    if (value !== mf.value) {
      mf.value = value || '';
    }
  }, [value]);

  function getSavolRaqami(index) {
    const start = 36;

    // 36a–45b oralig'i uchun
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

  // ✅ Virtual keyboard setup
  useEffect(() => {
    const mf = mathFieldRef.current;
    if (!mf) return;

    // Virtual keyboard ni manual mode'ga o'rnatish
    mf.mathVirtualKeyboardPolicy = 'manual';

    // Built-in toggle button'ni yashirish
    const style = document.createElement('style');
    style.textContent = `
      math-field::part(virtual-keyboard-toggle) {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Cleanup - keyboard yopish
      if (window.mathVirtualKeyboard) {
        window.mathVirtualKeyboard.hide();
      }
      document.head.removeChild(style);
    };
  }, []);

  // ✅ Keyboard toggle function
  const toggleKeyboard = useCallback(() => {
    const mf = mathFieldRef.current;
    if (!mf || !window.mathVirtualKeyboard) return;

    if (isKeyboardVisible) {
      // Keyboard yopish
      window.mathVirtualKeyboard.hide();
      setIsKeyboardVisible(false);
    } else {
      // Keyboard ochish
      mf.focus();
      window.mathVirtualKeyboard.show();
      setIsKeyboardVisible(true);
    }
  }, [isKeyboardVisible]);

  return (
    <div key={index} className="flex justify-between items-center gap-2">
      <span className="flex w-[22%] max-h-min justify-center items-center text-[14px] md:text-xl font-bold px-2 md:px-4 py-1 bg-[#5e7a9e] rounded text-white whitespace-nowrap">
        {getSavolRaqami(index)}-savol
      </span>
      <div className="flex items-center gap-2 flex-1">
        <math-field
          ref={mathFieldRef}
          smartMode
          virtual-keyboard-mode="manual"
          className="cursor-text outline-0 border border-gray-400 py-2 md:py-0.5 px-1 md:px-2 rounded flex-1 text-[16px] md:text-[18px] bg-[#3b4d66] touch-action-manipulation"
          style={{
            '--keyboard-zindex': '1000',
            minHeight: '40px',
            fontSize: '16px'
          }}
        ></math-field>
        <button
          type="button"
          onClick={toggleKeyboard}
          className={`p-2 md:p-3 rounded border-2 transition-all ${isKeyboardVisible
            ? 'bg-blue-500 border-blue-600 text-white'
            : 'bg-gray-600 border-gray-500 text-gray-300'
            } hover:scale-105`}
          aria-label="Toggle Virtual Keyboard"
        >
          <FaKeyboard className="text-lg md:text-xl" />
        </button>
      </div>
    </div>
  );
});

MilliyQuestionItem.displayName = 'MilliyQuestionItem';

export default MilliyQuestionItem;
