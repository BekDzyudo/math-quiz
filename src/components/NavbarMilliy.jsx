import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function NavbarMilliy() {
  const { userData, setUserData } = useContext(GlobalContext);
  const navigate = useNavigate();

  function handleLogout() {
    fetch(`${import.meta.env.VITE_BASE_URL}/logout/`, {
      method: "POST",
      credentials: 'include',
    })
      .catch((err) => console.error('Logout error:', err))
      .finally(() => {
        localStorage.clear();
        setUserData(null);
        navigate("/");
      });
  }

  return (
    <div className="navbar bg-indigo-600 shadow-lg flex flex-col md:flex-row">
      <div className="px-2 w-full md:pb-0 md:max-w-[1300px] md:w-full md:px-[50px] md:h-20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/assets/logo-icon.svg" alt="logo" className="h-9 w-9" />
          <div className="flex flex-col leading-tight">
            <span className="font-extrabold text-base md:text-xl text-white tracking-tight">MATEMATIKA</span>
            <span className="text-[10px] md:text-xs font-bold text-indigo-200 tracking-widest -mt-0.5">PRO</span>
          </div>
        </div>
        <div className="items-center gap-7 hidden md:flex">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-indigo-100 hover:text-white transition cursor-pointer"
          >
            Chiqish <IoLogOutOutline className="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default NavbarMilliy;
