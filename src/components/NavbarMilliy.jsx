import React, { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { BsQuestionSquare } from "react-icons/bs";
import { IoLogOutOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import userImage from "../../public/assets/user.jfif";
import { FaUser } from "react-icons/fa";
import Time from "./Time";

function NavbarMilliy() {

  const { userData, setUserData } = useContext(GlobalContext);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    setUserData(null);
    // sessionStorage.setItem("loggedIn", "false");
  }

  return (
    <div className={`navbar bg-[#3B4D66] shadow-2xl flex flex-col justify-center items-center md:flex-row`}>
      <div className="px-2 w-full md:pb-0 md:max-w-[1300px] md:w-full md:px-[50px] md:h-20 flex justify-between items-center">
        <h1 className="font-bold text-xl gap-2 md:text-3xl text-base-500 flex items-center md:gap-5 text-[#abc1e1]">
          <BsQuestionSquare /> Milliy sertifikat uchun testlar
        </h1>
        <div className="items-center gap-7 hidden md:flex">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[#abc1e1] cursor-pointer"
          >
            Chiqish <IoLogOutOutline className="text-3xl" />
          </button>
        </div>

        {/* avatar */}
        {/* <div className="dropdown dropdown-end md:hidden">
          <div
            tabIndex="0"
            role="button"
            className="btn btn-ghost btn-circle avatar hover:border-none focus:border-none"
          >
            <div className="w-10 rounded-full">
              <img
                className="object-cover"
                src={userImage}
                alt="Default user"
              />
            </div>
          </div>
          <ul
            tabIndex="0"
            className={`mt-3 z-[1] p-2 menu menu-sm border border-gray-300 dropdown-content bg-[#3B4D66] shadow-2xl rounded-box w-40`}
          >
            <li>
              <a className="flex items-center gap-2 text-white">
                <FaUser style={{ color: "white", fontSize: "15px" }} />{" "}
                {userData?.first_name + " " + userData?.last_name}
              </a>
            </li>
            <li>
              <a
                onClick={handleLogout}
                className="text-white flex gap-2 items-center"
              >
                <IoLogOutOutline className="text-xl" /> Chiqish{" "}
              </a>
            </li>
          </ul>
        </div> */}
      </div>
      {/* <div className="md:hidden mt-2 w-full flex justify-between items-center px-2">
        {showResult || (isFinished == "true") ? (
          <Link
            onClick={handleClearTime}
            type="button"
            className={`btn btn-outline btn-info btn-sm text-white rounded-[8px]`}
          >
            Testlarga qaytish
          </Link>
        ) : (
          <h1 className="text-white text-md">
            Testlar soni: <span>{testLength}</span>
          </h1>
        )}
        <Time
          showResult={showResult}
          isFinished={isFinished}
          initialTime={2 * 60 * 60 * 1000}
          onTimeUp={() => {
            if (!isSubmittedRef.current) {
              const fakeEvent = { preventDefault: () => {} };
              handleSubmit(fakeEvent);
            }
          }}
        />

        {showResult || (isFinished == "true") ? (
          <h1 className="flex items-center gap-1 font-bold text-info">
            Natija:{" "}
            <span className="text-[18px]">
              {(result == null || result*1 == 0) && natija*1 ? natija : result}
            </span>
          </h1>
        ) : (
          <button
            onClick={handleSubmitPermition}
            disabled={result ? true : false}
            className="btn btn-outline btn-info btn-sm text-white rounded-[8px]"
          >
            Yakunlash
          </button>
        )}
      </div> */}
    </div>
  );
}

export default NavbarMilliy;
