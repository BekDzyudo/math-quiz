import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { FaUser } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useGetFetch } from "../hooks/useGetFetch";
import { MathJaxContext } from "better-react-mathjax";
import Time from "../components/Time";
import QuestionItem from "../components/QuestionItem";
import { toast } from "react-toastify";
import { useParams, Link, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";

function Quiz() {
  let { quizId} = useParams();
  const [searchParams] = useSearchParams()
  const isFinished = searchParams.get("finished")
  const natija = searchParams.get("result")
  const location = useLocation()

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // Modal faqat shu sessiyada yangi yakunlanganda chiqadi (refresh da emas)
  const [showResultModal, setShowResultModal] = useState(false);
  const resultShownRef = useRef(localStorage.getItem("showResult") === "true");

  // MathJax qayta render: savol almashganda yoki data kelganda
  const triggerMathJax = useCallback(() => {
    const id = setTimeout(() => {
      if (window.MathJax?.typesetPromise) {
        window.MathJax.typesetPromise().catch(() => {});
      }
    }, 80);
    return id;
  }, []);

  useEffect(() => {
    const id = triggerMathJax();
    return () => clearTimeout(id);
  }, [currentQuestion, triggerMathJax]);

  const navigate = useNavigate()

  // const userData = JSON.parse(localStorage.getItem("user-data"));
  const {userData} = useContext(GlobalContext)
  
  const [answers, setAnswers] = useState([]);
  const [selectOption, setSelectOption] = useState(
    JSON.parse(localStorage.getItem("selectOption")) || []
  );
  const [showResult, setShowResult] = useState(
    localStorage.getItem("showResult") === "true" || false
  );
  const [result, setResult] = useState(localStorage.getItem("result") || null);
  const questionRefs = useRef([]);
  const virtuosoRef = useRef(null);
  const timerRef = useRef(null);
  const isSubmittedRef = useRef(false);
  const isSubmittingRef = useRef(false); // ✅ Ref orqali ham boshqarish (immediate check)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // get data
  const {
    data: quizzes,
    isPending,
    error,
  } = useGetFetch(`${import.meta.env.VITE_BASE_URL}/test-questions/${quizId}/`);
  

  // change input — localStorage dan tiklash (test bajarilgan bo'lsa javoblar saqlansin)
  const [selectedAnswers, setSelectedAnswers] = useState(
    () => JSON.parse(localStorage.getItem("saved_answers")) || {}
  );
  const prevQuizIdRef = useRef(quizId);
  
  // Quizzes data kelganda MathJax trigger (birinchi savol uchun)
  useEffect(() => {
    if (quizzes?.length) {
      const id = triggerMathJax();
      return () => clearTimeout(id);
    }
  }, [quizzes, triggerMathJax]);

  // ✅ quizId o'zgarganda localStorage'ni tozalash (yangi testga kirganda)
  useEffect(() => {
    // ✅ Faqat quizId o'zgarganda tozalash (reload emas!)
    if (prevQuizIdRef.current !== quizId) {
      localStorage.removeItem("saved_answers");
      localStorage.removeItem("answers");
      localStorage.removeItem("selectOption");
      localStorage.removeItem("showResult");
      localStorage.removeItem("result");
      
      // ✅ Bo'sh state bilan boshlash
      setAnswers([]);
      setSelectedAnswers({});
      setSelectOption([]);
      setShowResult(false);
      setResult(null);
      
      prevQuizIdRef.current = quizId;
    }
  }, [quizId]);

  // ✅ useCallback bilan optimizatsiya - funksiya har safar qayta yaratilmaydi
  const handleAnswerChange = useCallback((
    question_id,
    question_number,
    selectedOption,
    index1,
    index
  ) => {
    // Harfni saqlash
    const update = { ...selectedAnswers, [question_id]: selectedOption };
    setSelectedAnswers(update);

    setAnswers((prevAnswers) => {
      const existingIndex = prevAnswers.findIndex(
        (item) => item.savol_id === question_id
      );
      if (existingIndex !== -1) {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingIndex] = {
          ...updatedAnswers[existingIndex],
          tanlangan_javob: selectedOption,
        };
        return updatedAnswers;
      } else {
        return [
          ...prevAnswers,
          { savol_id: question_id, tanlangan_javob: selectedOption },
        ];
      }
    });

    setSelectOption((prev) => {
      let updated;
      if (!prev.includes(question_id)) {
        updated = [...prev, question_id];
      } else {
        updated = prev;
      }
      localStorage.setItem("selectOption", JSON.stringify(updated));
      return updated;
    });
  }, [selectedAnswers]);
  // ============================
  useEffect(() => {
    localStorage.setItem("answers", JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem("saved_answers", JSON.stringify(selectedAnswers));
  }, [selectedAnswers]);

  // useEffect(() => {
  //   const updateItemSize = () => {
  //     const width = window.innerWidth;
  //     if (width < 768) {
  //       setItemSize(500); // sm
  //     } else {
  //       setItemSize(550); // md va yuqori
  //     }
  //   };

  //   updateItemSize(); // birinchi renderda
  //   window.addEventListener("resize", updateItemSize); // resize bo‘lsa
  //   return () => window.removeEventListener("resize", updateItemSize); // cleanup
  // }, []);
  // ============================

  // submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Agar yuborilayotgan bo'lsa, qayta yubormaslik (ref orqali tekshirish)
    if (isSubmittingRef.current) {
      console.log('⚠️ Javob allaqachon yuborilmoqda (ref check)...');
      return;
    }
    
    isSubmittingRef.current = true; // ✅ Ref'ni darhol o'zgartirish
    setIsSubmitting(true);
    isSubmittedRef.current = true;
    clearInterval(timerRef.current);
    localStorage.removeItem("remainingTime");
    console.log({
        user_id: userData.user_id,
        answers: answers,
      });
    

    fetch(`${import.meta.env.VITE_BASE_URL}/check-answers/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userData.user_id,
        answers: answers,
      }),
    })
      .then(async(res) => {
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData)
        }
        return res.json();
      })
      .then((data) => {
        setResult(data.ball);
        localStorage.setItem("result", data.ball);
        setShowResult(true);
        localStorage.setItem("showResult", true);
        // Modal faqat shu sessiyada yangi yakunlanganda chiqadi
        if (!resultShownRef.current) {
          setShowResultModal(true);
          resultShownRef.current = true;
        }
      })
      .catch((err) => {
        console.log(err);
        console.log(err.message);
        if(err.message == "bor") toast.error("Siz oldin ushbu testni bajargansiz!");
        else toast.error("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
      })
      .finally(() => {
        isSubmittingRef.current = false; // ✅ Ref'ni reset qilish
        setIsSubmitting(false);
      });
  };


  // clear localstorage
  useEffect(() => {
    // cleanup funksiyasi sahifadan chiqishda ishlaydi
    return () => {
      // ✅ navigate() chaqirmaslik - faqat localStorage'ni tozalash
      if (!location.pathname.startsWith("/quiz/")) {
        localStorage.removeItem("remainingTime");
        localStorage.removeItem("result");
        localStorage.removeItem("answers");
        localStorage.removeItem("saved_answers");
        localStorage.removeItem("showResult");
        localStorage.removeItem("selectOption");
      }
    };
  }, [location.pathname]);

  const handleClearTime = (e) =>{
    e.preventDefault();
    navigate("/")
    localStorage.removeItem("remainingTime");
    localStorage.removeItem("result");
    localStorage.removeItem("answers");
    localStorage.removeItem("saved_answers")
    localStorage.removeItem("showResult")
    localStorage.removeItem("selectOption")
  }
  const handleSubmitPermition = (e) => {
    if (isSubmittingRef.current) return;
    if (answers?.length == quizzes?.length) {
      handleSubmit(e);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    const fakeEvent = { preventDefault: () => {} };
    handleSubmit(fakeEvent);
  };
  // mathcontext
  const mathJaxConfig = {
    tex: {
      inlineMath: [
        ["$", "$"],
        ["\\(", "\\)"],
      ],
    },
    svg: { fontCache: "global" },
    chtml: {
      scale: 1, // default: 1
      // linebreaks: {
      //   automatic: true, // ✨ asosiy yechim shu yerda
      // },
    },
    options: {
      renderActions: {
        addMenu: [], // foydalanuvchi uchun MathJax menyusini yo‘q qiladi
      },
    },
  };

  return (
    <div className="min-h-screen">
      <Navbar
        testLength={quizzes?.length}
        handleSubmitPermition={handleSubmitPermition}
        handleSubmit={handleSubmit}
        result={result}
        natija={natija}
        showResult={showResult}
        isFinished={isFinished}
        isSubmittedRef={isSubmittedRef}
        handleClearTime={handleClearTime}
      />
      <div className="px-3 md:px-5 md:max-w-[1300px] md:w-full md:mr-auto md:ml-auto md:px-[50px] flex md:gap-10 items-start justify-between h-full pt-3 md:pt-5">
        {isPending && <p className="text-slate-500">loading...</p>}
        {quizzes == null && <div className="flex justify-center items-center w-full h-[calc(100vh-200px)]"><span className="text-center text-slate-400 text-xl md:text-4xl lg:text-8xl">Hozircha <br/> aktiv testlar yo'q</span></div>}
        {Array.isArray(quizzes) && (
          <MathJaxContext config={mathJaxConfig} version={3}>
            {/* Confirm modal */}
            {showConfirmModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center">
                  <div className="text-5xl mb-4">⚠️</div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-3">Test to'liq bajarilmadi!</h2>
                  <p className="text-slate-500 text-lg mb-6">
                    Hali {quizzes.length - answers.length} ta savol javobsiz qoldi. Baribir yakunlansinmi?
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => setShowConfirmModal(false)}
                      className="btn btn-outline btn-error px-8 text-lg"
                    >
                      Yo'q
                    </button>
                    <button
                      onClick={handleConfirmSubmit}
                      className="btn btn-info px-8 text-lg text-white"
                    >
                      Ha, yakunlash
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Result modal */}
            {showResultModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="bg-white border border-slate-200 rounded-2xl p-10 max-w-sm w-full mx-4 shadow-2xl text-center">
                  <div className="text-5xl mb-4">🎉</div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Test yakunlandi!</h2>
                  <p className="text-slate-500 text-lg mb-2">Sizning natijangiz:</p>
                  <div className="text-6xl font-bold text-indigo-600 my-4">
                    {result}
                  </div>
                  <p className="text-slate-500 mb-6">ta to'g'ri javob</p>
                  <button
                    onClick={() => setShowResultModal(false)}
                    className="btn btn-info w-full text-white text-lg"
                  >
                    Yopish
                  </button>
                </div>
              </div>
            )}

            <div className="w-full md:w-[70%] flex flex-col" style={{ height: 'calc(100vh - 160px)' }}>
              <form className="flex-1 overflow-y-auto min-h-0 pb-4">
                <QuestionItem
                  key={quizzes[currentQuestion]?.id}
                  item={quizzes[currentQuestion]}
                  index1={currentQuestion}
                  handleAnswerChange={handleAnswerChange}
                  showResult={showResult}
                  isFinished={isFinished}
                  selectedAnswers={selectedAnswers}
                  questionRefs={questionRefs}
                />
              </form>

              {/* Prev / Next */}
              <div className="flex items-center justify-between gap-3 pt-3 pb-5 border-t border-slate-200 mt-2">
                <button
                  type="button"
                  onClick={() => setCurrentQuestion((q) => Math.max(0, q - 1))}
                  disabled={currentQuestion === 0}
                  className="btn btn-outline btn-info px-8 text-lg disabled:opacity-30"
                >
                  ← Orqaga
                </button>
                <span className="text-slate-500 text-base font-medium">
                  {currentQuestion + 1} / {quizzes.length}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentQuestion((q) => Math.min(quizzes.length - 1, q + 1))}
                  disabled={currentQuestion === quizzes.length - 1}
                  className="btn btn-outline btn-info px-8 text-lg disabled:opacity-30"
                >
                  Oldinga →
                </button>
              </div>
            </div>

            <div className="hidden md:block sidebar w-[30%] p-5 border border-slate-200 bg-white sticky top-32 rounded-2xl shadow-sm">
              <div className="user flex items-center gap-4 border-b border-slate-200 pb-3 mb-3">
                <FaUser style={{ color: "#6366F1", fontSize: "22px" }} />{" "}
                <h1 className="text-xl font-semibold text-slate-800">
                  {userData?.last_name + " " + userData?.first_name}
                </h1>
              </div>
              {(showResult || (isFinished == "true")) && (
                <div className="my-4 p-3 bg-indigo-50 rounded-xl">
                  <h1 className="flex items-center gap-3 text-xl font-bold text-indigo-600">
                    Natija: <span className="text-3xl">{(result == null || result*1 == 0) && natija*1 ? natija : result}</span>ta
                  </h1>
                </div>
              )}
              <Time
                showResult={showResult}
                isFinished={isFinished}
                initialTime={2 * 60 * 60 * 1000}
                onTimeUp={() => {
                  if (!isSubmittedRef.current) {
                    const fakeEvent = { preventDefault: () => {} };
                    handleSubmit(fakeEvent);
                  }
                }}
              />
              {/* process */}
              <div className="my-3 mb-6">
                <h1 className="text-slate-600 text-sm font-medium mb-1">Jarayon</h1>
                <div className="test-proccess-container">
                  {quizzes && (
                    <div
                      className="test-proccess"
                      style={{
                        width:
                          (selectOption.length / quizzes?.length) * 100 + "%",
                      }}
                    ></div>
                  )}
                </div>
              </div>
              {/* btns */}
              <div className="grid grid-cols-4 xl:grid-cols-5 gap-[5px]">
                {quizzes &&
                  quizzes.map((item, index) => {
                    const isChanged = selectOption.includes(item.id);
                    return (
                      <button
                        type="button"
                        onClick={() => setCurrentQuestion(index)}
                        key={index}
                        className={`btn ${
                          isChanged ? "btn-info text-white" : "btn-outline text-slate-500"
                        } ${currentQuestion === index ? "ring-2 ring-indigo-400" : ""} text-[16px] mb-2 ${
                          index + 1 < 10 ? "px-[19px]" : ""
                        }`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
              </div>
              <div className="w-full flex flex-col items-center mt-5">
                {
                  ( showResult || isFinished == "true") ? <Link
                  onClick={handleClearTime}
                  type="button"
                  className={`w-full btn btn-outline btn-info btn-xl text-white rounded-2xl`}
                >
                  Testlarga qaytish
                </Link>
                :
                <button
                  onClick={handleSubmitPermition}
                  disabled={result || isSubmitting}
                  type="button"
                  className={`w-full btn btn-outline btn-info btn-xl text-white rounded-2xl ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Yuborilmoqda...' : 'Yakunlash'}
                </button>
                }

              </div>
            </div>
          </MathJaxContext>
        )}
      </div>
    </div>
  );
}

export default Quiz;
