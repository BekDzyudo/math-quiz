import { useContext, useEffect, useRef, useState } from "react";
import { Virtuoso } from "react-virtuoso";
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
  
  
  const navigate = useNavigate()

  // const userData = JSON.parse(localStorage.getItem("user-data"));
  const {userData} = useContext(GlobalContext)
  
  const [answers, setAnswers] = useState([]);
  const [selectOption, setSelectOption] = useState(
    JSON.parse(localStorage.getItem("selectOption")) || []
  );
  // const [showResult, setShowResult] = useState(
  //   localStorage.getItem("showResult") === "true" || false
  // );
   const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(localStorage.getItem("result") || null);
  const questionRefs = useRef([]);
  const timerRef = useRef(null);
  const isSubmittedRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // get data
  const {
    data: quizzes,
    isPending,
    error,
  } = useGetFetch(`${import.meta.env.VITE_BASE_URL}/test-questions/${quizId}/`);
  

  // click and scroll
  const handleScrollToQuestion = (index) => {
    questionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  // change input
  const [selectedAnswers, setSelectedAnswers] = useState({});
  useEffect(() => {
    const savedAnswers = localStorage.getItem("saved_answers");
    const answers = JSON.parse(localStorage.getItem("answers"));
    if (answers) {
      setAnswers(answers);
    }
    if (savedAnswers) {
      setSelectedAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  const handleAnswerChange = (
    question_id,
    question_number,
    selectedOption,
    index1,
    index
  ) => {
    const update = { ...selectedAnswers, [question_id]: index };
    setSelectedAnswers(update);
    // localStorage.setItem("saved_answers", JSON.stringify(update));

    // =====
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

    //  localStorage.setItem(
    //   "answers",
    //   JSON.stringify([
    //     ...answers,
    //     { savol_id: question_id, tanlangan_javob: selectedOption },
    //   ])
    // );
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
  };
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
    
    // Agar yuborilayotgan bo'lsa, qayta yubormaslik
    if (isSubmitting) {
      console.log('⚠️ Javob allaqachon yuborilmoqda...');
      return;
    }
    
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
      })
      .catch((err) => {
        console.log(err);
        console.log(err.message);
        if(err.message == "bor") toast.error("Siz oldin ushbu testni bajargansiz!");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };


  // clear localstorage
  useEffect(() => {
    // cleanup funksiyasi sahifadan chiqishda ishlaydi
    return () => {
      if (location.pathname.startsWith("/quiz/")) {
        navigate("/")
        localStorage.removeItem("remainingTime");
        localStorage.removeItem("result");
        localStorage.removeItem("answers");
        localStorage.removeItem("saved_answers")
        localStorage.removeItem("showResult")
        localStorage.removeItem("selectOption")
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
    if (answers?.length == quizzes?.length) {
      handleSubmit(e);
    } else {
      if (confirm("Test to'liq bajarilmadi! Baribir yakunlansinmi?")) {
        handleSubmit(e);
      } else {
      }
    }
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
      <div className="px-5 md:max-w-[1300px] md:w-full md:mr-auto md:ml-auto md:px-[50px] flex md:gap-10 items-start justify-between h-full pt-5">
        {isPending && <p className="text-white">loading...</p>}
        {/* {error && <p>{error}</p>} */}
        {quizzes == null && <div className="flex justify-center items-center w-full h-[calc(100vh-200px)]"><span className="text-center text-[#abc1e1] text-2xl md:text-8xl">Hozircha <br/> aktiv testlar yo‘q</span></div>}
        {Array.isArray(quizzes) && (
          <MathJaxContext config={mathJaxConfig} version={3}>
            <form className="w-full md:w-[70%] h-full">
              <Virtuoso
                style={{ height: window.innerHeight - 142 }}
                totalCount={quizzes.length}
                itemContent={(index) => {
                  const item = quizzes[index];
                  return (
                    <QuestionItem
                      key={item.id}
                      item={item}
                      index1={index}
                      handleAnswerChange={handleAnswerChange}
                      showResult={showResult}
                      isFinished={isFinished}
                      selectedAnswers={selectedAnswers}
                      questionRefs={questionRefs}
                    />
                  );
                }}
              />
            </form>
            <div className="hidden md:block sidebar w-[30%] p-5 border border-gray-400 sticky top-32 rounded-xl">
              <div className="user flex items-center gap-5 border-b border-gray-400 pb-1">
                <FaUser style={{ color: "gray", fontSize: "25px" }} />{" "}
                <h1 className="text-center text-2xl font-semibold text-white">
                  {userData?.last_name + " " + userData?.first_name}
                </h1>
              </div>
              {/* result */}
              {(showResult || (isFinished == "true")) && (
                <div className="my-5">
                  <h1 className="flex items-center gap-3 text-2xl font-bold text-info">
                    Natija: <span className="text-3xl">{(result == null || result*1 == 0) && natija*1 ? natija : result}</span>ta
                  </h1>
                </div>
              )}
              <Time
                // 2 * 60 * 60 * 1000
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
              <div className="my-3 mb-10">
                <h1 className="text-white">Process</h1>
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
                        onClick={() => handleScrollToQuestion(index)}
                        key={index}
                        className={`btn text-[#abc1e1] ${
                          isChanged ? "btn-info text-white" : "btn-outline"
                        } text-[16px] mb-2 ${
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
