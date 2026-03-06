import React, { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GlobalContext } from "../context/GlobalContext";
import { GrFormNextLink } from "react-icons/gr";
import { apiPost } from "../utils/api";

function Register() {
  const { setUserData } = useContext(GlobalContext);
  const navigate = useNavigate();

  const firstName = useRef();
  const lastname = useRef();
  const username = useRef();
  const password = useRef();
  const phoneNumber = useRef();
  const toifa = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    const newData = {
      first_name: firstName.current.value,
      last_name: lastname.current.value,
      password: password.current.value,
      phone: phoneNumber.current.value,
      toifa: toifa.current.value,
    };
    apiPost("/register", newData)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(JSON.stringify(errorData));
        }
        return res.json();
      })
      .then(() => {
        toast.success("Muvaffaqiyatli 👍");
        navigate("/login");
      })
      .catch((err) => {
        try {
          const errorObj = JSON.parse(err.message);
          Object.values(errorObj).forEach((errArray) => {
            errArray.forEach((message) => toast.error(message));
          });
        } catch (e) {
          console.error("Error parse qilishda xatolik:", e);
        }
      });
  }

  const inputCls = "w-full border border-slate-300 rounded-xl h-12 outline-none px-3 text-slate-800 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition text-base";
  const labelCls = "text-sm font-medium text-slate-600";

  return (
    <div className="w-full min-h-screen flex justify-center items-center px-4 py-8">
      <form
        className="bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col gap-4 p-6 md:p-10 w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-center gap-1 mb-2">
          <img src="/assets/logo-icon.svg" alt="logo" className="h-10 w-10 mb-1" />
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Ro'yxatdan o'tish</h1>
          <p className="text-slate-400 text-sm">Yangi hisob yarating</p>
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelCls}>Ism</label>
          <input ref={firstName} required className={inputCls} type="text" id="firstname" />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Familya</label>
          <input ref={lastname} required className={inputCls} type="text" id="lastname" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-end">
            <label className={labelCls}>Parol</label>
            <span className="text-green-500 text-xs">8 ta belgidan kam bo'lmasin</span>
          </div>
          <input ref={password} required className={inputCls} type="password" id="password" />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Telefon nomer</label>
          <input
            ref={phoneNumber}
            required
            placeholder="+998 90 123 45 67"
            pattern="^\+998[0-9]{9}$"
            className={inputCls}
            type="tel"
            id="phoneNumber"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Toifani tanlang</label>
          <select
            ref={toifa}
            className="w-full border border-slate-300 rounded-xl h-12 outline-none px-3 cursor-pointer bg-white text-slate-800 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition text-base"
            id="toifaselect"
          >
            <option defaultValue="1-Toifa">1-Toifa</option>
            <option value="2-Toifa">2-Toifa</option>
            <option value="Oliy toifa">Oliy toifa</option>
          </select>
        </div>
        <button type="submit" className="btn btn-info text-white text-base md:text-lg rounded-xl h-12 mt-1">
          Ro'yxatdan o'tish
        </button>
        <div className="flex justify-center text-sm text-slate-500">
          <Link to="/login" className="hover:text-indigo-600 transition flex items-center gap-1">
            Kirish <GrFormNextLink className="text-base" />
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
