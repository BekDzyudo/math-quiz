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
    <div className=" md:max-w-[1000px] sm:w-full px-5 md:mr-auto md:ml-auto">
      <div className="relative flex justify-center items-center md:py-10 py-5">
        <Link
          to="/"
          className="absolute left-0 hidden text-white md:flex items-center gap-3"
        >
          <FaArrowLeftLong /> Orqaga
        </Link>
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
        {optionTest &&
          optionTest.slice().reverse().map((item, index) => {
            return (
              <div key={item.id} className="bg-gray-800 opacity-75 rounded-2xl flex md:flex-row flex-col md:gap-0 gap-5 justify-between items-center px-5 py-10 md:mb-5 mb-2.5">
                <IoMdCheckmarkCircleOutline className={`md:text-3xl text-3xl ${0 == index ? "text-emerald-400" : item.is_finished == true ? "text-blue-400" : "text-amber-600"} font-bold`} />
                <div>
                  <h3 className="text-white md:text-3xl text-xl">
                    {item.name}
                  </h3>
                  {/* <p className="text-[#abc1e1] text-center">05.05.2025</p> */}
                </div>
                <div>
                  <h3 className="text-white md:text-3xl text-xl">{item.natija}/35</h3>
                  <p className="text-[#abc1e1] text-center">ball</p>
                </div>
                {
                  0 == index 
                  ? 
                  <Link to={`/quiz/${item.intihon_id}?finished=${item.is_finished}&result=${item.natija}`}  className="btn bg-emerald-600 text-white min-w-[135px]">
                  Aktiv test
                </Link> 
                :
                  item.is_finished == true 
                  ? <Link to={`/quiz/${item.intihon_id}?finished=${item.is_finished}&result=${item.natija}`}  className="btn bg-blue-600 text-white min-w-[135px]">
                  Ko‘rish
                </Link>
                :
                   <Link to={`/quiz/${item.intihon_id}?finished=${item.is_finished}&result=${item.natija}`} className="btn bg-amber-600 text-white min-w-[135px]">
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
