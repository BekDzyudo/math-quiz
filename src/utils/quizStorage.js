const KEY_PREFIX = "quiz_state_";

// Eski generic kalitlar: quizga bog'liq emas, faqat savedQuizId orqali ajratilgan edi.
// Boot paytida ularni tozalash bug'ga sabab bo'lgan (quiz-6 ga quiz-5 natijasi ta'sir qilardi).
const LEGACY_GENERIC_KEYS = [
  "answers",
  "selectOption",
  "showResult",
  "savedQuizId",
  "result",
  "remainingTime",
];

function keyFor(quizId) {
  return `${KEY_PREFIX}${quizId}`;
}

export function readQuizState(quizId) {
  if (quizId === undefined || quizId === null) return {};
  try {
    const raw = localStorage.getItem(keyFor(quizId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    }
    return migrateLegacyForQuiz(quizId);
  } catch {
    return {};
  }
}

// Faqat quiz-specific legacy kalitlar ko'chiriladi. Generic kalitlar allaqachon boot'da tozalangan.
function migrateLegacyForQuiz(quizId) {
  const migrated = {};
  try {
    const savedAnswersKey = `saved_answers_${quizId}`;
    const savedAnswersRaw = localStorage.getItem(savedAnswersKey);
    if (savedAnswersRaw) {
      const selectedAnswers = JSON.parse(savedAnswersRaw) || {};
      if (selectedAnswers && typeof selectedAnswers === "object") {
        migrated.selectedAnswers = selectedAnswers;
        migrated.selectOption = Object.keys(selectedAnswers).map(Number).filter(Boolean);
        migrated.answers = Object.entries(selectedAnswers).map(([id, ans]) => ({
          savol_id: Number(id),
          tanlangan_javob: ans,
        }));
      }
      localStorage.removeItem(savedAnswersKey);
    }
    const rtKey = `remainingTime_${quizId}`;
    const rt = localStorage.getItem(rtKey);
    if (rt) {
      const n = parseInt(rt, 10);
      if (Number.isFinite(n) && n > 0) migrated.remainingTime = n;
      localStorage.removeItem(rtKey);
    }
    if (Object.keys(migrated).length > 0) {
      localStorage.setItem(keyFor(quizId), JSON.stringify(migrated));
    }
  } catch {}
  return migrated;
}

export function writeQuizState(quizId, patch) {
  if (quizId === undefined || quizId === null) return;
  try {
    const current = readQuizState(quizId);
    const next = { ...current, ...patch };
    localStorage.setItem(keyFor(quizId), JSON.stringify(next));
  } catch {
    // storage quota yoki serializatsiya xatosi — jim o'tkazish
  }
}

export function clearQuizState(quizId) {
  if (quizId === undefined || quizId === null) return;
  try {
    localStorage.removeItem(keyFor(quizId));
  } catch {}
}

// Boot paytida bir marta: faqat generic kalitlarni tozalaydi (bug manbai).
// Quiz-specific legacy kalitlar (saved_answers_N, remainingTime_N) migrateLegacyForQuiz() ichida
// lazy tarzda ko'chiriladi — foydalanuvchi tegishli quizga kirganda.
export function clearLegacyGenericKeys() {
  try {
    LEGACY_GENERIC_KEYS.forEach((k) => localStorage.removeItem(k));
  } catch {}
}
