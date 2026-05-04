import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { FaUser } from "react-icons/fa";
import { TbLayoutGrid } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import Navbar from "../components/Navbar";
import { useGetFetch } from "../hooks/useGetFetch";
import { MathJaxContext } from "better-react-mathjax";
import Time from "../components/Time";
import QuestionItem from "../components/QuestionItem";
import PageLoader from "../components/PageLoader";
import { toast } from "react-toastify";
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import { readQuizState, writeQuizState } from "../utils/quizStorage";

function getToifa(ball) {
  if (ball >= 86) return { label: "Oliy +70%", cls: "bg-purple-600 text-white" };
  if (ball >= 80) return { label: "Oliy", cls: "bg-emerald-600 text-white" };
  if (ball >= 70) return { label: "1-Toifa", cls: "bg-blue-600 text-white" };
  if (ball >= 60) return { label: "2-Toifa", cls: "bg-amber-500 text-white" };
  return { label: "O'tmagan", cls: "bg-red-500 text-white" };
}

// questionResults: { [savol_id]: true|false } — API javobidan keladi
function getQuestionBtnColor(item, showResult, isFinished, selectOption, questionResults) {
  const isAnswered = selectOption.includes(item.id);

  if (showResult || isFinished === "true") {
    if (questionResults !== null) {
      // API dan natijalar kelgan → to'g'ri/noto'g'ri rang
      const natija = questionResults[item.id];
      if (natija === undefined) return "btn-outline text-slate-400"; // javob berilmagan
      return natija
        ? "bg-emerald-500 text-white border-0 hover:bg-emerald-600"
        : "bg-red-400 text-white border-0 hover:bg-red-500";
    }
    // Eski sessiya: API natijasi yo'q → hammasi "bajarilgan" ko'k
    return "btn-info text-white";
  }

  return isAnswered ? "btn-info text-white" : "btn-outline text-slate-500";
}

