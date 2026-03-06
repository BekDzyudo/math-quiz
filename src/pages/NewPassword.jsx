import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GrFormNextLink } from "react-icons/gr";

function NewPassword() {
  const navigate = useNavigate();
  const phoneNumber = useRef();
  const password = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    const newData = {
      phone: phoneNumber.current.value,
      new_password: password.current.value,
    };
    fetch(`${import.meta.env.VITE_BASE_URL}/password-reset/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(() => {
        navigate("/login");
        toast.success("Parol muvaffaqiyatli o'gartirildi 👍");
      })
      .catch(() => {
        toast.error("Telefon nomer yoki parol xato");
      });
  }

  const inputCls = "w-full border border-slate-300 rounded-xl h-12 outline-none px-3 text-slate-800 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition text-base";

  return (
    <div className="w-full h-screen flex justify-center items-center px-4">
      <form
        className="bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col gap-4 p-6 md:p-10 w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-center gap-1 mb-2">
          <img src="/assets/logo-icon.svg" alt="logo" className="h-10 w-10 mb-1" />
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Yangi parol</h1>
          <p className="text-slate-400 text-sm">Parolingizni tiklang</p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-600">Telefon nomer</label>
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
          <div className="flex justify-between items-end">
            <label className="text-sm font-medium text-slate-600">Yangi parol</label>
            <span className="text-green-500 text-xs">8 ta belgidan kam bo'lmasin</span>
          </div>
          <input ref={password} required className={inputCls} type="password" id="password" />
        </div>
        <button type="submit" className="btn btn-info text-white text-base md:text-lg rounded-xl h-12 mt-1">
          Saqlash
        </button>
        <div className="flex justify-center text-sm text-slate-500">
          <Link to="/login" className="hover:text-indigo-600 transition flex items-center gap-1">
            Loginga o'tish <GrFormNextLink className="text-base"/>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default NewPassword;
