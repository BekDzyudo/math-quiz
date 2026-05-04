import React, { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { IoLogOutOutline } from "react-icons/io5";
import { Link, useNavigate, useLocation } from "react-router-dom";
// Use URL for public assets
const userImage = "/assets/user.jfif";
import { FaUser } from "react-icons/fa";
import Time from "./Time";

function Navbar({
  testLength,
  handleSubmitPermition,
  result,
  showResult,
  isSubmittedRef,
  handleSubmit,
  isFinished,
  natija,
  handleClearTime,
  onTimeUp,
  quizId,
}) {
  const { userData, setUserData } = useContext(GlobalContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isQuizPage = location.pathname.startsWith("/quiz/");

  const userName = JSON.parse(localStorage.getItem("user-data"));
  function handleLogout() {
    // Backend logout endpoint'ga so'rov yuborish
    fetch(`${import.meta.env.VITE_BASE_URL}/logout/`, {
      method: "POST",
      credentials: 'include', // Cookie yuborish
    })
      .then(() => {
        console.log('✅ Logout successful');
      })
      .catch((err) => {
        console.error('❌ Logout error:', err);
      })
      .finally(() => {
        // Frontend state ni tozalash
        localStorage.clear();
        setUserData(null);
      });
  }
  useEffect(() => {
    if (userData === null) {
      navigate("/");
    }
  }, [userData]);
  return (
    <div className={`navbar bg-indigo-600 shadow-lg flex flex-col md:flex-row`}>
      <div className="px-2 w-full pb-2 md:pb-0 md:max-w-[1300px] md:w-full md:mr-auto md:ml-auto md:px-[50px] md:h-20 flex justify-between items-center md:border-none border-b border-indigo-500">
        <div className="flex items-center gap-3">
          <img src="/assets/logo-icon.svg" alt="Matematika Pro" className="h-10 w-10" />
          <div className="flex flex-col leading-tight">
            <span className="font-extrabold text-lg md:text-2xl text-white tracking-tight">MATEMATIKA</span>
            <span className="text-xs md:text-sm font-semibold text-[#818CF8] tracking-widest -mt-1">PRO</span>
          </div>
        </div>
        <div className="items-center gap-7 hidden md:flex">
          {isQuizPage ? (
            <Link
              to="/"
              onClick={handleClearTime}
              className="flex items-center gap-2 text-indigo-100 cursor-pointer"
            >
              Testlar ro'yxati <IoLogOutOutline className="text-3xl" />
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-indigo-100 cursor-pointer"
            >
              Chiqish <IoLogOutOutline className="text-3xl" />
            </button>
          )}
        </div>

        {/* avatar */}
        <div className="dropdown dropdown-end md:hidden">
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
            className={`mt-3 z-[1] p-2 menu menu-sm border border-gray-300 dropdown-content bg-indigo-600 shadow-2xl rounded-box w-40`}
          >
            <li>
              <a className="flex items-center gap-2 text-white">
                <FaUser style={{ color: "white", fontSize: "15px" }} />{" "}
                {userData?.first_name + " " + userData?.last_name}
              </a>
            </li>
            <li>
              {isQuizPage ? (
                <Link
                  to="/"
                  onClick={handleClearTime}
                  className="text-white flex gap-2 items-center"
                >
                  <IoLogOutOutline className="text-xl" /> Testlar ro'yxati
                </Link>
              ) : (
                <a
                  onClick={handleLogout}
                  className="text-white flex gap-2 items-center"
                >
                  <IoLogOutOutline className="text-xl" /> Chiqish
                </a>
              )}
            </li>
          </ul>
        </div>
      </div>
      <div className="md:hidden mt-2 w-full flex flex-wrap justify-between items-center gap-2 px-2 pb-2">
        {showResult || (isFinished == "true") ? (
          <Link
            onClick={handleClearTime}
            type="button"
            className={`btn btn-outline btn-info btn-sm text-white rounded-[8px] flex-shrink-0`}
          >
            Testlarga qaytish
          </Link>
        ) : (
          <h1 className="text-white text-sm md:text-md flex-shrink-0">
            Testlar soni: <span className="font-semibold">{testLength}</span>
          </h1>
        )}
        <Time
          key={quizId}
          quizId={quizId}
          showResult={showResult}
          isFinished={isFinished}
          initialTime={2 * 60 * 60 * 1000}
          onTimeUp={onTimeUp}
        />

        {showResult || (isFinished == "true") ? (
          <h1 className="flex items-center gap-1 text-sm font-bold text-info flex-shrink-0">
            Natija:{" "}
            <span className="text-base md:text-[18px]">
              {(result == null || result * 1 == 0) && natija * 1 ? natija : result}
            </span>
          </h1>
        ) : (
          <button
            onClick={handleSubmitPermition}
            disabled={result ? true : false}
            className="btn btn-outline btn-info btn-sm text-white rounded-[8px] flex-shrink-0"
          >
            Yakunlash
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
