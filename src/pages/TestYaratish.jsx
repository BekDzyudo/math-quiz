import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import MilliyQuestionItem from "../components/MilliyQuestionItem";
import "mathlive";

function TestYaratish() {
    const navigate = useNavigate();
    const [testTitle, setTestTitle] = useState("");
    const [testCode, setTestCode] = useState("");
    const [deadline, setDeadline] = useState("");
    const [questions, setQuestions] = useState(
        Array.from({ length: 35 }, (_, i) => ({
            id: i + 1,
            number: i + 1,
            correctAnswer: null,
        }))
    );

    // Open-ended questions (36a-45b = 20 questions)
    const yopiqSavollarRaqamlari = ["36a", "36b", "37a", "37b", "38a", "38b", "39a", "39b", "40a", "40b",
        "41a", "41b", "42a", "42b", "43a", "43b", "44a", "44b", "45a", "45b"];

    const [openEndedQuestions, setOpenEndedQuestions] = useState(
        yopiqSavollarRaqamlari.map(raqam => ({
            number: raqam,
            correctAnswer: ""
        }))
    );

    const handleAnswerChange = (questionNumber, answer) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((q) =>
                q.number === questionNumber ? { ...q, correctAnswer: answer } : q
            )
        );
    };

    const handleOpenEndedChange = (index, value, questionNumber) => {
        setOpenEndedQuestions((prevQuestions) =>
            prevQuestions.map((q) =>
                q.number === questionNumber ? { ...q, correctAnswer: value } : q
            )
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate inputs
        if (!testTitle || !testCode || !deadline) {
            toast.error("Iltimos, barcha ma'lumotlarni to'ldiring");
            return;
        }

        // Check if all multiple choice questions have correct answers
        const unansweredQuestions = questions.filter((q) => !q.correctAnswer);
        if (unansweredQuestions.length > 0) {
            toast.error(
                `${unansweredQuestions.length} ta test savolining to'g'ri javobini belgilamadingiz`
            );
            return;
        }

        // Check if all open-ended questions have correct answers
        const unansweredOpenEnded = openEndedQuestions.filter((q) => !q.correctAnswer || q.correctAnswer.trim() === "");
        if (unansweredOpenEnded.length > 0) {
            toast.error(
                `${unansweredOpenEnded.length} ta yozma savolning to'g'ri javobini kiritmadingiz`
            );
            return;
        }

        // Prepare data for submission
        const allQuestions = [
            ...questions.map((q) => ({
                question_number: q.number,
                correct_answer: q.correctAnswer,
                turi: "Variantli"
            })),
            ...openEndedQuestions.map((q) => ({
                question_number: q.number,
                correct_answer: q.correctAnswer,
                turi: "Yozmali"
            }))
        ];

        const testData = {
            title: testTitle,
            code: testCode,
            deadline: deadline,
            questions: allQuestions,
        };

        console.log("Test data:", testData);

        // TODO: Send to backend
        fetch(`${import.meta.env.VITE_BASE_URL}/rash-test-create/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(testData),
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || "Xatolik yuz berdi");
                }
                return res.json();
            })
            .then((data) => {
                toast.success("Test muvaffaqiyatli yaratildi!");
                navigate("/tasdiqlash-kodi");
            })
            .catch((err) => {
                console.error(err);
                toast.error(err.message || "Test yaratishda xatolik");
            });
    };

    return (
        <div className="min-h-screen bg-[#313e51] py-8">
            <div className="px-5 md:max-w-[900px] md:w-full md:mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate("/tasdiqlash-kodi")}
                        className="text-white hover:text-blue-400 transition-colors"
                    >
                        <FaArrowLeftLong size={24} />
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#abc1e1]">
                        Test yaratish
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Test Metadata */}
                    <div className="bg-[#3b4d66] rounded-lg p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            Test ma'lumotlari
                        </h2>

                        {/* Title Input */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="title" className="text-white font-medium">
                                Test nomi:
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={testTitle}
                                onChange={(e) => setTestTitle(e.target.value)}
                                className="border border-gray-400 rounded p-2.5 text-white bg-[#313e51] outline-none focus:border-blue-500"
                                placeholder="Test nomini kiriting..."
                                required
                            />
                        </div>

                        {/* Code Input */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="code" className="text-white font-medium">
                                Test kodi:
                            </label>
                            <input
                                id="code"
                                type="text"
                                value={testCode}
                                onChange={(e) => setTestCode(e.target.value)}
                                className="border border-gray-400 rounded p-2.5 text-white bg-[#313e51] outline-none focus:border-blue-500"
                                placeholder="Test kodini kiriting..."
                                required
                            />
                        </div>

                        {/* Deadline Input */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="deadline" className="text-white font-medium">
                                Muddati:
                            </label>
                            <input
                                id="deadline"
                                type="datetime-local"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="border border-gray-400 rounded p-2.5 text-white bg-[#313e51] outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Questions Section */}
                    <div className="bg-[#3b4d66] rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            Savollar (1-35)
                        </h2>
                        <p className="text-gray-400 mb-4 text-sm">
                            Har bir savol uchun to'g'ri javobni belgilang
                        </p>

                        <div className="space-y-3">
                            {questions.map((question) => {
                                // Questions 33-35 have 6 options
                                const has6Options = question.number >= 33 && question.number <= 35;
                                const options = has6Options
                                    ? ["A", "B", "C", "D", "E", "F"]
                                    : ["A", "B", "C", "D"];

                                return (
                                    <div
                                        key={question.id}
                                        className="bg-[#313e51] rounded-lg p-3 md:p-4 border-b-2 border-gray-600"
                                    >
                                        <div className="flex items-center justify-between gap-2 md:gap-3">
                                            <span className="text-sm md:text-xl font-bold px-3 md:px-4 py-1 bg-[#5e7a9e] rounded text-white whitespace-nowrap flex-shrink-0">
                                                {question.number}.
                                            </span>
                                            <div className="flex gap-4">
                                                {options.map((option) => (
                                                    <label
                                                        key={option}
                                                        className="test-label group flex justify-center items-center cursor-pointer"
                                                    >
                                                        <div
                                                            className={`test-letter text-center text-[13px] md:text-[16px] font-bold ${question.correctAnswer === option
                                                                ? "bg-green-500 text-white"
                                                                : "bg-gray-300"
                                                                } px-2 py-2 md:px-3 md:py-3 rounded group-hover:text-green-500 text-gray-500 w-[40px] md:w-[50px]`}
                                                        >
                                                            {option}
                                                        </div>
                                                        <input
                                                            type="radio"
                                                            name={`question-${question.number}`}
                                                            onChange={() =>
                                                                handleAnswerChange(question.number, option)
                                                            }
                                                            className="hidden"
                                                        />
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Open-Ended Questions Section (36a-45b) */}
                    <div className="bg-[#3b4d66] rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                            <FaEdit className="text-xl" /> Yozma javoblar (36a-45b)
                        </h2>
                        <p className="text-gray-400 mb-4 text-sm">
                            Har bir savol uchun to'g'ri javobni kiriting
                        </p>

                        <div className="space-y-3">
                            {openEndedQuestions.map((question, index) => (
                                <MilliyQuestionItem
                                    key={question.number}
                                    index={index}
                                    value={question.correctAnswer}
                                    onChange={handleOpenEndedChange}
                                    savolRaqami={question.number}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center pb-10">
                        <button
                            type="submit"
                            className="btn btn-success text-white text-lg px-12 py-3 rounded-lg hover:scale-105 transition-transform"
                        >
                            Testni saqlash
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TestYaratish;
