import { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import { FiUser, FiLogOut, FiMenu, FiX, FiBookOpen, FiAward } from "react-icons/fi";

function HomeNavbar() {
  const { userData, setUserData } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleLogout() {
    setUserData(null);
    setOpen(false);
    navigate("/");
  }

  const navLinks = [
    { to: "#about", label: "Ustoz" },
    { to: "#services", label: "Xizmatlar" },
    { to: "#features", label: "Imkoniyatlar" },
    { to: "#testimonials", label: "Fikrlar" },
    { to: "#faq", label: "Savollar" },
    { to: "#contact", label: "Bog'lanish" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/assets/logo-icon.svg" alt="logo" className="h-8 w-8" />
          <span className="font-bold text-slate-800 text-lg hidden sm:block">
            MatematikaPro
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.to}
              href={link.to}
              className="text-slate-600 hover:text-indigo-600 font-medium text-sm transition"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {userData ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 rounded-full pl-2 pr-3 py-1.5 transition"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm">
                  {(userData.first_name || userData.phone || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <span className="text-slate-700 text-sm font-medium hidden sm:block max-w-[120px] truncate">
                  {userData.first_name || userData.phone}
                </span>
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 overflow-hidden">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-400">Hisob</p>
                    <p className="text-sm font-medium text-slate-700 truncate">
                      {userData.phone}
                    </p>
                  </div>
                  <Link
                    to="/attestatsiya-testlari"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-sm text-slate-700"
                  >
                    <FiBookOpen /> Testlarim
                  </Link>
                  <Link
                    to="/reyting"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-sm text-slate-700"
                  >
                    <FiAward /> Top reyting
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-sm text-red-600"
                  >
                    <FiLogOut /> Chiqish
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium transition"
            >
              <FiUser />
              <span>Kirish</span>
            </Link>
          )}

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden p-2 text-slate-700"
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {navLinks.map((link) => (
              <a
                key={link.to}
                href={link.to}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export default HomeNavbar;
