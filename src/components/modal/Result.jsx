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

  {/* Modal oynaning o‘zi */}
  <div className="relative text-white flex justify-center items-center shadow-2xl rounded-2xl p-5 w-full md:w-96 md:p-10 border border-amber-400 bg-[#263244]">
    <div className="flex flex-col gap-5 items-center">
      <p className="text-xl md:text-3xl">Natija</p>
      <h1 className="text-amber-400 font-bold text-3xl md:text-5xl">
        {result?.natija.togri_javoblar} <span className='text-xl md:text-3xl'>ta</span>
      </h1>
      <button
        className="btn btn-error text-white text-sm md:text-xl"
        onClick={() => {
          setActiveModal(false);
          navigate("/tasdiqlash-kodi");
        }}
      >
        Close
      </button>
    </div>
  </div>
</div>

  )
}

export default Result