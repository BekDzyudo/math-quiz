import { Link } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";

function OptionQuiz() {
  const {userData} = useContext(GlobalContext)
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center px-4 py-10 gap-8">
      {/* Logo + salom */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-3 mb-1">
          <img src="/assets/logo-icon.svg" alt="logo" className="h-12 w-12" />
          <div className="flex flex-col leading-tight text-left">
            <span className="font-extrabold text-2xl md:text-3xl text-slate-800 tracking-tight">MATEMATIKA</span>
            <span className="text-sm font-bold text-indigo-600 tracking-widest -mt-1">PRO</span>
          </div>
        </div>
        <h2 className="text-lg md:text-2xl text-slate-500 mt-2">
          Xush kelibsiz,{" "}
          <span className="font-semibold text-slate-700">
            {userData ? userData.first_name + " " + userData.last_name : ""}
          </span>
        </h2>
        <p className="text-slate-400 text-base md:text-lg">Test turini tanlang</p>
      </div>

      {/* Kartalar */}
      <div className="flex flex-col md:flex-row gap-5 md:gap-8 w-full max-w-3xl">
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl">📜</div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">Milliy sertifikat</h2>
          <p className="text-slate-500 text-sm md:text-base flex-1">Milliy sertifikat olish uchun testlar</p>
          <Link className="btn btn-info text-white text-base py-2 rounded-xl w-full" to="/tasdiqlash-kodi">
            Testlarni ko'rish
          </Link>
        </div>

        <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl">📝</div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">Attestatsiya</h2>
          <p className="text-slate-500 text-sm md:text-base flex-1">Attestatsiya testlari</p>
          <Link to="/attestatsiya-testlari" className="btn btn-info text-white text-base py-2 rounded-xl w-full">
            Testlarni ko'rish
          </Link>
        </div>

        <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 flex flex-col gap-4 opacity-80">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl">🎓</div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">Kurslarim</h2>
          <p className="text-slate-500 text-sm md:text-base flex-1">Online kurslar va darsliklar</p>
          <button disabled className="btn btn-warning text-slate-800 text-base py-2 rounded-xl w-full cursor-not-allowed opacity-80">
            Tez kunda
          </button>
        </div>
      </div>
    </div>
  );
}

export default OptionQuiz;
