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
    isFinished,
    selectedAnswers,
    questionRefs,
  }) => {
    function cleanMathFormula(str) {
      if (!str) return "";
      return str
        .replace(/(?<!\\)\bsqrt\b(?=[[{])/g, "\\sqrt")
        .replace(/(?<!\\)\bfrac\b/g, "\\frac")
        .replace(/(?<![a-zA-Z])pi(?![a-zA-Z])/g, "\\pi")
        .replace(/(?<!\\)\bleft\b(?=[\\(\[{|.])/g, "\\left")
        .replace(/(?<!\\)\bright\b(?=[\\)\]}|.])/g, "\\right")
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
      return /\\\(|\\\)|\\\[|\\\]|\$|\\[a-zA-Z]/.test(str);
    }

    function stripHtmlTagsPreserveMath(html) {
      if (!html) return "";
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    }

    // test funktion
    function parseHtmlContent(html) {
      if (!html) return [];

      const div = document.createElement("div");
      div.innerHTML = html;

      // Rasmlar bor-yo'qligini tekshirish
      const images = div.querySelectorAll("img");
      
      if (images.length === 0) {
        // Rasmlar yo'q - butun HTML'ni bitta blok sifatida qaytarish
        const hasMath = /<span[^>]*class="math[^"]*"[^>]*>/.test(html);
        return [{ type: "html", content: html, hasMath, key: "full-html" }];
      }

      // Rasmlar bor - matn va rasmlarni ajratish
      const parsed = [];
      let currentHtml = "";
      
      const flush = (idx) => {
        if (currentHtml.trim()) {
          const hasMath = /<span[^>]*class="math[^"]*"[^>]*>/.test(currentHtml);
          parsed.push({ type: "html", content: currentHtml, hasMath, key: `html-${idx}` });
          currentHtml = "";
        }
      };

      const walk = (nodes) => {
        nodes.forEach((el, index) => {
          if (el.nodeName === "IMG") {
            flush(index);
            parsed.push({ type: "image", src: el.getAttribute("src"), key: `img-${index}` });
          } else if (el.nodeName === "P" && el.querySelector("img")) {
            // P ichida rasm bor
            flush(index);
            // P ichidagi elementlarni rekursiv yurish
            walk(Array.from(el.childNodes));
          } else {
            // Matnli element - HTML sifatida yig'ish
            currentHtml += el.outerHTML || el.textContent || "";
          }
        });
      };

      walk(Array.from(div.childNodes));
      flush(999);

      return parsed;
    }

    const parsedContent = parseHtmlContent(item?.savol);

    return (
      <div
        className="w-full mb-12 md:mb-20"
        ref={(el) => (questionRefs.current[index1] = el)}
      >
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col md:flex-row md:items-center gap-3 w-full">
            <button
              type="button"
              className="btn md:rounded-sm rounded-t-2xl btn-active btn-info text-[18px] md:text-2xl text-white"
            >
              {index1 + 1}
            </button>
            {item.savol && (
              <div className="w-full text-[18px] md:text-2xl text-start font-semibold m-0 border-b border-gray-400 leading-7 md:leading-10 text-white overflow-wrap">
                <div
                  className="w-full overflow-x-auto overflow-y-hidden custom-scrollbar"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {parsedContent.map((block) => {
                    if (block.type === "image") {
                      return (
                        <img
                          key={block.key}
                          src={`https://matematikapro.uz${block.src}`}
                          alt="Savol rasmi"
                          className="w-full md:w-96 h-auto rounded shadow-md my-2"
                        />
                      );
                    } else if (block.hasMath) {
                      return (
                        <MathJax dynamic inline key={block.key}>
                          <span dangerouslySetInnerHTML={{ __html: block.content }} />
                        </MathJax>
                      );
                    } else {
                      return (
                        <div
                          key={block.key}
                          className="text-[18px] md:text-2xl leading-7 md:leading-10"
                          dangerouslySetInnerHTML={{ __html: block.content }}
                        />
                      );
                    }
                  })}
                </div>
              </div>
            )}
          </div>
          {(isFinished === "true" || showResult) && item.answer_video_url && (
            <Link
              to={item.answer_video_url}
              target="_blank"
              className="flex items-center justify-center md:justify-start gap-3 link text-white hover:text-red-400 transition-colors duration-200"
            >
              <FaYoutube className="text-3xl text-red-500" /> 
              <span className="text-lg font-medium">Yechimni ko'rish</span>
            </Link>
          )}
          <div className="space-y-3 md:ml-6">
            {Array.isArray(item?.javoblar) &&
              item?.javoblar?.map((variant, index) => {
                const isSelected = selectedAnswers[item.id] === String.fromCharCode(index + 65);
                const isCorrect = variant.togri;
                const testFinished = isFinished === "true" || showResult;
                
                // Ranglarni aniqlash
                let borderColor = "transparent";
                let bgColor = "bg-[#3b4d66]";
                let letterBgColor = "bg-gray-300";
                let letterTextColor = "text-gray-500";
                
                if (testFinished) {
                  // Test tugallangan - natijalarni ko'rsatish
                  if (isCorrect) {
                    borderColor = "#22c55e"; // yashil - to'g'ri javob
                    letterBgColor = "bg-green-500";
                    letterTextColor = "text-white";
                  } else if (isSelected) {
                    borderColor = "#ef4444"; // qizil - noto'g'ri tanlangan javob
                    letterBgColor = "bg-red-500";
                    letterTextColor = "text-white";
                  }
                } else {
                  // Test davom etayotgan - faqat tanlangan javobni ko'rsatish
                  if (isSelected) {
                    borderColor = "#00A4F2"; // ko'k - tanlangan javob
                    letterBgColor = "bg-info";
                    letterTextColor = "text-white";
                  }
                }
                
                return (
                  <label
                    style={{
                      border: "3px solid",
                      borderColor: borderColor,
                    }}
                    key={index}
                    className={`test-label group flex items-center gap-2 md:gap-4 p-2 md:p-4 ${testFinished ? 'cursor-default' : 'cursor-pointer'} ${bgColor} rounded-lg transition-all duration-200`}
                  >
                    <div
                      className={`test-letter text-[18px] md:text-xl font-bold ${letterBgColor} ${letterTextColor} px-3 py-1 rounded`}
                    >
                      {String.fromCharCode(index + 65)}
                    </div>
                    <input
                      type="radio"
                      name={item.id}
                      checked={isSelected}
                      disabled={testFinished}
                      onChange={() =>
                        handleAnswerChange(
                          item.id,
                          index1 + 1,
                          String.fromCharCode(index + 65),
                          index1,
                          index
                        )
                      }
                      className={testFinished ? 'hidden' : ''}
                    />
                    <div className="answerText text-[18px] md:text-xl text-start font-normal text-white w-full">
                      {(() => {
                        const parsedVariant = parseHtmlContent(variant.matn);
                        return parsedVariant.map((block) => {
                          if (block.type === "image") {
                            return (
                              <img
                                key={block.key}
                                src={`https://matematikapro.uz${block.src}`}
                                alt="Javob rasmi"
                                className="w-full md:w-64 h-auto rounded shadow-md my-2"
                              />
                            );
                          } else if (block.hasMath) {
                            return (
                              <MathJax dynamic inline={true} key={block.key}>
                                <span dangerouslySetInnerHTML={{ __html: block.content }} />
                              </MathJax>
                            );
                          } else {
                            return (
                              <span
                                key={block.key}
                                dangerouslySetInnerHTML={{ __html: block.content }}
                              />
                            );
                          }
                        });
                      })()}
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
