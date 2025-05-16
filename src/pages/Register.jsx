import React, { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GlobalContext } from "../context/GlobalContext";

function Register() {
  const {setUserData} = useContext(GlobalContext)
  const navigate = useNavigate();

  const firstName = useRef();
  const lastname = useRef();
  const phoneNumber = useRef();
  const toifa = useRef();

  function handleSubmit(e) {
    e.preventDefault();

    const newData = {
      ism: firstName.current.value,
      familya: lastname.current.value,
      tel: phoneNumber.current.value,
      toifa: toifa.current.value,
    };

    fetch(`${import.meta.env.VITE_BASE_URL}/user-data/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => {
        localStorage.setItem("user-data", JSON.stringify(data));
        setUserData(data)
        navigate("/quiz");
        toast.success("Muvaffaqiyatli 👍");
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <form
        className="shadow-2xl h-min rounded-2xl flex flex-col gap-4 p-5"
        onSubmit={handleSubmit}
      >
        <h1 className="text-5xl font-semibold text-center mb-4">Register</h1>
        <div className="flex flex-col gap-0.5">
          <label htmlFor="firstname">Ism:</label>
          <input
            ref={firstName}
            required
            className="sm:w-96 w-80 border border-gray-600 rounded-md h-12 outline-0 px-2"
            type="text"
            id="firstname"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <label htmlFor="lastname">Familya:</label>
          <input
            ref={lastname}
            required
            className="sm:w-96 w-80 border border-gray-600 rounded-md h-12 outline-0 px-2"
            type="text"
            id="lastname"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <label htmlFor="phonenumber">Telefon nomer:</label>
          <input
            ref={phoneNumber}
            required
            className="sm:w-96 w-80 border border-gray-600 rounded-md h-12 outline-0 px-2"
            type="text"
            id="phonenumber"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <label htmlFor="toifaselect">Toifani tanlang:</label>
          <select
            ref={toifa}
            className="sm:w-96 w-80 border border-gray-600 rounded-md h-12 outline-0 px-2"
            id="toifaselect"
          >
            <option defaultValue="1-toifa">1-Toifa</option>
            <option value="2-toifa">2-Toifa</option>
            <option value="Oliy toifa">Oliy toifa</option>
          </select>
        </div>
        <div className="flex flex-col gap-0.5">
          <button
            type="submit"
            className="btn btn-info text-white text-lg py-2 rounded-[6px]"
          >
            Testni boshlash
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
