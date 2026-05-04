import { useContext } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { HiOutlineTrophy } from "react-icons/hi2";
import { GlobalContext } from "../context/GlobalContext";
import LeaderboardCard from "../components/LeaderboardCard";

function Reyting() {
  const { userData } = useContext(GlobalContext);

  return (
    <div className="md:max-w-[1000px] w-full px-3 md:px-5 md:mr-auto md:ml-auto pb-10">
      <div className="relative flex justify-center items-center py-5 md:py-10">
        <Link
          to="/"
          className="absolute left-0 text-slate-500 hover:text-indigo-600 transition flex items-center gap-2 text-sm md:text-base"
        >
          <FaArrowLeftLong /> <span className="hidden sm:inline">Orqaga</span>
        </Link>
        <div className="flex flex-col gap-1 md:gap-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <HiOutlineTrophy className="text-2xl md:text-3xl text-amber-500" />
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-slate-800">
              Top reyting
            </h1>
          </div>
          <p className="text-slate-500 text-sm sm:text-base md:text-lg">
            Eng yuqori ball to'plagan ishtirokchilar
          </p>
        </div>
      </div>

      <LeaderboardCard
        userId={userData?.user_id}
        limit={50}
        defaultExpanded={true}
      />
    </div>
  );
}

export default Reyting;
