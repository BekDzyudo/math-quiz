import {Link, useNavigate} from "react-router-dom";
import React, { useContext, useRef, useEffect } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { GlobalContext } from "../context/GlobalContext";
import { useTelegram } from "../context/TelegramContext";
import { toast } from "react-toastify";

function MilliySertifikatTasdiqlash() {

  const {setUserData, userData} = useContext(GlobalContext)
  const { user, isTelegramMode, showBackButton, hideBackButton, showMainButton, hideMainButton, close } = useTelegram();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);

  const kod = useRef();

  // Debug - contextni tekshirish
  useEffect(() => {
  }, [isTelegramMode, user, userData]);

  // Telegram Web App da auto-login
  useEffect(() => {
    const telegramLogin = async () => {
      if (isTelegramMode && user && user.id) {
        if (!userData) {
          try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/telegram-login/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
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
              if (data.created) {
                toast.success(`Xush kelibsiz, ${data.first_name}!`);
              }
            } else {
              toast.error('Telegram login xatosi');
            }
          } catch (error) {
            toast.error('Server bilan bog\'lanishda xato');
          }
        }
        setIsLoading(false);
      } else if (!isTelegramMode) {
        // Web browser - login tekshiruvi kerak
        setIsLoading(false);
      }
    };

    telegramLogin();
  }, [isTelegramMode, user, userData, setUserData]);

  // Web siteda login tekshiruvi (Telegram Web App da emas)
  useEffect(() => {
    if (!isLoading && !isTelegramMode && !userData) {
      toast.error("Iltimos, avval login qiling");
      navigate("/login");
    }
  }, [isLoading, isTelegramMode, userData, navigate]);

  // Telegram Back Button
  useEffect(() => {
    if (isTelegramMode) {
      showBackButton(() => {
        close(); // Telegram Web App ni yopish
      });
    }

    return () => {
      if (isTelegramMode) {
        hideBackButton();
      }
    };
  }, [isTelegramMode]);

  function handleSubmit(e) {
    e.preventDefault();

    // Telegram user ID ni ishlatish
    const userId = isTelegramMode ? user?.id : userData?.user_id;

    if (!userId) {
      toast.error("Foydalanuvchi ma'lumotlari topilmadi");
      return;
    }

    fetch(`${import.meta.env.VITE_BASE_URL}/test/${kod.current.value}/status/${userId}/`, {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => {
        if(data.can_take_test){
          // ✅ localStorage'ga safely yozish
          try {
            localStorage.setItem("test-code", kod.current.value);
          } catch (error) {
            toast.error("Ma'lumot saqlashda xatolik");
            return;
          }
          navigate("/milliy-quiz");
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
        {isTelegramMode && user && (
          <div className="text-center text-white">
            <p>👤 {user.first_name} {user.last_name}</p>
            {user.username && <p className="text-sm text-gray-400">@{user.username}</p>}
          </div>
        )}
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
            {!isTelegramMode && (
              <Link to="/" className="text-white link flex items-center gap-2"><FaArrowLeftLong /> orqaga</Link>
            )}
        </form>
      </div>
    </div>
  );
}

export default MilliySertifikatTasdiqlash;
