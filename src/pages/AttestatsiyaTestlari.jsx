import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useGetFetch } from "../hooks/useGetFetch";
import { GlobalContext } from "../context/GlobalContext";

function AttestatsiyaTestlari() {
  const {userData} = useContext(GlobalContext)
  const {
    data: optionTest,
    isPending,
  } = useGetFetch(
    `${import.meta.env.VITE_BASE_URL}/test-list-exclude-active-intihon/${userData.user_id}/`
  );

  return (
    <div className="md:max-w-[1000px] w-full px-3 md:px-5 md:mr-auto md:ml-auto">
      <div className="relative flex justify-center items-center py-5 md:py-10">
        <Link
          to="/"
          className="absolute left-0 text-slate-500 hover:text-indigo-600 transition flex items-center gap-2 text-sm md:text-base"
        >
          <FaArrowLeftLong /> <span className="hidden sm:inline">Orqaga</span>
        </Link>
        <div className="flex flex-col gap-1 md:gap-2 text-center">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-slate-800">
            Attestatsiya testlari
          </h1>
          <p className="text-slate-500 text-sm sm:text-base md:text-lg">
            Test natijalaringiz va mavjud testlar
          </p>
        </div>
      </div>

      {isPending && <p className="text-center text-slate-400 py-10">Yuklanmoqda...</p>}

      <div className="md:max-w-[800px] lg:max-w-[1000px] md:mr-auto md:ml-auto flex flex-col gap-3 md:gap-4">
        {optionTest &&
          optionTest.slice().reverse().map((item, index) => {
            const isActive = index === 0;
            const isFinished = item.is_finished === true;
            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl md:rounded-2xl shadow-sm flex flex-col md:flex-row gap-3 md:gap-5 justify-between items-center px-4 md:px-6 py-4 md:py-6 hover:shadow-md transition-shadow"
              >
                <IoMdCheckmarkCircleOutline
                  className={`text-2xl md:text-3xl flex-shrink-0 ${
                    isActive ? "text-emerald-500" : isFinished ? "text-indigo-400" : "text-amber-500"
                  }`}
                />
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-slate-800 text-lg sm:text-xl md:text-2xl font-semibold">
                    {item.name}
                  </h3>
                </div>
                <div className="text-center">
                  <h3 className="text-slate-800 text-xl sm:text-2xl md:text-3xl font-bold">
                    {item.natija}/{item.jami_savollar}
                  </h3>
                  <p className="text-slate-400 text-sm">ball</p>
                </div>
                {isActive ? (
                  <Link
                    to={`/quiz/${item.intihon_id}?finished=${item.is_finished}&result=${item.natija}`}
                    className="btn btn-sm md:btn-md bg-emerald-500 text-white border-0 w-full md:w-auto md:min-w-[135px] text-sm md:text-base hover:bg-emerald-600"
                  >
                    Aktiv test
                  </Link>
                ) : isFinished ? (
                  <Link
                    to={`/quiz/${item.intihon_id}?finished=${item.is_finished}&result=${item.natija}`}
                    className="btn btn-sm md:btn-md btn-info text-white border-0 w-full md:w-auto md:min-w-[135px] text-sm md:text-base"
                  >
                    Ko'rish
                  </Link>
                ) : (
                  <Link
                    to={`/quiz/${item.intihon_id}?finished=${item.is_finished}&result=${item.natija}`}
                    className="btn btn-sm md:btn-md bg-amber-500 text-white border-0 w-full md:w-auto md:min-w-[135px] text-sm md:text-base hover:bg-amber-600"
                  >
                    Testni boshlash
                  </Link>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default AttestatsiyaTestlari;
