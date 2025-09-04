import React, { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GlobalContext } from "../context/GlobalContext";
import { GrFormNextLink } from "react-icons/gr";

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
      // username: username.current.value,
      password: password.current.value,
      phone: phoneNumber.current.value,
      toifa: toifa.current.value,
    };

    fetch(`${import.meta.env.VITE_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(JSON.stringify(errorData));
        }
        return res.json();
      })
      .then((data) => {
        // localStorage.setItem("user-data", JSON.stringify(data));
        // setUserData(data)
        // navigate("/quiz");
        toast.success("Muvaffaqiyatli 👍");
        navigate("/login");
      })
      .catch((err) => {
        try {
          const errorObj = JSON.parse(err.message); // string → object
          Object.values(errorObj).forEach((errArray) => {
            errArray.forEach((message) => {
              toast.error(message);
            });
          });
        } catch (e) {
          console.error("Error parse qilishda xatolik:", e);
        }

        // try {
        //   const parsedError = JSON.parse(err.message);

        //   // Agar parsedError.username mavjud bo‘lsa
        //   if (parsedError.username && Array.isArray(parsedError.username)) {
        //     toast.error(parsedError.username[0]); // "Bu username band."
        //   } else {
        //     toast.error("Xatolik yuz berdi");
        //   }
        // } catch {
        //   toast.error("Xatolik yuz berdi");
        // }
      });
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <form
        className="shadow-2xl h-min rounded-2xl flex flex-col gap-3 md:gap-4 p-5"
        onSubmit={handleSubmit}
      >
        <h1 className="md:text-5xl text-3xl font-semibold text-center mb-4 text-[#abc1e1]">
          Register
        </h1>
        <div className="flex flex-col gap-0.5">
          <label htmlFor="firstname" className="text-[#abc1e1]">
            Ism:
          </label>
          <input
            ref={firstName}
            required
            className="sm:w-96 w-80 border border-gray-600 rounded-md h-12 outline-0 px-2 text-white"
            type="text"
            id="firstname"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <label htmlFor="lastname" className="text-[#abc1e1]">
            Familya:
          </label>
          <input
            ref={lastname}
            required
            className="sm:w-96 w-80 border border-gray-600 rounded-md h-12 outline-0 px-2 text-white"
            type="text"
            id="lastname"
          />
        </div>
        {/* <div className="flex flex-col gap-0.5">
          <label htmlFor="username" className="text-[#abc1e1]">
            Username:
          </label>
          <input
            ref={username}
            required
            className="sm:w-96 w-80 border border-gray-600 rounded-md h-12 outline-0 px-2 text-white"
            type="text"
            id="username"
          />
        </div> */}
        <div className="flex flex-col gap-0.5">
          <div className="flex justify-between items-end">
            <label htmlFor="password" className="text-[#abc1e1]">
              Parol:{" "}
            </label>
            <span className="text-green-400 text-sm">
              8 ta belgidan kam bo'lmasligi kerak
            </span>
          </div>
          <input
            ref={password}
            required
            className="sm:w-96 w-80 border border-gray-600 rounded-md h-12 outline-0 px-2 text-white"
            type="password"
            id="password"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <label htmlFor="phonenumber" className="text-[#abc1e1]">
            Telefon nomer:
          </label>
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
          <label htmlFor="toifaselect" className="text-[#abc1e1]">
            Toifani tanlang:
          </label>
          <select
            ref={toifa}
            className="sm:w-96 w-80 border border-gray-600 rounded-md h-12 outline-0 px-2 cursor-pointer bg-[#3B4D66] text-white"
            id="toifaselect"
          >
            <option defaultValue="1-Toifa">1-Toifa</option>
            <option value="2-Toifa">2-Toifa</option>
            <option value="Oliy toifa">Oliy toifa</option>
          </select>
        </div>
        <div className="flex flex-col gap-0.5">
          <button
            type="submit"
            className="btn btn-info text-white text-lg py-2 rounded-[6px]"
          >
            Yuborish
          </button>
        </div>
        <div className="flex justify-center">
          <Link
            to="/login"
            className="text-[#abc1e1] text-center flex items-center"
          >
            Login <GrFormNextLink className="text-2xl" />
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
