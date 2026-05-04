import { Link } from "react-router-dom";
import { useContext } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import { HiOutlineTrophy } from "react-icons/hi2";
import { TbMathAvg } from "react-icons/tb";
import { MdOutlineStars } from "react-icons/md";
import { useGetFetch } from "../hooks/useGetFetch";
import { GlobalContext } from "../context/GlobalContext";
import PageLoader from "../components/PageLoader";

const TOIFA_COLORS = {
  "Oliy +70%": { bg: "bg-purple-100", text: "text-purple-700", bar: "bg-purple-500" },
  "Oliy":      { bg: "bg-emerald-100", text: "text-emerald-700", bar: "bg-emerald-500" },
  "1-Toifa":   { bg: "bg-blue-100", text: "text-blue-700", bar: "bg-blue-500" },
  "2-Toifa":   { bg: "bg-amber-100", text: "text-amber-700", bar: "bg-amber-500" },
  "O'tmagan":  { bg: "bg-red-50", text: "text-red-600", bar: "bg-red-400" },
};

const SIZNING_TOIFA_COLORS = {
  "Oliy +70%": "bg-purple-600 text-white",
  "Oliy":      "bg-emerald-600 text-white",
  "1-Toifa":   "bg-blue-600 text-white",
  "2-Toifa":   "bg-amber-500 text-white",
  "—":         "bg-slate-300 text-slate-700",
};

function ToifalarBar({ taqsimot }) {
  return (
    <div className="mt-3 border-t border-slate-100 pt-3">
      <p className="text-xs text-slate-500 font-medium mb-2">Toifalar taqsimoti</p>
      <div className="flex flex-col gap-1.5">
        {taqsimot.map((t) => {
          const color = TOIFA_COLORS[t.toifa] || TOIFA_COLORS["O'tmagan"];
          return (
            <div key={t.toifa} className="flex items-center gap-2">
              <span className={`text-xs font-medium w-20 shrink-0 ${color.text}`}>
                {t.toifa}
              </span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${color.bar} transition-all`}
                  style={{ width: `${t.foiz}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 w-14 text-right shrink-0">
                {t.soni} kishi · {t.foiz}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AttestatsiyaTestlari() {
  const { userData } = useContext(GlobalContext);
  const {
    data: optionTest,
    isPending,
    error,
    refetch,
  } = useGetFetch(
    `${import.meta.env.VITE_BASE_URL}/test-list-exclude-active-intihon/${userData.user_id}/`
  );

  return (
    <div className="md:max-w-[1000px] w-full px-3 md:px-5 md:mr-auto md:ml-auto">
      <div className="relative flex justify-center items-center py-5 md:py-10">
        <Link
          to="/"
          className="absolute left-0 text-slate-500 hover:text-indigo-600 transition flex items-center gap-2 text-sm md:text-base"
        >
          <FaArrowLeftLong /> <span className="hidden sm:inline">Orqaga</span>
        </Link>
        <div className="flex flex-col gap-1 md:gap-2 text-center">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-slate-800">
            Attestatsiya testlari
          </h1>
          <p className="text-slate-500 text-sm sm:text-base md:text-lg">
            Test natijalaringiz va mavjud testlar
          </p>
        </div>
      </div>

      {isPending && <PageLoader text="Testlar yuklanmoqda..." />}
      {error && !isPending && (
        <div className="flex flex-col items-center gap-3 py-10">
          <p className="text-center text-red-400 text-base">{error}</p>
          <button onClick={refetch} className="btn btn-sm btn-outline btn-info">
            Qaytadan urinish
          </button>
        </div>
      )}

      <div className="md:max-w-[800px] lg:max-w-[1000px] md:mr-auto md:ml-auto flex flex-col gap-3 md:gap-4">
        {optionTest &&
          optionTest
            .slice()
            .reverse()
            .map((item, index) => {
              const isActive = index === 0;
              const isFinished = item.is_finished === true;
              const hasParticipants = item.qatnashchilar_soni > 0;

              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-shadow px-4 md:px-6 py-4 md:py-5"
                >
                  <div className="flex flex-col md:flex-row gap-3 md:gap-5 items-center">
                    <IoMdCheckmarkCircleOutline
                      className={`text-2xl md:text-3xl flex-shrink-0 ${
                        isActive
                          ? "text-emerald-500"
                          : isFinished
                          ? "text-indigo-400"
                          : "text-amber-500"
                      }`}
                    />

                    <div className="text-center md:text-left flex-1 min-w-0">
                      <h3 className="text-slate-800 text-lg sm:text-xl md:text-2xl font-semibold">
                        {item.name}
                      </h3>

                      {hasParticipants && (
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                          <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 rounded-full px-2.5 py-1">
                            <FiUsers className="text-slate-500" />
                            {item.qatnashchilar_soni} ishtirokchi
                          </span>

                          {item.ortacha_ball !== null && (
                            <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 rounded-full px-2.5 py-1">
                              <TbMathAvg className="text-blue-500" />
                              O'rtacha: {item.ortacha_ball}
                            </span>
                          )}

                          {item.eng_yuqori_ball && (
                            <span
                              className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 rounded-full px-2.5 py-1"
                              title={item.eng_yuqori_ball.ism}
                            >
                              <HiOutlineTrophy className="text-amber-500" />
                              Rekord: {item.eng_yuqori_ball.ball} —{" "}
                              {item.eng_yuqori_ball.ism}
                            </span>
                          )}

                          {isFinished && item.sizning_toifangiz && (
                            <span
                              className={`inline-flex items-center gap-1 text-xs rounded-full px-2.5 py-1 font-medium ${
                                SIZNING_TOIFA_COLORS[item.sizning_toifangiz] ||
                                SIZNING_TOIFA_COLORS["—"]
                              }`}
                            >
                              <MdOutlineStars />
                              {item.sizning_toifangiz}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-center">
                      <h3 className="text-slate-800 text-xl sm:text-2xl md:text-3xl font-bold">
                        {item.natija}/{item.jami_savollar}
                      </h3>
                      <p className="text-slate-400 text-sm">ball</p>
                    </div>

                    {isActive ? (
                      <Link
                        to={`/quiz/${item.intihon_id}?finished=${item.is_finished}&result=${item.natija}`}
                        className="btn btn-sm md:btn-md bg-emerald-500 text-white border-0 w-full md:w-auto md:min-w-[135px] text-sm md:text-base hover:bg-emerald-600"
                      >
                        Aktiv test
                      </Link>
                    ) : isFinished ? (
                      <Link
                        to={`/quiz/${item.intihon_id}?finished=${item.is_finished}&result=${item.natija}`}
                        className="btn btn-sm md:btn-md btn-info text-white border-0 w-full md:w-auto md:min-w-[135px] text-sm md:text-base"
                      >
                        Ko'rish
                      </Link>
                    ) : (
                      <Link
                        to={`/quiz/${item.intihon_id}?finished=${item.is_finished}&result=${item.natija}`}
                        className="btn btn-sm md:btn-md bg-amber-500 text-white border-0 w-full md:w-auto md:min-w-[135px] text-sm md:text-base hover:bg-amber-600"
                      >
                        Testni boshlash
                      </Link>
                    )}
                  </div>

                  {item.toifalar_taqsimoti && item.toifalar_taqsimoti.length > 0 && (
                    <ToifalarBar taqsimot={item.toifalar_taqsimoti} />
                  )}
                </div>
              );
            })}
      </div>
    </div>
  );
}

export default AttestatsiyaTestlari;
