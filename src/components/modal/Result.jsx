import React, { useContext, useEffect } from 'react'
import { GlobalContext } from '../../context/GlobalContext';
import { useNavigate } from 'react-router-dom';

function Result() {
  const { activeModal, setActiveModal, result } = useContext(GlobalContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🎭 Result modal state changed:', { activeModal, hasResult: !!result, result });
  }, [activeModal, result]);

  const handleClose = () => {
    console.log('🚪 Closing modal...');
    // ✅ BARCHA test ma'lumotlarini tozalash (qayta kirishni oldini olish)
    try {
      localStorage.removeItem('answersM');
      localStorage.removeItem('saved_answersM');
      localStorage.removeItem('answers_yopiq');
      localStorage.removeItem('selectOptionM');
      localStorage.removeItem('test-code'); // ✅ Test kodni ham o'chirish!
    } catch (error) {
      // Silent error
    }

    setActiveModal(false);

    // ✅ Bosh sahifaga o'tish
    navigate("/");
  };

  // ✅ Modal ko'rinishini tekshirish
  if (!activeModal || !result) {
    console.log('⏸️ Modal hidden: activeModal=', activeModal, 'result=', result);
    return null;
  }

  console.log('✅ Rendering modal with result:', result);

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50" onKeyDown={(e) => e.key === 'Escape' && e.preventDefault()}>
      {/* Orqa fon alohida - click disabled */}
      <div
        className="absolute inset-0 bg-black opacity-60"
        onClick={(e) => e.stopPropagation()}
      ></div>

      {/* Modal oynaning o'zi */}
      <div className="relative flex justify-center items-center shadow-2xl rounded-2xl p-8 w-[90%] max-w-[400px] md:p-12 bg-white border border-slate-200">
        <div className="flex flex-col gap-6 items-center w-full">
          {/* Sarlavha */}
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-emerald-600">✅ Test Yakunlandi!</p>
            <p className="text-sm text-slate-500 mt-2">Sizning natijangiz</p>
          </div>

          {/* To'g'ri javoblar - Asosiy */}
          <div className="flex flex-col items-center gap-2 py-4 px-8 bg-indigo-50 rounded-xl border border-indigo-200 w-full">
            <p className="text-slate-600 text-base">To'g'ri javoblar</p>
            <h1 className="text-indigo-600 font-bold text-5xl md:text-6xl">
              {result?.togri_javoblar ?? 0}
            </h1>
            <p className="text-slate-500 text-sm">/ {result?.jami_savollar ?? 0} ta savol</p>
          </div>

          {/* Yopish tugmasi */}
          <button
            className="btn btn-info text-white text-lg md:text-xl w-full py-3 hover:scale-105 transition-transform"
            onClick={handleClose}
          >
            Yopish
          </button>
        </div>
      </div>
    </div>

  )
}

export default Result