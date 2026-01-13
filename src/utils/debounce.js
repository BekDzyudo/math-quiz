// ✅ Debounce utility function - performance optimizatsiyasi uchun
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ✅ localStorage yozish uchun maxsus debounced function
export const debouncedSetLocalStorage = debounce((key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('localStorage yozishda xato:', error);
  }
}, 500); // 500ms debounce
