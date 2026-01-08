import React, { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GlobalContext } from "../context/GlobalContext";
import { GrFormNextLink } from "react-icons/gr";

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

    console.log('🔐 Login attempt:', { phone: newData.phone });

    fetch(`${import.meta.env.VITE_BASE_URL}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    })
      .then((res) => {
        console.log('📡 Login response status:', res.status);
        if (!res.ok) {
          return res.json().then(errData => {
            console.error('❌ Login error:', errData);
            throw new Error(errData.non_field_errors?.[0] || 'Login xatosi');
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log('✅ Login successful:', data);
        setUserData(data);
        sessionStorage.setItem("user-data", JSON.stringify(data));
        toast.success("Muvaffaqiyatli 👍");
        navigate("/");
      })
      .catch((err) => {
        console.error('❌ Login catch error:', err);
        toast.error(err.message || "Telefon nomer yoki parol xato");
      });
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <form
        className="shadow-2xl h-min rounded-2xl flex flex-col gap-3 md:gap-4 p-5"
        onSubmit={handleSubmit}
      >
        <h1 className="md:text-5xl text-3xl font-semibold text-center mb-4 text-[#abc1e1]">Login</h1>
        <div className="flex flex-col gap-0.5">
          <label htmlFor="phoneNumber" className="text-[#abc1e1]">Telefon nomer:</label>
          <input
            ref={phoneNumber}
            required
             placeholder="+998 90 123 45 67"
            pattern="^\+998[0-9]{9}$"
            className="sm:w-96 w-80 border border-gray-600 rounded-md h-12 outline-0 px-2 text-white"
            type="tel"
            id="phoneNumber"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <label htmlFor="password" className="text-[#abc1e1]">Parol:</label>
          <input
            ref={password}
            required
            className="sm:w-96 w-80 border border-gray-600 rounded-md h-12 outline-0 px-2 text-white"
            type="password"
            id="password"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <button
            type="submit"
            className="btn btn-info text-white text-lg py-2 rounded-[6px]"
          >
            Yuborish
          </button>
        </div>
        <div className="flex justify-end opacity-80"><Link to="/yangi-parol" className="text-[#abc1e1] text-center flex items-center">Parolni unutdingizmi?</Link></div>
        <div className="flex justify-center"><Link to="/register" className="text-[#abc1e1] text-center flex items-center">Ro'yxatdan o'tish  <GrFormNextLink className="text-2xl"/> </Link></div>
      </form>
    </div>
  );
}

export default Login;
