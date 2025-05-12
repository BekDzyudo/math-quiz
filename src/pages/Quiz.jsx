import React, { useContext, useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { GlobalContext } from "../context/GlobalContext";
import { useGetFetch } from "../hooks/useGetFetch";
import { FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

function Quiz() {
  const userData = JSON.parse(localStorage.getItem("user-data"))  
  const { isTheme } = useContext(GlobalContext);
  const [answers, setAnswers] = useState(JSON.parse(localStorage.getItem("answers")) || []);
  const [selectOption, setSelectOption] = useState(JSON.parse(localStorage.getItem("selectOption")) || []);
  const [showResult, setShowResult] = useState(localStorage.getItem("showResult") === "true" || false)
  const [result, setResult] = useState(localStorage.getItem("result") || null);
  const questionRefs = useRef([]);

// click and scroll
  const handleScrollToQuestion = (index) => {
    questionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  };

  // change input
  const [selectedAnswers, setSelectedAnswers] = useState({});  
  useEffect(() => {
    const savedAnswers = localStorage.getItem("saved_answers");
    if (savedAnswers) {
      setSelectedAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  const handleAnswerChange = (question_id, question_number, selectedOption, index1, index) => {
    
    const update = {...selectedAnswers, [index1]: index}
    setSelectedAnswers(update)
    localStorage.setItem('saved_answers', JSON.stringify(update));
    

    // =====
    setAnswers((prev) => ([
      ...prev,
      {"savol_id": question_id, "tanlangan_javob" : selectedOption},
    ]));
    
    setSelectOption((prev)=>{
      let updated;
      if(!prev.includes(question_number)){
        updated = [...prev, question_number]
      }
      else{
        updated = prev;
      }
      localStorage.setItem("selectOption", JSON.stringify(updated));
      return updated
    })

    localStorage.setItem("answers", JSON.stringify([...answers, {"savol_id": question_id, "tanlangan_javob" : selectedOption}]));
  };

// submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("User answers:", answers);

    fetch("http://95.130.227.200/api/check-answers/",{
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userData.id,
        answers: answers,
      }),
    })
    .then((res)=>{
      // if(res.ok) throw new Error(res.statusText)
        return res.json()
    })
    .then((data)=>{
      setResult(data.ball)
      localStorage.setItem("result", data.ball)
      setShowResult(true)
      localStorage.setItem("showResult", true)
    })
    .catch((err)=>console.log(err)
    )



    // localStorage.removeItem("selectOption");
    // localStorage.removeItem("answers");
    // localStorage.removeItem("saved_answers");
  };

  // get data
  const {
    data: quizzes,
    isPending,
    error,
  } = useGetFetch(`${import.meta.env.VITE_BASE_URL}/intihon/`);

  // time ==================================================================
  const defaultTime = 2 * 60 * 60 * 1000;
  const [remainingTime, setRemainingTime] = useState(() => {
    const saved = localStorage.getItem("remainingTime");
    return saved ? parseInt(saved) : defaultTime;
  });

  const timerRef = useRef(null);

  // useEffect(() => {
  //   timerRef.current = setInterval(() => {
  //     setRemainingTime((prev) => {
  //       const newTime = prev - 1000;
  //       if (newTime <= 0) {
  //         clearInterval(timerRef.current);
  //         localStorage.removeItem("remainingTime");
  //         return 0;
  //       }
  //       localStorage.setItem("remainingTime", newTime);
  //       return newTime;
  //     });
  //   }, 1000);

  //   return () => clearInterval(timerRef.current);
  // }, []);

  const hours = Math.floor(remainingTime / (1000 * 60 * 60));
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
  const counter = `${hours} hours ${minutes} minutes ${seconds} seconds`;
  // ===========================================================================

  return (
    <div className="min-h-screen pb-12">
      <Navbar />
      <div className="container flex gap-10 items-start justify-between">
        {isPending && <p>loading...</p>}
        {error && <p>{error}</p>}
        {Array.isArray(quizzes) && (
          <>
            <form className="w-[70%]" onSubmit={handleSubmit}>
              <div className="quiz steps steps-vertical">
                {
                  quizzes?.map((item, index1) => {
                    return (
                      <div
                        ref={(el) => (questionRefs.current[index1] = el)}
                        key={item.id}
                        className="step step-info text-lg mb-10"
                      >
                        <div className="flex items-start gap-4 w-full">
                          <div className="mt-2 w-6 flex-shrink-0 text-2xl"></div>
                          <div className="flex flex-col gap-4 w-full">
                            <h1 className="text-2xl text-start font-semibold border-b border-gray-400" dangerouslySetInnerHTML={{ __html: item.savol }}>
                              {/* {item.savol} */}
                            </h1>
                            {showResult && <Link className="flex items-center gap-3 link"> <FaYoutube className="text-3xl text-red-500"/> Yechimni ko'rish</Link>}
                            <div className="space-y-3 ml-6">
                              { Array.isArray(item?.javoblar) && item?.javoblar?.map((variant, index) => {
                                 const isSelected = selectedAnswers[index1] === index;
                                return (
                                  <label
                                  style={{border:"3px solid", borderColor: showResult ? (variant.togri ? "green" : (isSelected ? "red" : "transparent")) : (isSelected ? "#00A4F2" : "transparent")}}
                                    key={index}
                                    className={`test-label group flex items-center gap-4 p-4 cursor-pointer ${
                                      isTheme == "dracula"
                                        ? "bg-[#3b4d66]"
                                        : "bg-white"
                                    } rounded-lg`}
                                  >
                                    <div className="test-letter text-xl font-bold bg-gray-300 px-3 py-1 rounded group-hover:text-[#00A4F2] text-gray-500">
                                      {String.fromCharCode(index + 65)}
                                    </div>
                                    <input
                                      type="radio"
                                      name={item.id}
                                      onChange={() =>
                                        handleAnswerChange(
                                          item.id,
                                          index1 + 1,
                                          String.fromCharCode(index + 65),
                                          index1,
                                          index
                                        )
                                      }
                                    />
                                    <div className="answerText text-xl text-start font-normal" dangerouslySetInnerHTML={{ __html: variant.matn }}>
                                      {/* {variant.matn} */}
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="w-full flex flex-col items-center">
                <button
                  type="submit"
                  className="w-1/2 btn btn-info btn-xl text-white"
                >
                  Testni yakunlash
                </button>
              </div>
            </form>
            <div className="sidebar w-[30%] p-5 border border-gray-400 sticky top-32 rounded-xl">
              <div className="user flex items-center gap-5 border-b border-gray-400 pb-1">
                <FaUser style={{ color: "gray", fontSize: "25px" }} />{" "}
                <h1 className="text-center text-2xl font-semibold">
                  {userData?.familya + " " + userData?.ism}
                </h1>
              </div>
              {/* result */}
              {showResult && <div className="my-5">
                <h1 className="flex items-center gap-3 text-2xl font-bold text-info">Natija: <span className="text-3xl">{result}</span>ta</h1>
              </div>}
              {/* time */}
              <div className="flex justify-center m-5">
                <span className="countdown font-mono text-3xl">
                  <span
                    style={{ "--value": hours }}
                    aria-live="polite"
                    aria-label={counter}
                  >
                    {hours}
                  </span>
                  :
                  <span
                    style={{ "--value": minutes }}
                    aria-live="polite"
                    aria-label={counter}
                  >
                    {minutes}
                  </span>
                  :
                  <span
                    style={{ "--value": seconds }}
                    aria-live="polite"
                    aria-label={counter}
                  >
                    {seconds}
                  </span>
                </span>
              </div>
              {/* process */}
              <div className="my-3 mb-10">
                <h1>Process</h1>
                <div className="test-proccess-container">
                  {quizzes && (
                    <div
                      className="test-proccess"
                      style={{
                        width:
                          (selectOption.length /
                            quizzes?.length) *
                            100 +
                          "%",
                      }}
                    ></div>
                  )}
                </div>
              </div>
              {/* btns */}
              <div className="flex gap-[6px] justify-between flex-wrap">
                {quizzes &&
                  quizzes.map((item, index) => {  
                    const isChanged = selectOption.includes(index + 1);   
                    return (
                      <button
                        onClick={() => handleScrollToQuestion(index)}
                        key={index}
                        className={`btn ${isChanged ? "btn-info" : "btn-outline"} text-[16px] mb-2 ${index + 1 < 10 ? "px-[19px]" : "" }`}
                      >
                        {index + 1}
                      </button>
                    )
                  })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Quiz;
