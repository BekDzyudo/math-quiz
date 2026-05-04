import { MathJax } from "better-react-mathjax";
import { FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import React, { useMemo } from "react";

// Komponentdan tashqarida — har render da qayta yaratilmaydi
function parseHtmlContent(html) {
  if (!html) return [];

  const div = document.createElement("div");
  div.innerHTML = html;

  const images = div.querySelectorAll("img");

  if (images.length === 0) {
    const hasMath = /<span[^>]*class="math[^"]*"[^>]*>/.test(html) || /\\\[|\\\(/.test(html);
    return [{ type: "html", content: html, hasMath, key: "full-html" }];
  }

  const parsed = [];
  let currentHtml = "";

  const flush = (idx) => {
    if (currentHtml.trim()) {
      const hasMath = /<span[^>]*class="math[^"]*"[^>]*>/.test(currentHtml) || /\\\[|\\\(/.test(currentHtml);
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
        flush(index);
        walk(Array.from(el.childNodes));
      } else {
        currentHtml += el.outerHTML || el.textContent || "";
      }
    });
  };

  walk(Array.from(div.childNodes));
  flush(999);

  return parsed;
}

function renderBlocks(blocks, itemId, variantIndex) {
  return blocks.map((block) => {
    if (block.type === "image") {
      return (
        <img
          key={block.key}
          src={`https://matematikapro.uz${block.src}`}
          alt="Rasm"
          className="w-full sm:w-4/5 md:w-96 h-auto rounded shadow-md my-2"
        />
      );
    } else if (block.hasMath) {
      const key = variantIndex != null
        ? `${itemId}-v${variantIndex}-${block.key}`
        : `${itemId}-${block.key}`;
      return (
        <MathJax dynamic inline key={key}>
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
}

// Har bir javob variantining math kontentini alohida memo komponent sifatida render qilish
// selectedAnswers o'zgarganda bu komponent qayta render bo'lmaydi
const VariantMathContent = React.memo(({ variant, itemId, variantIndex }) => {
  const parsedVariant = useMemo(() => parseHtmlContent(variant.matn), [variant.matn]);
  return <>{renderBlocks(parsedVariant, itemId, variantIndex)}</>;
});

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
    // item.savol o'zgarmasa qayta parse qilinmaydi
    const parsedContent = useMemo(() => parseHtmlContent(item?.savol), [item?.savol]);

    return (
      <div
        className="w-full mb-6 md:mb-10"
        ref={(el) => (questionRefs.current[index1] = el)}
      >
        <div className="flex flex-col gap-3 md:gap-4 w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-3 w-full">
            <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-base md:text-lg">
              {index1 + 1}
            </div>
            {item.savol && (
              <div className="w-full text-base md:text-[18px] lg:text-xl text-start font-semibold text-slate-800 border-b border-slate-200 pb-3 leading-6 md:leading-7 lg:leading-9 overflow-wrap">
                <div
                  className="w-full overflow-x-auto overflow-y-hidden custom-scrollbar pb-1"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {parsedContent.map((block) => {
                    if (block.type === "image") {
                      return (
                        <img
                          key={block.key}
                          src={`https://matematikapro.uz${block.src}`}
                          alt="Savol rasmi"
                          className="w-full sm:w-4/5 md:w-96 h-auto rounded shadow-md my-2"
                        />
                      );
                    } else if (block.hasMath) {
                      return (
                        <MathJax dynamic inline key={`${item.id}-${block.key}`}>
                          <span dangerouslySetInnerHTML={{ __html: block.content }} />
                        </MathJax>
                      );
                    } else {
                      return (
                        <div
                          key={block.key}
                          className="text-base md:text-[18px] lg:text-xl leading-6 md:leading-7 lg:leading-9"
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
              className="flex items-center justify-center md:justify-start gap-2 md:gap-3 link text-slate-600 hover:text-red-500 transition-colors duration-200 py-1"
            >
              <FaYoutube className="text-2xl md:text-3xl text-red-500" />
              <span className="text-base md:text-lg font-medium">Yechimni ko'rish</span>
            </Link>
          )}
          <div className="space-y-2 md:space-y-3">
            {Array.isArray(item?.javoblar) &&
              item?.javoblar?.map((variant, index) => {
                const isSelected = selectedAnswers[item.id] === String.fromCharCode(index + 65);
                const isCorrect = variant.togri;
                const testFinished = isFinished === "true" || showResult;

                let borderColor = "#E2E8F0";
                let bgColor = "bg-slate-50";
                let letterBgColor = "bg-slate-200";
                let letterTextColor = "text-slate-600";

                if (testFinished) {
                  if (isCorrect) {
                    borderColor = "#22c55e";
                    bgColor = "bg-green-50";
                    letterBgColor = "bg-green-500";
                    letterTextColor = "text-white";
                  } else if (isSelected) {
                    borderColor = "#ef4444";
                    bgColor = "bg-red-50";
                    letterBgColor = "bg-red-500";
                    letterTextColor = "text-white";
                  }
                } else {
                  if (isSelected) {
                    borderColor = "#6366F1";
                    bgColor = "bg-indigo-50";
                    letterBgColor = "bg-indigo-600";
                    letterTextColor = "text-white";
                  }
                }

                return (
                  <label
                    style={{ border: "2px solid", borderColor }}
                    key={index}
                    className={`test-label group flex items-center gap-2 md:gap-3 lg:gap-4 p-3 md:p-4 ${testFinished ? 'cursor-default' : 'cursor-pointer'} ${bgColor} rounded-xl transition-all duration-200 min-h-[52px]`}
                  >
                    <div
                      className={`test-letter text-base md:text-[18px] lg:text-xl font-bold ${letterBgColor} ${letterTextColor} px-2.5 md:px-3 py-1 rounded-lg min-w-[32px] md:min-w-[36px] flex items-center justify-center`}
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
                    <div className="answerText text-base md:text-[18px] lg:text-xl text-start font-normal text-slate-800 w-full leading-6 md:leading-7">
                      <VariantMathContent
                        variant={variant}
                        itemId={item.id}
                        variantIndex={index}
                      />
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
