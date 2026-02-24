import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useGetFetch } from "../hooks/useGetFetch";
import { GlobalContext } from "../context/GlobalContext";

function AttestatsiyaTestlari() {
  // const userData = JSON.parse(localStorage.getItem("user-data"));
  const {userData} = useContext(GlobalContext)

  // get data
  const {
    data: optionTest,
    isPending,
    error,
  } = useGetFetch(
    `${import.meta.env.VITE_BASE_URL}/test-list-exclude-active-intihon/${
      userData.user_id
    }/`
  );  

  return (
    <div className="md:max-w-[1000px] w-full px-3 md:px-5 md:mr-auto md:ml-auto">
      <div className="relative flex justify-center items-center py-5 md:py-10">
        <Link
          to="/"
          className="absolute left-0 text-white flex items-center gap-2 md:gap-3 text-sm md:text-base"
        >
          <FaArrowLeftLong className="text-sm md:text-base" /> <span className="hidden sm:inline">Orqaga</span>
        </Link>
        <div className="flex flex-col gap-1 md:gap-2">
          <h1 className="text-center text-xl sm:text-2xl md:text-4xl text-[#abc1e1]">
            Attestatsiya testlari
          </h1>
          <p className="text-center text-white text-sm sm:text-base md:text-xl">
            Test natijalaringiz va mavjud testlar
          </p>
        </div>
      </div>
      <div className="md:max-w-[800px] lg:max-w-[1000px] md:mr-auto md:ml-auto">
        {optionTest &&
          optionTest.slice().reverse().map((item, index) => {
            return (
              <div key={item.id} className="bg-gray-800 opacity-75 rounded-xl md:rounded-2xl flex flex-col md:flex-row gap-3 md:gap-5 justify-between items-center px-3 sm:px-4 md:px-5 py-5 md:py-10 mb-3 md:mb-5">
                <IoMdCheckmarkCircleOutline className={`text-2xl md:text-3xl ${0 == index ? "text-emerald-400" : item.is_finished == true ? "text-blue-400" : "text-amber-600"} font-bold`} />
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-white text-lg sm:text-xl md:text-3xl font-semibold">
                    {item.name}
                  </h3>
                  {/* <p className="text-[#abc1e1] text-center">05.05.2025</p> */}
                </div>
                <div className="text-center">
                  <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold">{item.natija}/{item.jami_savollar}</h3>
                  <p className="text-[#abc1e1] text-sm md:text-base">ball</p>
                </div>
                {
                  0 == index 
                  ? 
                  <Link to={`/quiz/${item.intihon_id}?finished=${item.is_finished}&result=${item.natija}`} className="btn btn-sm md:btn-md bg-emerald-600 text-white w-full md:w-auto md:min-w-[135px] text-sm md:text-base">
                    Aktiv test
                  </Link> 
                  :
                  item.is_finished == true 
                  ? <Link to={`/quiz/${item.intihon_id}?finished=${item.is_finished}&result=${item.natija}`} className="btn btn-sm md:btn-md bg-blue-600 text-white w-full md:w-auto md:min-w-[135px] text-sm md:text-base">
                    Ko'rish
                  </Link>
                  :
                  <Link to={`/quiz/${item.intihon_id}?finished=${item.is_finished}&result=${item.natija}`} className="btn btn-sm md:btn-md bg-amber-600 text-white w-full md:w-auto md:min-w-[135px] text-sm md:text-base">
                    Testni boshlash
                  </Link>
                }               
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default AttestatsiyaTestlari;
