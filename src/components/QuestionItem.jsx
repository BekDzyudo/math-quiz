import { MathJax } from "better-react-mathjax";
import { FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import React from "react";

const QuestionItem = React.memo(
  ({
    item,
    index1,
    handleAnswerChange,
    showResult,
    selectedAnswers,
    questionRefs,
  }) => {
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

    //     function cleanMathFormula(str) {
    //   if (!str) return "";
    //   return str
    //     .replace(/&nbsp;/g, " ")
    //     .replace(/&lt;/g, "<")
    //     .replace(/&gt;/g, ">")
    //     .replace(/&amp;/g, "&");
    // }  bu funksiya latex format to'g'ri kelganda ishlaydi

    function containsMath(str) {
      return /\\|sqrt|frac|pi|left|right|\$|\\\(|\\\)/.test(str);
    }

    function stripHtmlTagsPreserveMath(html) {
      if (!html) return "";
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    }

    return (
      <div className="w-full" ref={(el) => (questionRefs.current[index1] = el)}>
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col md:flex-row md:items-center gap-3 w-full">
            <button type="button" className="btn md:rounded-sm rounded-t-2xl btn-active btn-info text-[18px] md:text-2xl text-white">
              {index1 + 1}
            </button>
            {/* <h1 className="w-full text-[18px] md:text-2xl text-start font-semibold m-0 border-b border-gray-400 leading-7 md:leading-10 text-white overflow-wrap">
              {containsMath(item.savol)
                ? cleanMathFormula(stripHtmlTagsPreserveMath(item.savol))
                    .split(/\$(.*?)\$/)
                    .map((part, idx) =>
                      idx % 2 === 0 ? (
                        <span key={idx}>{part}</span>
                      ) : (
                        <div key={idx} className="w-full overflow-x-auto overflow-y-hidden custom-scrollbar" style={{ WebkitOverflowScrolling: "touch" }}>
                          <MathJax dynamic inline={false}>
                            {`\\(${part}\\)`}
                          </MathJax>
                        </div>
                      )
                    )
                : stripHtmlTagsPreserveMath(item.savol)}
            </h1> */}
            <h1 className="w-full text-[18px] md:text-2xl text-start font-semibold m-0 border-b border-gray-400 leading-7 md:leading-10 text-white overflow-wrap">
            {containsMath(item.savol) ? (
              <div className="w-full overflow-x-auto overflow-y-hidden custom-scrollbar" style={{ WebkitOverflowScrolling: "touch" }}>
              <MathJax dynamic inline={false} key={item.id}>{cleanMathFormula(stripHtmlTagsPreserveMath(item.savol))}</MathJax>
              </div>
            ) : (
              stripHtmlTagsPreserveMath(item.savol).replace(/<[^>]*>/g, "")
            )}
          </h1>
          </div>
          {showResult && (
            <Link
              to={item.answer_video_url}
              target="_blank"
              className="flex items-center justify-center md:justify-start gap-3 link text-white"
            >
              {" "}
              <FaYoutube className="text-3xl text-red-500" /> Yechimni ko'rish
            </Link>
          )}
          <div className="space-y-3 md:ml-6">
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
                    className={`test-label group flex items-center gap-2 md:gap-4 p-2 md:p-4 cursor-pointer bg-[#3b4d66] rounded-lg`}
                  >
                    <div
                      className={`test-letter text-[18px] md:text-xl font-bold ${
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
                      className="answerText text-[18px] md:text-xl text-start font-normal text-white"
                      // dangerouslySetInnerHTML={{
                      //   __html: cleanMathFormula(variant.matn),
                      // }}
                    >
                      {containsMath(variant.matn) ? (
                        <MathJax dynamic key={item.id}>
                          <span>
                            {cleanMathFormula(
                              stripHtmlTagsPreserveMath(variant.matn)
                            )}
                          </span>
                        </MathJax>
                      ) : (
                        stripHtmlTagsPreserveMath(variant.matn).replace(
                          /<[^>]*>/g,
                          ""
                        )
                      )}
                    </div>
                  </label>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
);

export default QuestionItem;