function Quiz() {
  let { quizId} = useParams();
  const [searchParams] = useSearchParams()
  const isFinished = searchParams.get("finished")
  const natija = searchParams.get("result")

  // Mount'da bir marta quiz-scoped storage o'qiladi — PWA/bookmark bilan ham toza state
  const initialQuizState = useRef(readQuizState(quizId)).current;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showSheet, setShowSheet] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // { [savol_id]: true|false } — submit dan keyin to'ldiriladi
  const [questionResults, setQuestionResults] = useState(null);
  // Modal faqat shu sessiyada yangi yakunlanganda chiqadi (refresh da emas)
  const [showResultModal, setShowResultModal] = useState(false);
  const resultShownRef = useRef(Boolean(initialQuizState.showResult));
  // Vaqt tugaganda modal
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  // Vaqt tugadi + internet yo'q: qayta urinish uchun
  const [timeUpNoInternet, setTimeUpNoInternet] = useState(false);

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
  
  const [answers, setAnswers] = useState(() => Array.isArray(initialQuizState.answers) ? initialQuizState.answers : []);
  const [selectOption, setSelectOption] = useState(() => Array.isArray(initialQuizState.selectOption) ? initialQuizState.selectOption : []);
  const [showResult, setShowResult] = useState(() => Boolean(initialQuizState.showResult));
  const [result, setResult] = useState(() => initialQuizState.result ?? null);
  const questionRefs = useRef([]);
  const virtuosoRef = useRef(null);
  const timerRef = useRef(null);
  const isSubmittedRef = useRef(false);
  const isSubmittingRef = useRef(false); // ✅ Ref orqali ham boshqarish (immediate check)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // isFinished va showResult uchun ref — handleTimeUp stale closure muammosini hal qiladi
  const isFinishedRef = useRef(isFinished);
  const showResultRef = useRef(showResult);
  useEffect(() => { isFinishedRef.current = isFinished; }, [isFinished]);
  useEffect(() => { showResultRef.current = showResult; }, [showResult]);

  // Ikkala Time komponentiga (desktop + mobile) beriladi — stable ref
  const handleTimeUp = useCallback(() => {
    // Ref'lar orqali yangi qiymat o'qiladi (stale closure yo'q)
    if (isSubmittedRef.current || isFinishedRef.current === "true" || showResultRef.current) return;

    if (!navigator.onLine) {
      // Internet yo'q — maxsus modal + qayta urinish imkoni
      setTimeUpNoInternet(true);
      setShowTimeUpModal(true);
      return;
    }
    // Internet bor — modal chiqarib, avtomatik submit
    setTimeUpNoInternet(false);
    setShowTimeUpModal(true);
    const fakeEvent = { preventDefault: () => {} };
    handleSubmit(fakeEvent);
  }, []); // bo'sh deps: faqat ref'lar ishlatiladi

  // get data
  const {
    data: quizzes,
    isPending,
    error,
    refetch: refetchQuizzes,
  } = useGetFetch(`${import.meta.env.VITE_BASE_URL}/test-questions/${quizId}/?user_id=${userData?.user_id}`);
  

  // change input — quiz-scoped storage dan tiklash
  const [selectedAnswers, setSelectedAnswers] = useState(
    () => (initialQuizState.selectedAnswers && typeof initialQuizState.selectedAnswers === "object") ? initialQuizState.selectedAnswers : {}
  );
  const prevQuizIdRef = useRef(quizId);
  
  // Quizzes data kelganda MathJax trigger + DB dan saqlangan javoblarni yuklash
  useEffect(() => {
    if (quizzes?.length) {
      const id = triggerMathJax();

      // DB dan kelgan user_answer mavjud bo'lsa, selectedAnswers va selectOption ni to'ldirish
      const dbAnswers = {};
      const dbAnsweredIds = [];
      quizzes.forEach((q) => {
        if (q.user_answer) {
          dbAnswers[q.id] = q.user_answer;
          dbAnsweredIds.push(q.id);
        }
      });

      if (dbAnsweredIds.length > 0) {
        setSelectedAnswers((prev) => ({ ...dbAnswers, ...prev }));
        setSelectOption((prev) => Array.from(new Set([...dbAnsweredIds, ...prev])));
        setAnswers((prev) => {
          const existingIds = new Set(prev.map((a) => a.savol_id));
          const extra = dbAnsweredIds
            .filter((id) => !existingIds.has(id))
            .map((id) => ({ savol_id: id, tanlangan_javob: dbAnswers[id] }));
          return extra.length ? [...prev, ...extra] : prev;
        });
      }

      // Test yakunlangan bo'lsa — questionResults ni DB javoblar + to'g'ri javoblar asosida hisoblash
      // (sahifaga qayta kirganda qizil/yashil ranglar ko'rinishi uchun)
      if ((isFinished === "true" || showResult) && dbAnsweredIds.length > 0) {
        const computedResults = {};
        quizzes.forEach((q) => {
          const userAns = dbAnswers[q.id];
          if (!userAns) return;
          // to'g'ri javob kalitini topish (show_video=true bo'lganda javoblar ichida togri:true bor)
          const correctKey = q.javoblar?.find((j) => j.togri)?.key ?? null;
          computedResults[q.id] = correctKey ? userAns === correctKey : false;
        });
        if (Object.keys(computedResults).length > 0) {
          setQuestionResults(computedResults);
        }
      }

      return () => clearTimeout(id);
    }
  }, [quizzes, triggerMathJax]);

  // quizId o'zgarganda (router ichida boshqa testga o'tish) — yangi quiz state'idan boshlash
  useEffect(() => {
    if (prevQuizIdRef.current !== quizId) {
      const next = readQuizState(quizId);
      setAnswers(Array.isArray(next.answers) ? next.answers : []);
      setSelectedAnswers(next.selectedAnswers && typeof next.selectedAnswers === "object" ? next.selectedAnswers : {});
      setSelectOption(Array.isArray(next.selectOption) ? next.selectOption : []);
      setShowResult(Boolean(next.showResult));
      setResult(next.result ?? null);
      prevQuizIdRef.current = quizId;
    }
  }, [quizId]);

  const handleAnswerChange = useCallback((
    question_id,
    question_number,
    selectedOption,
    index1,
    index
  ) => {
    // Functional update — selectedAnswers dep'si kerak emas
    setSelectedAnswers((prev) => ({ ...prev, [question_id]: selectedOption }));

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

    setSelectOption((prev) => (prev.includes(question_id) ? prev : [...prev, question_id]));
    // Javob tugmalari LaTeX bo'lishi mumkin — DOM o'zgargandan keyin qayta render
    triggerMathJax();
  }, [triggerMathJax]);

  // Bitta quiz-scoped blobga yozish — state o'zgargani sari patch
  useEffect(() => {
    writeQuizState(quizId, { answers, selectedAnswers, selectOption, showResult, result });
  }, [quizId, answers, selectedAnswers, selectOption, showResult, result]);

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

  // Internet uzilishi/tiklanishi xabarlari
  useEffect(() => {
    const handleOffline = () => {
      toast.warn("Internet aloqasi uzildi! Javoblaringiz saqlanmoqda...", {
        toastId: "offline-toast",
        autoClose: false,
      });
    };
    const handleOnline = () => {
      toast.dismiss("offline-toast");
      toast.success("Internet tiklandi!", { autoClose: 2000 });
    };
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  // submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Agar yuborilayotgan bo'lsa, qayta yubormaslik (ref orqali tekshirish)
    if (isSubmittingRef.current) {
      console.log('⚠️ Javob allaqachon yuborilmoqda (ref check)...');
      return;
    }

    // Internet ulanishini tekshirish
    if (!navigator.onLine) {
      toast.error("Internet aloqasi yo'q! Iltimos ulanishingizni tekshiring.", {
        toastId: "no-internet-toast",
      });
      return;
    }

    isSubmittingRef.current = true; // ✅ Ref'ni darhol o'zgartirish
    setIsSubmitting(true);
    isSubmittedRef.current = true;
    clearInterval(timerRef.current);
    writeQuizState(quizId, { remainingTime: null });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 soniya timeout

    fetch(`${import.meta.env.VITE_BASE_URL}/check-answers/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        user_id: userData.user_id,
        answers: answers,
      }),
    })
      .then(async(res) => {
        clearTimeout(timeoutId);
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData)
        }
        return res.json();
      })
      .then((data) => {
        setResult(data.ball);
        setShowResult(true);
        // Har bir savol natijasini saqlash (to'g'ri/noto'g'ri rang uchun)
        if (Array.isArray(data.results)) {
          const map = {};
          data.results.forEach((r) => { map[r.savol_id] = r.natija; });
          setQuestionResults(map);
        }
        // to'g'ri javoblar va video URLlarni olish uchun qayta fetch
        refetchQuizzes();
        // Modal faqat shu sessiyada yangi yakunlanganda chiqadi
        if (!resultShownRef.current) {
          setShowResultModal(true);
          resultShownRef.current = true;
        }
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        isSubmittedRef.current = false;
        if (err.name === "AbortError") {
          toast.error("Server javob bermadi (vaqt tugadi). Internet sust bo'lishi mumkin. Qaytadan urinib ko'ring.");
        } else if (err.message == "bor") {
          // Avval topshirilgan — natijani ko'rsatish
          isSubmittedRef.current = true;
          const savedResult = readQuizState(quizId).result || natija;
          if (savedResult) setResult(savedResult);
          setShowResult(true);
          refetchQuizzes(); // to'g'ri javoblar + user_answer yuklash
          toast.info("Siz bu testni avval topshirgansiz. Natijangiz ko'rsatilmoqda.");
        } else if (!navigator.onLine) {
          toast.error("Internet aloqasi yo'q! Ulanishni tiklang va qaytadan bosing.");
        } else {
          toast.error("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
        }
      })
      .finally(() => {
        isSubmittingRef.current = false; // ✅ Ref'ni reset qilish
        setIsSubmitting(false);
      });
  };


  // Sahifadan chiqish — quiz_state_{quizId} blob'i saqlanadi (user qaytsa davom etadi/yakuniy
  // holatni ko'radi). Boshqa quizlarga ta'sir qilmaydi, chunki har blob o'z quizId bilan scoped.
  const handleClearTime = (e) => {
    e.preventDefault();
    navigate("/attestatsiya-testlari");
  };
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
        onTimeUp={handleTimeUp}
        quizId={quizId}
      />
      <div className="px-3 md:px-5 md:max-w-[1300px] md:w-full md:mr-auto md:ml-auto md:px-[50px] flex md:gap-10 items-start justify-between h-full pt-3 md:pt-5">
        {isPending && <PageLoader text="Savollar yuklanmoqda..." />}
        {error && !isPending && (
          <div className="flex flex-col justify-center items-center w-full h-[calc(100vh-200px)] gap-4">
            <p className="text-center text-red-400 text-lg md:text-2xl">{error}</p>
            <button onClick={refetchQuizzes} className="btn btn-outline btn-info">Qaytadan urinish</button>
          </div>
        )}
        {!isPending && !error && quizzes == null && <div className="flex justify-center items-center w-full h-[calc(100vh-200px)]"><span className="text-center text-slate-400 text-xl md:text-4xl lg:text-8xl">Hozircha <br/> aktiv testlar yo'q</span></div>}
        {Array.isArray(quizzes) && (
          <MathJaxContext config={mathJaxConfig} version={3}>
            {/* Vaqt tugadi modal */}
            {showTimeUpModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center">
                  <div className="text-5xl mb-4">⏰</div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-3">Vaqt tugadi!</h2>
                  {timeUpNoInternet ? (
                    <>
                      <p className="text-slate-500 text-base mb-6">
                        Internet aloqasi yo'q. Ulanishni tiklang va qayta yuboring.
                      </p>
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={() => {
                            if (!navigator.onLine) {
                              toast.error("Internet hali ham yo'q!");
                              return;
                            }
                            setShowTimeUpModal(false);
                            setTimeUpNoInternet(false);
                            const fakeEvent = { preventDefault: () => {} };
                            handleSubmit(fakeEvent);
                          }}
                          className="btn btn-info text-white px-8 text-base"
                        >
                          Qayta yuborish
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-slate-500 text-base mb-6">
                        Javoblaringiz avtomatik yuborilmoqda...
                      </p>
                      <button
                        onClick={() => setShowTimeUpModal(false)}
                        className="btn btn-info text-white px-8 text-base"
                      >
                        OK
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

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
            {showResultModal && (() => {
              const ball = (result || 0) * 2;
              const toifa = getToifa(ball);
              return (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                  <div className="bg-white border border-slate-200 rounded-2xl p-10 max-w-sm w-full mx-4 shadow-2xl text-center">
                    <div className="text-5xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Test yakunlandi!</h2>
                    <p className="text-slate-500 text-lg mb-2">Sizning natijangiz:</p>
                    <div className="text-6xl font-bold text-indigo-600 my-4">
                      {result}
                    </div>
                    <p className="text-slate-500 mb-3">ta to'g'ri javob · {ball} ball</p>
                    <span className={`inline-block rounded-full px-5 py-1.5 text-base font-semibold mb-6 ${toifa.cls}`}>
                      {toifa.label}
                    </span>
                    <button
                      onClick={() => setShowResultModal(false)}
                      className="btn btn-info w-full text-white text-lg"
                    >
                      Yopish
                    </button>
                  </div>
                </div>
              );
            })()}

            <div className="w-full md:w-[70%] flex flex-col" style={{ height: 'calc(100vh - 160px)' }}>
              <form className="flex-1 overflow-y-auto min-h-0 pb-[72px] md:pb-4">
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
              <div className="fixed bottom-0 left-0 right-0 z-20 md:relative md:bottom-auto md:left-auto md:right-auto md:z-auto flex items-center justify-between gap-2 px-3 py-3 md:px-0 md:pt-3 md:pb-5 bg-white border-t border-slate-200 md:mt-2">
                <button
                  type="button"
                  onClick={() => setCurrentQuestion((q) => Math.max(0, q - 1))}
                  disabled={currentQuestion === 0}
                  className="btn btn-outline btn-info px-5 text-base disabled:opacity-30"
                >
                  ← Orqaga
                </button>

                {/* Markazda: raqam + savollar tugmasi (faqat mobile) */}
                <button
                  type="button"
                  onClick={() => setShowSheet(true)}
                  className="md:hidden flex flex-col items-center gap-0.5 px-3"
                >
                  <TbLayoutGrid className="text-indigo-500 text-xl" />
                  <span className="text-slate-500 text-xs font-medium">
                    {currentQuestion + 1}/{quizzes.length}
                  </span>
                </button>
                {/* Desktop: faqat raqam */}
                <span className="hidden md:inline text-slate-500 text-base font-medium">
                  {currentQuestion + 1} / {quizzes.length}
                </span>

                <button
                  type="button"
                  onClick={() => setCurrentQuestion((q) => Math.min(quizzes.length - 1, q + 1))}
                  disabled={currentQuestion === quizzes.length - 1}
                  className="btn btn-outline btn-info px-5 text-base disabled:opacity-30"
                >
                  Oldinga →
                </button>
              </div>

              {/* ===== Mobile Bottom Sheet ===== */}
              {showSheet && (
                <div className="md:hidden fixed inset-0 z-40 flex flex-col justify-end">
                  {/* Overlay */}
                  <div
                    className="absolute inset-0 bg-black/50"
                    onClick={() => setShowSheet(false)}
                  />
                  {/* Panel */}
                  <div className="relative bg-white rounded-t-2xl px-4 pt-4 pb-6 max-h-[70vh] flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-slate-800 font-semibold text-base">Savollar</h3>
                        <p className="text-slate-400 text-xs mt-0.5">
                          {selectOption.length}/{quizzes.length} ta javob berildi
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowSheet(false)}
                        className="btn btn-sm btn-ghost btn-circle text-slate-500"
                      >
                        <IoClose className="text-xl" />
                      </button>
                    </div>

                    {/* Progress bar */}
                    <div className="test-proccess-container mb-3">
                      <div
                        className="test-proccess"
                        style={{ width: (selectOption.length / quizzes.length) * 100 + "%" }}
                      />
                    </div>

                    {/* Raqamlar grid */}
                    <div className="overflow-y-auto flex-1">
                      <div className="grid grid-cols-5 gap-[6px]">
                        {quizzes.map((item, index) => {
                          const colorCls = getQuestionBtnColor(item, showResult, isFinished, selectOption, questionResults);
                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setCurrentQuestion(index);
                                setShowSheet(false);
                              }}
                              className={`btn w-full px-0 text-sm ${colorCls} ${currentQuestion === index ? "ring-2 ring-indigo-400" : ""}`}
                            >
                              {index + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Yakunlash / Testlarga qaytish */}
                    <div className="mt-4">
                      {showResult || isFinished === "true" ? (
                        <Link
                          onClick={handleClearTime}
                          className="w-full btn btn-outline btn-info text-white"
                        >
                          Testlarga qaytish
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setShowSheet(false);
                            handleSubmitPermition({ preventDefault: () => {} });
                          }}
                          disabled={!!result || isSubmitting}
                          className={`w-full btn btn-info text-white ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {isSubmitting ? "Yuborilmoqda..." : "Yakunlash"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
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
                key={quizId}
                quizId={quizId}
                showResult={showResult}
                isFinished={isFinished}
                initialTime={2 * 60 * 60 * 1000}
                onTimeUp={handleTimeUp}
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
                    const colorCls = getQuestionBtnColor(item, showResult, isFinished, selectOption, questionResults);
                    return (
                      <button
                        type="button"
                        onClick={() => setCurrentQuestion(index)}
                        key={index}
                        className={`btn w-full px-0 text-[15px] ${colorCls} ${currentQuestion === index ? "ring-2 ring-indigo-400" : ""}`}
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
