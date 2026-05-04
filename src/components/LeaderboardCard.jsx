import { useState, useEffect, useRef } from "react";
import { FaCrown } from "react-icons/fa6";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { HiOutlineTrophy } from "react-icons/hi2";
import { useGetFetch } from "../hooks/useGetFetch";

const MAX_AUTO_RETRIES = 3;

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "?";
}

const PODIUM_STYLES = {
  1: {
    ring: "ring-amber-400",
    badge: "bg-gradient-to-br from-amber-400 to-yellow-500",
    crown: "text-amber-400",
    label: "1-o'rin",
  },
  2: {
    ring: "ring-slate-300",
    badge: "bg-gradient-to-br from-slate-300 to-slate-400",
    crown: "text-slate-400",
    label: "2-o'rin",
  },
  3: {
    ring: "ring-orange-300",
    badge: "bg-gradient-to-br from-orange-300 to-orange-500",
    crown: "text-orange-400",
    label: "3-o'rin",
  },
};

function PodiumItem({ row, place }) {
  const s = PODIUM_STYLES[place];
  const heights = { 1: "md:h-28", 2: "md:h-20", 3: "md:h-16" };
  const order = { 1: "md:order-2", 2: "md:order-1", 3: "md:order-3" };
  return (
    <div
      className={`flex md:flex-col items-center gap-3 md:gap-2 ${order[place]} flex-1 min-w-0`}
    >
      <div className="relative shrink-0">
        {place === 1 && (
          <FaCrown className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xl ${s.crown}`} />
        )}
        <div
          className={`w-12 h-12 md:w-16 md:h-16 rounded-full ${s.badge} text-white font-bold text-base md:text-xl flex items-center justify-center ring-4 ${s.ring} ring-offset-2 ring-offset-white shadow`}
        >
          {getInitials(row.ism)}
        </div>
      </div>
      <div className="flex-1 min-w-0 text-left md:text-center">
        <p className="text-[11px] md:text-xs text-slate-500 font-medium">{s.label}</p>
        <p
          className="text-sm md:text-base font-semibold text-slate-800 truncate"
          title={row.ism}
        >
          {row.ism}
        </p>
        <p className="text-xs md:text-sm text-indigo-600 font-bold mt-0.5">
          {row.jami_ball} ball
          <span className="text-slate-400 font-normal ml-1">
            · {row.testlar_soni} test
          </span>
        </p>
      </div>
      <div
        className={`hidden md:block w-full ${heights[place]} bg-gradient-to-t from-indigo-50 to-transparent rounded-t-lg border-t-2 border-x border-indigo-200`}
      />
    </div>
  );
}

function LeaderboardCard({ userId, limit = 10, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const url = userId
    ? `${import.meta.env.VITE_BASE_URL}/leaderboard/?limit=${limit}&user_id=${userId}`
    : `${import.meta.env.VITE_BASE_URL}/leaderboard/?limit=${limit}`;
  const { data, isPending, error, refetch } = useGetFetch(url);

  const retryCountRef = useRef(0);
  const retryTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (data) {
      retryCountRef.current = 0;
      return;
    }
    if (error && !isPending && retryCountRef.current < MAX_AUTO_RETRIES) {
      const attempt = retryCountRef.current + 1;
      retryCountRef.current = attempt;
      const delay = 600 * attempt;
      retryTimerRef.current = setTimeout(() => refetch(), delay);
    }
  }, [error, data, isPending, refetch]);

  const isAutoRetrying =
    error && !data && retryCountRef.current < MAX_AUTO_RETRIES;

  if ((isPending && !data) || isAutoRetrying) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 animate-pulse">
        <div className="h-5 w-40 bg-slate-200 rounded mb-4" />
        <div className="h-24 bg-slate-100 rounded" />
      </div>
    );
  }
  if (error && !data) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3">
        <span className="text-sm text-slate-500">Top reyting yuklanmadi</span>
        <button
          onClick={refetch}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
        >
          Qayta urinish
        </button>
      </div>
    );
  }
  if (!data || !data.top || data.top.length === 0) return null;

  const top3 = data.top.slice(0, 3);
  const rest = data.top.slice(3);
  const visibleRest = expanded ? rest : rest.slice(0, 4);
  const meInTop = data.me && data.top.some((r) => r.user_id === data.me.user_id);

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-amber-50 border border-indigo-100 rounded-2xl shadow-sm p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <div className="flex items-center gap-2">
          <HiOutlineTrophy className="text-2xl text-amber-500" />
          <h2 className="text-base md:text-lg font-bold text-slate-800">
            Top reyting
          </h2>
        </div>
        <span className="text-xs text-slate-500 bg-white/70 px-2.5 py-1 rounded-full">
          {data.jami_ishtirokchi} ishtirokchi
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-2 mb-4">
        {top3.map((row) => (
          <PodiumItem key={row.user_id} row={row} place={row.rank} />
        ))}
      </div>

      {rest.length > 0 && (
        <div className="border-t border-indigo-100 pt-3 flex flex-col gap-1.5">
          {visibleRest.map((row) => {
            const isMe = data.me && row.user_id === data.me.user_id;
            return (
              <div
                key={row.user_id}
                className={`flex items-center gap-3 py-1.5 px-2 rounded-lg ${
                  isMe ? "bg-indigo-100/70" : "hover:bg-white/60"
                }`}
              >
                <span className="text-xs font-bold text-slate-400 w-6 text-center shrink-0">
                  #{row.rank}
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 text-xs font-semibold flex items-center justify-center shrink-0">
                  {getInitials(row.ism)}
                </div>
                <span
                  className="flex-1 text-sm text-slate-700 truncate"
                  title={row.ism}
                >
                  {row.ism}
                  {isMe && (
                    <span className="ml-1.5 text-[10px] text-indigo-600 font-semibold">
                      (Siz)
                    </span>
                  )}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  {row.testlar_soni} test
                </span>
                <span className="text-sm font-bold text-indigo-600 shrink-0">
                  {row.jami_ball}
                </span>
              </div>
            );
          })}

          {rest.length > 4 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-1 py-1.5"
            >
              {expanded ? (
                <>
                  Yopish <FiChevronUp />
                </>
              ) : (
                <>
                  Yana {rest.length - 4} ta <FiChevronDown />
                </>
              )}
            </button>
          )}
        </div>
      )}

      {data.me && !meInTop && (
        <div className="mt-3 pt-3 border-t border-indigo-100">
          <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-indigo-600 text-white">
            <span className="text-xs font-bold w-8 text-center shrink-0">
              #{data.me.rank}
            </span>
            <div className="w-8 h-8 rounded-full bg-white/20 text-white text-xs font-semibold flex items-center justify-center shrink-0">
              {getInitials(data.me.ism)}
            </div>
            <span className="flex-1 text-sm font-medium truncate">
              {data.me.ism} <span className="opacity-80 text-xs">(Siz)</span>
            </span>
            <span className="text-xs opacity-80 hidden sm:inline">
              {data.me.testlar_soni} test
            </span>
            <span className="text-sm font-bold shrink-0">
              {data.me.jami_ball}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaderboardCard;
