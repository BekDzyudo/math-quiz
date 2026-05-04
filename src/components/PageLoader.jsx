/**
 * MATEMATIKA PRO — brend loader komponenti
 * Ishlatiish: <PageLoader /> yoki <PageLoader text="Savollar yuklanmoqda..." />
 */
function PageLoader({ text = "Yuklanmoqda..." }) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[40vh] gap-6 select-none">
      {/* Logo + spinner */}
      <div className="relative flex items-center justify-center">
        {/* Aylanuvchi halqa */}
        <svg
          className="animate-spin text-indigo-500"
          style={{ width: 64, height: 64 }}
          viewBox="0 0 64 64"
          fill="none"
        >
          <circle
            cx="32" cy="32" r="28"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="100 60"
            opacity="0.25"
          />
          <circle
            cx="32" cy="32" r="28"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="40 120"
            className="text-indigo-600"
          />
        </svg>
        {/* Logo icon ichida */}
        <img
          src="/assets/logo-icon.svg"
          alt="logo"
          className="absolute w-7 h-7 opacity-80"
        />
      </div>

      {/* Matn */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-slate-500 text-sm font-medium tracking-wide">{text}</p>
        {/* Pulsing dots */}
        <div className="flex gap-1 mt-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-indigo-400"
              style={{
                animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PageLoader;
