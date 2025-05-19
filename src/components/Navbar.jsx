import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { BsQuestionSquare } from "react-icons/bs";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import userImage from "../../public/assets/user.jfif";

const themeFromLocalStorage = () => {
  return localStorage.getItem("theme") || "dracula";
};

function Navbar() {
  const { setIsTheme, setUserData } = useContext(GlobalContext);
  const [theme, setTheme] = useState(themeFromLocalStorage());
  const navigate = useNavigate();

const userName = JSON.parse(localStorage.getItem("user-data"))

  function handleLogout() {
    localStorage.clear();
    setTheme("dracula");
    setUserData(null);
    navigate("/register");
  }

  const toggleTheme = () => {
    const newTheme = theme == "cupcake" ? "dracula" : "cupcake";
    setTheme(newTheme);
  };

  useEffect(() => {
    setIsTheme(theme);
    document.body.classList = "";
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div
      className={`navbar ${
        theme == "cupcake" ? "bg-[#F4F6FA] shadow" : "bg-[#3B4D66] shadow-2xl"
      } mb-8 `}
    >
      <div className="container h-20 flex justify-between items-center">
        <h1 className="font-bold text-4xl text-base-500 flex items-center gap-5">
          <BsQuestionSquare /> Toifa uchun testlar
        </h1>
        <div className="flex items-center gap-7">
          <label className="flex cursor-pointer gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
            <input
              onClick={toggleTheme}
              defaultChecked={theme == "cupcake" ? false : true}
              type="checkbox"
              value="synthwave"
              className="toggle theme-controller border border-gray-500 hover:border-gray-600 toggle-info"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </label>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border-l pl-7"
          >
            Chiqish <IoLogOutOutline className="text-3xl" />
          </button>
        </div>

        <div class="dropdown dropdown-end md:hidden">
          <div
            tabindex="0"
            role="button"
            class="btn btn-ghost btn-circle avatar hover:border-none focus:border-none"
          >
            <div class="w-10 rounded-full">
              <img
                className="object-cover"
                src={userImage}
                alt="Default user"
              />
            </div>
          </div>
          <ul
            tabindex="0"
            class={`mt-3 z-[1] p-2 shadow menu menu-sm border border-gray-300 dropdown-content ${
              theme == "cupcake"
                ? "bg-[#F4F6FA] shadow"
                : "bg-[#3B4D66] shadow-2xl"
            } rounded-box w-32`}
          >
            <li>
              <a class="justify-between">
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
