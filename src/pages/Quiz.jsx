import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FixedSizeList as List } from "react-window";
import { FaUser } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useGetFetch } from "../hooks/useGetFetch";
import { FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MathJaxContext, MathJax } from "better-react-mathjax";
import Time from "../components/Time";
import QuestionItem from "../components/QuestionItem";

function Quiz() {
  const userData = JSON.parse(localStorage.getItem("user-data"));
  const [answers, setAnswers] = useState([]);
  const [selectOption, setSelectOption] = useState(
    JSON.parse(localStorage.getItem("selectOption")) || []
  );
  const [showResult, setShowResult] = useState(
    localStorage.getItem("showResult") === "true" || false
  );
  const [result, setResult] = useState(localStorage.getItem("result") || null);
  const questionRefs = useRef([]);
  const timerRef = useRef(null);
  const isSubmittedRef = useRef(false);

  // get data
  const {
    data: quizzes,
    isPending,
    error,
  } = useGetFetch(`${import.meta.env.VITE_BASE_URL}/intihon/`);

  // math funck
  // function cleanMathFormula(str) {
  //   if (!str) return "";
  //   return str
  //     .replace(/(?<!\\)sqrt(?=[[{])/g, "\\sqrt")
  //     .replace(/(?<!\\)frac/g, "\\frac")
  //     .replace(/(?<!\\)pi/g, "\\pi")
  //     .replace(/(?<!\\)left/g, "\\left")
  //     .replace(/(?<!\\)right/g, "\\right")
  //     .replace(/&nbsp;/g, " ")
  //     .replace(/&lt;/g, "<")
  //     .replace(/&gt;/g, ">")
  //     .replace(/&amp;/g, "&");
  // }
  // function containsMath(str) {
  //   return /\\|sqrt|frac|pi|left|right|\$|\\\(|\\\)/.test(str);
  // }

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
  // ==========================================================================================================================================================
  useEffect(() => {
    localStorage.setItem("answers", JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem("saved_answers", JSON.stringify(selectedAnswers));
  }, [selectedAnswers]);
  // ==========================================================================================================================================================

  // submit
  const handleSubmit = (e) => {
    e.preventDefault();
    isSubmittedRef.current = true;
    clearInterval(timerRef.current);
    localStorage.removeItem("remainingTime");

    fetch(`${import.meta.env.VITE_BASE_URL}/check-answers/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userData.id,
        answers: answers,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => {
        setResult(data.ball);
        localStorage.setItem("result", data.ball);
        setShowResult(true);
        localStorage.setItem("showResult", true);
      })
      .catch((err) => console.log(err));
  };

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

  return (
    <div className="min-h-screen pb-12">
      <Navbar />
      <div className="container flex gap-10 items-start justify-between border border-green-600">
        {isPending && <p className="text-white">loading...</p>}
        {error && <p>{error}</p>}
        {Array.isArray(quizzes) && (
          <MathJaxContext
            config={{
              tex: {
                inlineMath: [
                  ["$", "$"],
                  ["\\(", "\\)"],
                ],
              },
              svg: { fontCache: "global" },
            }}
            version={3}
          >
            <form
              className="w-[70%] overflow-visible border border-red-500"
              onSubmit={handleSubmitPermition}
            >
              {/* <div className="quiz steps steps-vertical h-auto overflow-visible"> */}
                <List
                  height={window.innerHeight}
                  itemCount={quizzes.length}
                  itemSize={600}
                  width={"100%"}
                >
                  {({ index, style }) => {
                    const item = quizzes[index]; // <-- bu muhim
                    return (
                      <div style={style} key={item.id}>
                        <QuestionItem
                          item={item}
                          index1={index}
                          handleAnswerChange={handleAnswerChange}
                          showResult={showResult}
                          selectedAnswers={selectedAnswers}
                        />
                      </div>
                    );
                  }}
                </List>
                {/* {quizzes?.map((item, index1) => {
                  return (
                    <QuestionItem key={item.id} item={item} index1={index1} handleAnswerChange={handleAnswerChange} showResult={showResult} selectedAnswers={selectedAnswers}/>
                  );
                })} */}
              {/* </div> */}
              <div className="w-full flex flex-col items-center mt-5">
                <button
                  disabled={result ? true : false}
                  type="submit"
                  className={`w-1/2 btn btn-info btn-xl text-white rounded-2xl`}
                >
                  Testni yakunlash
                </button>
              </div>
            </form>
            <div className="sidebar w-[30%] p-5 border border-gray-400 sticky top-32 rounded-xl">
              <div className="user flex items-center gap-5 border-b border-gray-400 pb-1">
                <FaUser style={{ color: "gray", fontSize: "25px" }} />{" "}
                <h1 className="text-center text-2xl font-semibold text-white">
                  {userData?.familya + " " + userData?.ism}
                </h1>
              </div>
              {/* result */}
              {showResult && (
                <div className="my-5">
                  <h1 className="flex items-center gap-3 text-2xl font-bold text-info">
                    Natija: <span className="text-3xl">{result}</span>ta
                  </h1>
                </div>
              )}
              <Time
                // 2 * 60 * 60 * 1000
                showResult={showResult}
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
              <div className="grid grid-cols-5 gap-[5px]">
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
            </div>
          </MathJaxContext>
        )}
      </div>
    </div>
  );
}

export default Quiz;
