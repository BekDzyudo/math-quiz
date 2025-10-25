import { FaUser } from "react-icons/fa";
import NavbarMilliy from "../components/NavbarMilliy";
import { Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import "mathlive";
import { FaEdit } from "react-icons/fa";
import MilliyQuestionItem from "../components/MilliyQuestionItem";
import Result from "../components/modal/result";
import { toast } from "react-toastify";

function MilliyTestQuiz() {
  const ochiqQuizCount = Array.from({ length: 35 });
  const [yopiqQuizAnswers, setYopiqQuizAnswers] = useState(() => {
    const saved = localStorage.getItem("answers_yopiq");
    return saved ? JSON.parse(saved) : Array(15).fill("");
  });

  const { userData, activeModal, setActiveModal } = useContext(GlobalContext);

  const [answersM, setAnswersM] = useState([]);
  const [selectOptionM, setSelectOptionM] = useState(
    JSON.parse(localStorage.getItem("selectOptionM")) || []
  );
  // change input
  const [selectedAnswersM, setSelectedAnswersM] = useState({});
  useEffect(() => {
    const savedAnswersM = localStorage.getItem("saved_answersM");
    const answersM = JSON.parse(localStorage.getItem("answersM"));
    const yopiqQuizAnswers = JSON.parse(localStorage.getItem("answers_yopiq"));
    if (answersM) {
      setAnswersM(answersM);
    }
    if (savedAnswersM) {
      setSelectedAnswersM(JSON.parse(savedAnswersM));
    }
    if (yopiqQuizAnswers) {
      setYopiqQuizAnswers(yopiqQuizAnswers);
    }
  }, []);

  const handleAnswerChange = (question_number, selectedOption, optionIndex) => {
    const update = { ...selectedAnswersM, [question_number]: optionIndex };
    setSelectedAnswersM(update);

    // =====
    setAnswersM((prevAnswers) => {
      const existingIndex = prevAnswers.findIndex(
        (item) => item.savol_raqami === question_number
      );
      if (existingIndex !== -1) {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingIndex] = {
          ...updatedAnswers[existingIndex],
          javob: selectedOption,
        };
        return updatedAnswers;
      } else {
        return [
          ...prevAnswers,
          { savol_raqami: question_number, javob: selectedOption },
        ];
      }
    });

    setSelectOptionM((prev) => {
      let updated;
      if (!prev.includes(question_number)) {
        updated = [...prev, question_number];
      } else {
        updated = prev;
      }
      localStorage.setItem("selectOptionM", JSON.stringify(updated));
      return updated;
    });
  };

  // const handleAnswerChangeYopiq =(index, newValue, question_number)=>{
  //    setYopiqQuizAnswers((prev) => {
  //     const updated = [...prev];
  //     updated[index] = { savol_raqami:question_number, javob: newValue };
  //     return updated;
  //   });
  // }

  const savolNum = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50];
  const handleAnswerChangeYopiq = (index, newValue, question_number) => {
    setYopiqQuizAnswers((prev) => {
      const updated = [...prev];
      const savolRaqami = savolNum[index];

      updated[index] = {
        savol_raqami: savolRaqami,
        javob: newValue || "",
      };

      return savolNum.map((raqam, i) => ({
        savol_raqami: raqam,
        javob: updated[i]?.javob || "",
      }));
    });
  };

  useEffect(() => {
    localStorage.setItem("answersM", JSON.stringify(answersM));
  }, [answersM]);

  useEffect(() => {
    localStorage.setItem("saved_answersM", JSON.stringify(selectedAnswersM));
  }, [selectedAnswersM]);

  useEffect(() => {
    localStorage.setItem("answers_yopiq", JSON.stringify(yopiqQuizAnswers));
  }, [yopiqQuizAnswers]);

  const result = answersM.concat(yopiqQuizAnswers);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${import.meta.env.VITE_BASE_URL}/check/1/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userData.user_id,
        answers: result,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(JSON.stringify(errorData));
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        localStorage.clear();
      })
      .catch((err) => {
        console.error("Server xatosi:", err.message);
        try {
          // Agar xatolik JSON bo‘lsa, parse qilib chiroyli ko‘rsatamiz
          const parsed = JSON.parse(err.message);
          console.error("Xatolik tafsilotlari:", parsed);
          toast.error(parsed.message)
        } catch {
          console.error("Oddiy xatolik:", err);
        }
        // if (err.message == "bor")
        //   toast.error("Siz oldin ushbu testni bajargansiz!");
      });
  };

  return (
    <div className="min-h-screen">
      <NavbarMilliy />
      <div className="px-5 md:max-w-[700px] md:w-full md:mr-auto md:ml-auto md:px-[50px] flex md:gap-10 items-start justify-between h-full pt-5 pb-5 md:pb-10">
        <form className="w-full h-full" onSubmit={handleSubmit}>
          <div className="w-full grid grid-cols-1 md:grid-cols-1 gap-3 md:gap-4 mb-5 pb-10 md:pb-20">
            {ochiqQuizCount.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`bg-[#3b4d66] rounded-lg flex justify-between gap-2 md:gap-6 items-center p-2 md:p-4`}
                >
                  <span className="text-sm md:text-xl font-bold px-4 py-1 bg-[#5e7a9e] rounded text-white">
                    {index + 1}-savol
                  </span>
                  <div className="flex items-center justify-between gap-5 md:gap-4">
                    <label
                      className={`test-label group flex justify-center items-center`}
                    >
                      <div
                        className={`test-letter w-min text-[14px] md:text-[18px] md:text-xl font-bold ${
                          selectedAnswersM[index + 1] == 0
                            ? "bg-info text-white"
                            : "bg-gray-300"
                        } px-3 py-1 rounded group-hover:text-[#00A4F2] text-gray-500 cursor-pointer`}
                      >
                        A
                      </div>
                      <input
                        type="radio"
                        name={index}
                        onChange={() => handleAnswerChange(index + 1, "A", 0)}
                      />
                    </label>
                    <label
                      className={`test-label group flex justify-center items-center`}
                    >
                      <div
                        className={`test-letter w-min text-[14px] md:text-[18px] md:text-xl font-bold ${
                          selectedAnswersM[index + 1] == 1
                            ? "bg-info text-white"
                            : "bg-gray-300"
                        } px-3 py-1 rounded group-hover:text-[#00A4F2] text-gray-500 cursor-pointer`}
                      >
                        B
                      </div>
                      <input
                        type="radio"
                        name={index}
                        onChange={() => handleAnswerChange(index + 1, "B", 1)}
                      />
                    </label>
                    <label
                      className={`test-label group flex justify-center items-center`}
                    >
                      <div
                        className={`test-letter w-min text-[14px] md:text-[18px] md:text-xl font-bold ${
                          selectedAnswersM[index + 1] == 2
                            ? "bg-info text-white"
                            : "bg-gray-300"
                        } px-3 py-1 rounded group-hover:text-[#00A4F2] text-gray-500 cursor-pointer`}
                      >
                        C
                      </div>
                      <input
                        type="radio"
                        name={index}
                        onChange={() => handleAnswerChange(index + 1, "C", 2)}
                      />
                    </label>
                    <label
                      className={`test-label group flex justify-center items-center`}
                    >
                      <div
                        className={`test-letter w-min text-[14px] md:text-[18px] md:text-xl font-bold ${
                          selectedAnswersM[index + 1] == 3
                            ? "bg-info text-white"
                            : "bg-gray-300"
                        } px-3 py-1 rounded group-hover:text-[#00A4F2] text-gray-500 cursor-pointer`}
                      >
                        D
                      </div>
                      <input
                        type="radio"
                        name={index}
                        onChange={() => handleAnswerChange(index + 1, "D", 3)}
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
          <h2 className="text-md text-white flex items-center gap-3">
            <FaEdit className="text-xl" /> Yozma javoblar (36-50)
          </h2>
          <div className="mt-1 grid grid-cols-1 md:grid-cols-1 gap-3 md:gap-4 border-t border-gray-400 pt-5">
            {yopiqQuizAnswers.map((item, index) => {
              return (
                <MilliyQuestionItem
                  key={index}
                  index={index}
                  value={yopiqQuizAnswers[index]?.javob || ""}
                  onChange={handleAnswerChangeYopiq}
                  savolRaqami={index + 36}
                />
              );
            })}
          </div>
          <div className="flex justify-center mt-10 md:mt-20">
            <button
              type="submit"
              className={`w-1/2 md:w-1/2 btn btn-outline btn-info btn-md md:btn-xl text-white rounded-2xl`}
            >
              Testni yakunlash
            </button>
            <button
              className="btn btn-info"
              onClick={() => setActiveModal(true)}
            >
              modal
            </button>
          </div>
        </form>

        {/* <div className="hidden md:block sidebar w-[30%] p-5 border border-gray-400 sticky top-32 rounded-xl">
          <div className="user flex items-center gap-5 border-b border-gray-400 pb-1">
            <FaUser style={{ color: "gray", fontSize: "25px" }} />{" "}
            <h1 className="text-center text-2xl font-semibold text-white">
              {userData?.last_name + " " + userData?.first_name}
            </h1>
          </div>
          <div className="w-full flex flex-col items-center mt-5">
            <Link
              type="button"
              className={`w-full btn btn-outline btn-info btn-xl text-white rounded-2xl`}
            >
              Testni yakunlash
            </Link>
          </div>
        </div> */}
      </div>
      {activeModal && <Result />}
    </div>
  );
}

export default MilliyTestQuiz;
