import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useRef, useEffect } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { GlobalContext } from "../context/GlobalContext";
import { useTelegram } from "../context/TelegramContext";
import { toast } from "react-toastify";

function MilliySertifikatTasdiqlash() {
  const { setUserData, userData } = useContext(GlobalContext)
  const { user, isTelegramMode, showBackButton, hideBackButton, close } = useTelegram();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const kod = useRef();

  useEffect(() => {}, [isTelegramMode, user, userData]);

  useEffect(() => {
    const telegramLogin = async () => {
      if (isTelegramMode && user && user.id) {
        if (!userData) {
          try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/telegram-login/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                telegram_id: user.id,
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                username: user.username || ''
              })
            });
            if (response.ok) {
              const data = await response.json();
              setUserData(data);
              if (data.created) toast.success(`Xush kelibsiz, ${data.first_name}!`);
            } else {
              toast.error('Telegram login xatosi');
            }
          } catch {
            toast.error("Server bilan bog'lanishda xato");
          }
        }
        setIsLoading(false);
      } else if (!isTelegramMode) {
        setIsLoading(false);
      }
    };
    telegramLogin();
  }, [isTelegramMode, user, userData, setUserData]);

  useEffect(() => {
    if (!isLoading && !isTelegramMode && !userData) {
      toast.error("Iltimos, avval login qiling");
      navigate("/login");
    }
  }, [isLoading, isTelegramMode, userData, navigate]);

  useEffect(() => {
    if (isTelegramMode) {
      showBackButton(() => close());
    }
    return () => { if (isTelegramMode) hideBackButton(); };
  }, [isTelegramMode]);

  function handleSubmit(e) {
    e.preventDefault();
    const userId = isTelegramMode ? user?.id : userData?.user_id;
    if (!userId) { toast.error("Foydalanuvchi ma'lumotlari topilmadi"); return; }

    fetch(`${import.meta.env.VITE_BASE_URL}/test/${kod.current.value}/status/${userId}/`, { method: "GET" })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => {
        if (data.can_take_test) {
          try { localStorage.setItem("test-code", kod.current.value); } catch { toast.error("Ma'lumot saqlashda xatolik"); return; }
          navigate("/milliy-quiz");
        } else {
          toast.error(data.message);
        }
      })
      .catch(() => toast.error("Tasdiqlash kodi noto'g'ri"));
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col gap-6 p-6 md:p-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center gap-1 text-center">
          <img src="/assets/logo-icon.svg" alt="logo" className="h-10 w-10 mb-1" />
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">Tasdiqlash kodi</h1>
          <p className="text-slate-400 text-sm">Test kodini kiriting</p>
        </div>

        {isTelegramMode && user && (
          <div className="text-center bg-slate-50 rounded-xl p-3">
            <p className="text-slate-700 font-medium">👤 {user.first_name} {user.last_name}</p>
            {user.username && <p className="text-sm text-slate-400">@{user.username}</p>}
          </div>
        )}

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="testkodi" className="text-sm font-medium text-slate-600">Test kodi</label>
            <input
              ref={kod}
              type="text"
              className="border border-slate-300 rounded-xl p-3 text-slate-800 bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition text-base"
              placeholder="Kodni kiriting..."
              id="testkodi"
            />
          </div>
          <button type="submit" className="btn btn-info text-white text-base rounded-xl h-12">
            Tasdiqlash
          </button>
          {!isTelegramMode && (
            <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition text-sm">
              <FaArrowLeftLong /> Orqaga
            </Link>
          )}
        </form>
      </div>
    </div>
  );
}

export default MilliySertifikatTasdiqlash;
