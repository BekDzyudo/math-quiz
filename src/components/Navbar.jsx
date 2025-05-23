import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { BsQuestionSquare } from "react-icons/bs";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import userImage from "../../public/assets/user.jfif";

// const themeFromLocalStorage = () => {
//   return localStorage.getItem("theme") || "dracula";
// };

function Navbar() {
  const { userData, setUserData } = useContext(GlobalContext);
  // const [theme, setTheme] = useState(themeFromLocalStorage());
  const navigate = useNavigate();

const userName = JSON.parse(localStorage.getItem("user-data"))

  function handleLogout() {
    localStorage.clear();
    setUserData(null)
    // setTheme("dracula");
  }
  useEffect(() => {
  if (userData === null) {
    navigate("/");
  }
}, [userData]);

  // const toggleTheme = () => {
  //   const newTheme = theme == "cupcake" ? "dracula" : "cupcake";
  //   setTheme(newTheme);
  // };

  // useEffect(() => {
  //   setIsTheme(theme);
  //   document.body.classList = "";
  //   document.body.classList.add(theme);
  //   localStorage.setItem("theme", theme);
  // }, [theme]);

  return (
    <div
      className={`navbar bg-[#3B4D66] shadow-2xl`}
    >
      <div className="container h-20 flex justify-between items-center">
        <h1 className="font-bold text-4xl text-base-500 flex items-center gap-5 text-[#abc1e1]">
          <BsQuestionSquare /> Toifa uchun testlar
        </h1>
        <div className="flex items-center gap-7">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[#abc1e1] cursor-pointer"
          >
            Chiqish <IoLogOutOutline className="text-3xl" />
          </button>
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
            className={`mt-3 z-[1] p-2 menu menu-sm border border-gray-300 dropdown-content bg-[#3B4D66] shadow-2xl rounded-box w-32`}
          >
            <li>
              <a className="justify-between">
                {userName?.ism + " " + userName?.familya}
              </a>
            </li>
            <li>
              <a>Sozlamalar</a>
            </li>
            <li>
              <a>Chiqish</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
