import React, { useContext } from 'react'
import { GlobalContext } from '../../context/GlobalContext';

function Result() {
    const { activeModal, setActiveModal } = useContext(GlobalContext);
  return (
    <div className='fixed top-0 left-0 w-full h-screen flex justify-center items-center bg-black opacity-60 z-10'>
        <div className='text-white flex justify-center items-center shadow-2xl rounded-2xl p-5 w-full md:w-96 md:p-10 border border-amber-400 z-50 bg-[#263244]'>
            <div className='flex flex-col gap-5 items-center'>
                <p className='text-2xl'>Natija</p>
                <h1 className='text-amber-400 font-bold text-5xl'>45 <span>ball</span></h1>
            <button className='btn btn-error text-white' onClick={()=>setActiveModal(false)}>close</button>
            </div>
        </div>
    </div>
  )
}

export default Result