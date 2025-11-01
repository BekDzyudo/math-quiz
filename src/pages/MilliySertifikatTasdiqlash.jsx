import {Link, useNavigate} from "react-router-dom";
import React, { useContext, useRef } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { GlobalContext } from "../context/GlobalContext";
import { toast } from "react-toastify";

function MilliySertifikatTasdiqlash() {

  const {setUserData, userData} = useContext(GlobalContext)
  const navigate = useNavigate();

  const kod = useRef();

  function handleSubmit(e) {
    e.preventDefault();

    fetch(`${import.meta.env.VITE_BASE_URL}/test/${kod.current.value}/status/${userData.user_id}/`, {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => {
        if(data.can_take_test){
          navigate("/milliy-quiz");
          localStorage.setItem("test-code", kod.current.value)
      }
      else{
          toast.error(data.message);
        }
       
      })
      .catch((err) => {
        // console.log(err)
        toast.error("Tasdiqlash kodi noto'g'ri");
      });
  }


  return (
    <div className="flex justify-center items-center h-screen px-5">
      <div className="flex flex-col gap-10 shadow-2xl rounded-2xl p-5 w-full md:w-96 md:p-10">
        <h1 className="text-center text-2xl md:text-4xl text-[#abc1e1]">
          Tasdiqlash kodi
        </h1>
        <form action="" className="flex flex-col gap-7" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="testkodi" className="text-white">
              Test kodi:
            </label>
            <input
            ref={kod}
              type="text"
              className="border border-gray-400 rounded p-1.5 text-white outline-0"
              placeholder="Kodni kiriting..."
            />
          </div>
            <button type="submit" className="btn btn-info text-white text-lg py-2 rounded-[6px]">Yuborish</button>
            <Link to="/" className="text-white link flex items-center gap-2"><FaArrowLeftLong /> orqaga</Link>
        </form>
      </div>
    </div>
  );
}

export default MilliySertifikatTasdiqlash;
