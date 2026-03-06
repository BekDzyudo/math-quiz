import React, { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GlobalContext } from "../context/GlobalContext";
import { GrFormNextLink } from "react-icons/gr";
import { apiPost } from "../utils/api";

function Login() {
  const {setUserData} = useContext(GlobalContext)
  const navigate = useNavigate();

  const phoneNumber = useRef();
  const password = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    const newData = {
      phone: phoneNumber.current.value,
      password: password.current.value,
    };
    apiPost("/login/", newData)
      .then((res) => {
        if (!res.ok) {
          return res.json().then(errData => {
            throw new Error(errData.non_field_errors?.[0] || 'Login xatosi');
          });
        }
        return res.json();
      })
      .then((data) => {
        setUserData(data);
        toast.success("Muvaffaqiyatli 👍");
        navigate("/");
      })
      .catch((err) => {
        toast.error(err.message || "Telefon nomer yoki parol xato");
      });
  }

  return (
    <div className="w-full h-screen flex justify-center items-center px-4">
      <form
        className="bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col gap-4 p-6 md:p-10 w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-center gap-1 mb-2">
          <img src="/assets/logo-icon.svg" alt="logo" className="h-10 w-10 mb-1" />
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Kirish</h1>
          <p className="text-slate-400 text-sm">Hisobingizga kiring</p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="phoneNumber" className="text-sm font-medium text-slate-600">Telefon nomer</label>
          <input
            ref={phoneNumber}
            required
            placeholder="+998 90 123 45 67"
            pattern="^\+998[0-9]{9}$"
            className="w-full border border-slate-300 rounded-xl h-12 outline-none px-3 text-slate-800 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition text-base"
            type="tel"
            id="phoneNumber"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium text-slate-600">Parol</label>
          <input
            ref={password}
            required
            className="w-full border border-slate-300 rounded-xl h-12 outline-none px-3 text-slate-800 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition text-base"
            type="password"
            id="password"
          />
        </div>
        <button type="submit" className="btn btn-info text-white text-base md:text-lg rounded-xl h-12 mt-1">
          Kirish
        </button>
        <div className="flex justify-between text-sm text-slate-500">
          <Link to="/yangi-parol" className="hover:text-indigo-600 transition">Parolni unutdingizmi?</Link>
          <Link to="/register" className="hover:text-indigo-600 transition flex items-center gap-1">
            Ro'yxatdan o'tish <GrFormNextLink className="text-base"/>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
