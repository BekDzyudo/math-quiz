import React, { useContext } from 'react'
import { GlobalContext } from '../../context/GlobalContext';
import { useNavigate } from 'react-router-dom';

function Result() {
    const { activeModal, setActiveModal, result } = useContext(GlobalContext);
    const navigate = useNavigate()
  return (
   <div className="fixed inset-0 flex justify-center items-center z-50">
  {/* Orqa fon alohida */}
  <div className="absolute inset-0 bg-black opacity-60"></div>

  {/* Modal oynaning o'zi */}
  <div className="relative text-white flex justify-center items-center shadow-2xl rounded-2xl p-5 w-full md:w-[500px] md:p-10 border border-amber-400 bg-[#263244]">
    <div className="flex flex-col gap-5 items-center w-full">
      <p className="text-xl md:text-3xl font-bold">Test Natijasi</p>
      
      {/* To'g'ri javoblar soni */}
      <h1 className="text-amber-400 font-bold text-3xl md:text-5xl">
        {result?.togri_javoblar ?? 0} <span className='text-xl md:text-3xl'>ta</span>
      </h1>
      
      {/* Toifa (faqat toifa ko'rsatiladi, Rasch ball ko'rsatilmaydi) */}
      {result?.toifa && (
        <div className="bg-[#1a2332] rounded-lg p-4 w-full border border-amber-500">
          <div className="flex justify-center items-center gap-3">
            <span className="text-lg font-semibold">Toifa:</span>
            <span className="text-4xl font-bold text-yellow-400">{result.toifa}</span>
          </div>
        </div>
      )}
      
      {/* Jami savollar */}
      <div className="text-center">
        <p className="text-gray-400 text-base">Jami savollar</p>
        <p className="font-bold text-2xl">{result?.jami_savollar ?? 0}</p>
      </div>
      
      <button
        className="btn btn-error text-white text-sm md:text-xl w-full"
        onClick={() => {
          setActiveModal(false);
          navigate("/tasdiqlash-kodi");
        }}
      >
        Yopish
      </button>
    </div>
  </div>
</div>

  )
}

export default Result