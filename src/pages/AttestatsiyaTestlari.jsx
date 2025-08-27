import { Link } from "react-router-dom";
import React from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useGetFetch } from "../hooks/useGetFetch";

function AttestatsiyaTestlari() {
  const userData = JSON.parse(localStorage.getItem("user-data"));
  
    // get data
    const {
      data,
      isPending,
      error,
    } = useGetFetch(`${import.meta.env.VITE_BASE_URL}/test-list-exclude-active-intihon/${userData.user_id}/`);
    console.log(data);
    
    return (
    <div className=" md:max-w-[1000px] sm:w-full px-5 md:mr-auto md:ml-auto">
      <div className="relative flex justify-center items-center md:py-10 py-5">
        <Link to="/option" className="absolute left-0 hidden text-white md:flex items-center gap-3"><FaArrowLeftLong/> Orqaga</Link>
        <div className="flex flex-col gap-2">
          <h1 className="text-center text-2xl md:text-4xl text-[#abc1e1]">
            Attestatsiya testlari
          </h1>
          <p className="text-center text-white text-xl">
            Test natijalaringiz va mavjud testlar
          </p>
        </div>
      </div>
      <div className="md:max-w-[800px] lg:max-w-[1000px] md:mr-auto md:ml-auto">
        <div className="bg-gray-800 opacity-75 rounded-2xl flex md:flex-row flex-col md:gap-0 gap-5 justify-between items-center px-5 py-10">
          <IoMdCheckmarkCircleOutline className="md:text-3xl text-3xl text-emerald-400 font-bold"/>
          <div>
            <h3 className="text-white md:text-3xl text-xl">Matematika asoslari</h3>
            <p className="text-[#abc1e1] text-center">05.05.2025</p>
          </div>
          <div>
            <h3 className="text-white md:text-3xl text-xl">
            30/35 
          </h3>
          <p className="text-[#abc1e1] text-center">ball</p>
          </div>
          <Link to="/" className="btn btn-primary text-white">Ko‘rish</Link>
        </div>
      </div>
    </div>
  );
}

export default AttestatsiyaTestlari;
