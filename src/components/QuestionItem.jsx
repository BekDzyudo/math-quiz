import { MathJax } from "better-react-mathjax";
import { FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import React, { useRef } from "react";
import { FixedSizeList as List } from "react-window";

const QuestionItem = React.memo(({item, index1, handleAnswerChange, showResult, selectedAnswers}) => {

     const questionRefs = useRef([]);
     
    function cleanMathFormula(str) {
    if (!str) return "";
    return str
      .replace(/(?<!\\)sqrt(?=[[{])/g, "\\sqrt")
      .replace(/(?<!\\)frac/g, "\\frac")
      .replace(/(?<!\\)pi/g, "\\pi")
      .replace(/(?<!\\)left/g, "\\left")
      .replace(/(?<!\\)right/g, "\\right")
      .replace(/&nbsp;/g, " ")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&");
  }
  function containsMath(str) {
    return /\\|sqrt|frac|pi|left|right|\$|\\\(|\\\)/.test(str);
  }

  return (
    // <div
    //   ref={(el) => (questionRefs.current[index1] = el)}
    //   className="step step-info text-lg mb-10"
    // >
      <div className="flex items-start w-full border border-yellow-500" ref={(el) => (questionRefs.current[index1] = el)}>
        <div className="mt-2 w-6 flex-shrink-0 text-2xl"></div>
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-2xl text-start font-semibold border-b border-gray-400 m-0 p-0 leading-10 text-white">
            {containsMath(item.savol) ? (
              <MathJax dynamic><span>{cleanMathFormula(item.savol)}</span></MathJax>
            ) : (
              item.savol.replace(/<[^>]*>/g, "")
            )}
          </h1>
          {showResult && (
            <Link
              to={item.answer_video_url}
              target="_blank"
              className="flex items-center gap-3 link text-white"
            >
              {" "}
              <FaYoutube className="text-3xl text-red-500" /> Yechimni ko'rish
            </Link>
          )}
          <div className="space-y-3 ml-6">
            {Array.isArray(item?.javoblar) &&
              item?.javoblar?.map((variant, index) => {
                const isSelected = selectedAnswers[item.id] === index;
                return (
                  <label
                    style={{
                      border: "3px solid",
                      borderColor: showResult
                        ? variant.togri
                          ? "green"
                          : isSelected
                          ? "red"
                          : "transparent"
                        : isSelected
                        ? "#00A4F2"
                        : "transparent",
                    }}
                    key={index}
                    className={`test-label group flex items-center gap-4 p-4 cursor-pointer bg-[#3b4d66] rounded-lg`}
                  >
                    <div
                      className={`test-letter text-xl font-bold ${
                        isSelected ? "bg-info text-white" : "bg-gray-300"
                      } px-3 py-1 rounded group-hover:text-[#00A4F2] text-gray-500`}
                    >
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
                    <div
                      className="answerText text-xl text-start font-normal text-white"
                      // dangerouslySetInnerHTML={{
                      //   __html: cleanMathFormula(variant.matn),
                      // }}
                    >
                      {containsMath(variant.matn)
                        ? cleanMathFormula(variant.matn)
                        : variant.matn.replace(/<[^>]*>/g, "")}
                    </div>
                  </label>
                );
              })}
          </div>
        </div>
      </div>
    // </div>
  );
});

export default QuestionItem;
