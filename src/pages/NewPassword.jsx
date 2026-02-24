import React, { useContext, useRef } from "react";
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
    console.log(newData);

    fetch(`${import.meta.env.VITE_BASE_URL}/password-reset/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => {
        navigate("/login");
        toast.success("Parol muvaffaqiyatli o'gartirildi 👍");
      })
      .catch((err) => {
        console.log(err)
        toast.error("Telefon nomer yoki parol xato");
      });
  }
  return (
    <div className="w-full h-screen flex justify-center items-center px-4">
      <form
        className="shadow-2xl h-min rounded-2xl flex flex-col gap-3 md:gap-4 p-5 md:p-8 w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl md:text-4xl font-semibold text-center mb-2 md:mb-4 text-[#abc1e1]">Yangi parol</h1>
        <div className="flex flex-col gap-1 md:gap-0.5">
          <label htmlFor="phoneNumber" className="text-sm md:text-base text-[#abc1e1]">Telefon nomer:</label>
          <input
            ref={phoneNumber}
            required
            placeholder="+998 90 123 45 67"
            pattern="^\+998[0-9]{9}$"
            className="w-full border border-gray-600 rounded-md h-12 outline-0 px-3 text-white text-base"
            type="tel"
            id="phoneNumber"
          />
        </div>
        <div className="flex flex-col gap-1 md:gap-0.5">
          <div className="flex justify-between items-end gap-2">
            <label htmlFor="password" className="text-sm md:text-base text-[#abc1e1] flex-shrink-0">
              Parol:{" "}
            </label>
            <span className="text-green-400 text-xs md:text-sm text-right">
              8 ta belgidan kam bo'lmasligi kerak
            </span>
          </div>
          <input
            ref={password}
            required
            className="w-full border border-gray-600 rounded-md h-12 outline-0 px-3 text-white text-base"
            type="password"
            id="password"
          />
        </div>
        <div className="flex flex-col gap-0.5 mt-2">
          <button
            type="submit"
            className="btn btn-info text-white text-base md:text-lg py-2 rounded-[6px] h-12"
          >
            Yuborish
          </button>
        </div>
        <div className="flex justify-center">
          <Link to="/login" className="text-sm md:text-base text-[#abc1e1] text-center flex items-center">
            Loginga o'tish <GrFormNextLink className="text-xl md:text-2xl"/>
          </Link>
        </div>
      </form>
    </div>
  )
}

export default NewPassword