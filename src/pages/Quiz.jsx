import React, { useContext, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { GlobalContext } from "../context/GlobalContext";
import { useGetFetch } from "../hooks/useGetFetch";

function Quiz() {
  const { isTheme } = useContext(GlobalContext);
  const [answers, setAnswers] = useState({});

  const handleAnswerChange = (question, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: selectedOption,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User answers:", answers);
    // bu yerda javoblarni serverga jo‘natsangiz ham bo‘ladi
  };

  const {
    data: quizzes,
    isPending,
    error,
  } = useGetFetch("http://localhost:3000/quizzes");

  // time
  const [hours, setHours] = useState(2);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const counter = `${hours} hours ${minutes} minutes ${seconds} seconds`;

  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       setSeconds((prev) => {
  //         if (prev > 0) return prev - 1;
  //         setMinutes((m) => {
  //           if (m > 0) return m - 1;
  //           setHours((h) => (h > 0 ? h - 1 : 0));
  //           return 59;
  //         });
  //         return 59;
  //       });
  //     }, 1000);
  //     return () => clearInterval(interval);
  //   }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container flex gap-10 items-start justify-between">
        <form className="w-[70%]" onSubmit={handleSubmit}>
          <div className="quiz steps steps-vertical">
            {isPending && <p>loading...</p>}
            {error && <p>{error}</p>}
            {quizzes &&
              quizzes[2]?.questions.map((item, index) => {
                return (
                  <div key={index} className="step step-info text-lg mb-10">
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
                                      item.question,
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
          <button type="submit" className="btn btn-info btn-xl">submit</button>
        </form>
        <div className="sidebar w-[30%] p-5 border border-gray-400 sticky top-32 rounded-xl">
          <div className="user flex items-center gap-5 border-b border-gray-400 pb-1">
            <FaUser style={{ color: "gray", fontSize: "25px" }} />{" "}
            <h1 className="text-center text-2xl font-semibold">
              Alimardonov Valijon
            </h1>
          </div>
          {/* For TSX uncomment the commented types below */}
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
          <div className="my-3 mb-10">
            <h1>Process</h1>
            <div className="test-proccess-container">
              <div
                className="test-proccess"
                style={{
                  width: 0.3 * 100 + "%",
                }}
              ></div>
            </div>
          </div>
          <div className="flex gap-[5px] flex-wrap">
            {quizzes &&
              quizzes[2]?.questions.map((item, index) => {
                return (
                  <button className="btn btn-outline text-[16px] mb-2">
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
