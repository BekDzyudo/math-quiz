import React, { useEffect, useRef } from "react";

function MilliyQuestionItem({ index, value, onChange, savolRaqami}) {
  const mathFieldRef = useRef(null);

  useEffect(() => {
    const mf = mathFieldRef.current;
    if (!mf) return;

    // Boshlang‘ich qiymatni tiklash
    mf.value = value;

    const handleInput = () => {
      onChange(index, mf.value, savolRaqami);
    };
    mf.addEventListener("input", handleInput);

    return () => mf.removeEventListener("input", handleInput);
  }, [index, onChange, value, savolRaqami]);

  function getSavolRaqami(index) {
  const start = 36;

  // 36a–45b oralig‘i uchun
  const pairStart = 36;
  const pairEnd = 45;
  const totalPairCount = (pairEnd - pairStart + 1) * 2; // 20 ta (36a,b ... 45a,b)

  if (index < totalPairCount) {
    const number = pairStart + Math.floor(index / 2);
    const suffix = index % 2 === 0 ? "a" : "b";
    return `${number}${suffix}`;
  }

  // qolganlari 46–50
  // const remainingIndex = index - totalPairCount;
  // return `${46 + remainingIndex}`;
}

  return (
    <div key={index} className="flex justify-between items-center">
      <span className="flex w-[22%] max-h-min justify-center items-center text-[14px] md:text-xl font-bold px-2 md:px-4 py-1 bg-[#5e7a9e] rounded text-white">
        {getSavolRaqami(index)}-savol
      </span>
      <math-field
        ref={mathFieldRef}
        smartMode
        className="cursor-pointer outline-0 border border-gray-400 md:py-0.5 px-1 md:px-2 rounded w-[76%] text-[14px] md:text-[18px] bg-[#3b4d66]"
      ></math-field>
    </div>
  );
}

export default MilliyQuestionItem;
