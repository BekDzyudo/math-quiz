import React, { useContext, useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { GlobalContext } from "../context/GlobalContext";
import { useGetFetch } from "../hooks/useGetFetch";

function Quiz() {
  const { isTheme } = useContext(GlobalContext);
  const [answers, setAnswers] = useState({});
  const [selectOption, setSelectOption] = useState(
    JSON.parse(localStorage.getItem("selectOption")) || []
  );

  const handleAnswerChange = (question_number, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [question_number]: selectedOption,
    }));
    setSelectOption(Object.keys(answers));
    localStorage.setItem("selectOption", JSON.stringify(Object.keys(answers)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User answers:", answers);
    localStorage.removeItem("selectOption");
  };

  const {
    data: quizzes,
    isPending,
    error,
  } = useGetFetch("http://localhost:3000/quizzes");

  // time ==================================================================
  const defaultTime = 2 * 60 * 60 * 1000; // 2 soat msda
  const [remainingTime, setRemainingTime] = useState(() => {
    const saved = localStorage.getItem("remainingTime");
    return saved ? parseInt(saved) : defaultTime;
  });

  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev - 1000;
        if (newTime <= 0) {
          clearInterval(timerRef.current);
          localStorage.removeItem("remainingTime");
          return 0;
        }
        localStorage.setItem("remainingTime", newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  const hours = Math.floor(remainingTime / (1000 * 60 * 60));
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
  const counter = `${hours} hours ${minutes} minutes ${seconds} seconds`;
  // ===========================================================================

  return (
    <div className="min-h-screen pb-12">
      <Navbar />
      <div className="container flex gap-10 items-start justify-between">
        <form className="w-[70%]" onSubmit={handleSubmit}>
          <div className="quiz steps steps-vertical">
            {isPending && <p>loading...</p>}
            {error && <p>{error}</p>}
            {quizzes &&
              quizzes[2]?.questions.map((item, index1) => {
                return (
                  <div key={index1} className="step step-info text-lg mb-10">
                    <div className="flex items-start gap-4 w-full">
                      {/* Step aylanasi */}
                      <div className="mt-2 w-6 flex-shrink-0 text-2xl"></div>
                      <div className="flex flex-col gap-4 w-full">
                        <h1 className="text-2xl text-start font-semibold border-b border-gray-400">
                          {item.question}
                        </h1>
                        <div className="space-y-3 ml-6">
                          {item.options.map((variant, index) => {
                            return (
                              <label
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
                                  name={item.question}
                                  onChange={() =>
                                    handleAnswerChange(
                                      index1 + 1,
                                      String.fromCharCode(index + 65)
                                    )
                                  }
                                />
                                <div className="answerText text-xl text-start font-normal">
                                  {variant}
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
              Alimardonov Valijon
            </h1>
          </div>
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
                      (selectOption.length / quizzes[2]?.questions?.length) *
                        100 +
                      "%",
                  }}
                ></div>
              )}
            </div>
          </div>
          {/* btns */}
          <div className="flex gap-[5px] flex-wrap">
            {quizzes &&
              quizzes[2]?.questions.map((item, index) => {
                return (
                  <button
                    key={index}
                    className="btn btn-outline text-[16px] mb-2"
                  >
                    {index + 1}
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
