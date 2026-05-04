import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiAward,
  FiUsers,
  FiBookOpen,
  FiCheckCircle,
  FiVideo,
  FiBarChart2,
  FiFileText,
  FiZap,
  FiPhone,
  FiSend,
  FiMessageCircle,
  FiChevronDown,
  FiChevronRight,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";
import { FaTelegramPlane } from "react-icons/fa";
import HomeNavbar from "../components/HomeNavbar";

const stats = [
  { value: "9+", label: "Yillik faoliyat", icon: <FiAward /> },
  { value: "5000+", label: "O'quvchi va ustozlar", icon: <FiUsers /> },
  { value: "36 000+", label: "Telegram obunachi", icon: <FaTelegramPlane /> },
  { value: "100%", label: "DTM 30/30 natija", icon: <FiTrendingUp /> },
];

const achievements = [
  { icon: "🏆", title: "Vazir Jamg'armasi sohibi" },
  { icon: "📜", title: "Milliy sertifikat A+" },
  { icon: "🎓", title: "GMAT 44/51" },
  { icon: "📊", title: "Toifa Oliy — 88/100" },
  { icon: "🧮", title: "Matematika 35/35" },
  { icon: "🥇", title: "DTM 30/30 (2024)" },
];

const services = [
  {
    icon: <FiAward className="text-3xl" />,
    title: "Attestatsiya tayyorlovi",
    desc: "1-Toifa, 2-Toifa va Oliy toifaga muvaffaqiyatli tayyorlanish.",
    color: "from-indigo-500 to-purple-600",
  },
  {
    icon: <FiBookOpen className="text-3xl" />,
    title: "Milliy sertifikat",
    desc: "A, A+ va B daraja olish uchun professional dasturlar.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: <FiZap className="text-3xl" />,
    title: "Online testlar",
    desc: "Telegram bot va Web App orqali bepul mashq + Rasch IRT tahlili.",
    color: "from-orange-500 to-pink-600",
  },
];

const features = [
  { icon: <FiCheckCircle />, title: "Online testlar", desc: "Web App orqali har joyda" },
  { icon: <FiFileText />, title: "PDF natija", desc: "Avtomatik baholash + eksport" },
  { icon: <FiBarChart2 />, title: "Toifa tahlili", desc: "Oliy / 1-Toifa / 2-Toifa" },
  { icon: <FiTrendingUp />, title: "Reyting tizimi", desc: "Boshqa o'quvchilar bilan" },
  { icon: <FiVideo />, title: "Video javoblar", desc: "Har bir savol uchun" },
  { icon: <FaTelegramPlane />, title: "2 ta Telegram bot", desc: "Milliy Quiz + Rash Test" },
];

const testimonials = [
  {
    name: "Dilfuza Karimova",
    role: "Matematika o'qituvchisi",
    text: "Fayziev ustoz tayyorlovi orqali Oliy toifani 89 ball bilan oldim. Testlar va video javoblar juda samarali!",
    rating: 5,
  },
  {
    name: "Bobur Rahmonov",
    role: "Maktab o'quvchisi",
    text: "Milliy sertifikat A+ olish uchun bu platformadan 3 oy davomida foydalandim. Natija a'lo!",
    rating: 5,
  },
  {
    name: "Nigora Yusupova",
    role: "1-Toifa ustoz",
    text: "9 yil ishlaganman, lekin attestatsiyaga shu yerda tayyorlangach 1-Toifani osongina oldim. Rahmat!",
    rating: 5,
  },
  {
    name: "Sherzod Aliyev",
    role: "Matematika ustozi",
    text: "Online bot orqali har kuni 10 ta savol yechib turaman. Toifa imtihoniga ishonchli kirdim.",
    rating: 5,
  },
];

const faqs = [
  {
    q: "Attestatsiyaga necha vaqtda tayyorlanish mumkin?",
    a: "Bilim darajasi va maqsadingizga qarab odatda 2-4 oy yetarli. Kunlik 1-2 soat mashq + haftada 2 marta test yechish bilan Oliy toifaga tayyor bo'lasiz.",
  },
  {
    q: "Toifa olish uchun necha ball kerak?",
    a: "≥80 ball — Oliy, ≥70 — 1-Toifa, ≥60 — 2-Toifa. Bizda har bir test natijasi avtomatik toifa bo'yicha hisoblab beriladi.",
  },
  {
    q: "Online dars qanday o'tadi?",
    a: "Telegram bot orqali test yechasiz, natijangiz va batafsil tahlilni darhol olasiz. Har bir savolga video javob ham mavjud.",
  },
  {
    q: "Botdan qanday foydalanish mumkin?",
    a: "Telegram'da @MilliyQuizBot yoki @RashTestBot ga kirib, ro'yxatdan o'tasiz. Test kodini kiritib, savollarni yechishni boshlaysiz.",
  },
  {
    q: "Platforma to'lovlimi?",
    a: "Online testlar va bot bepul. Individual yoki guruh kurslar uchun bog'lanish: +998 93 621 08 09.",
  },
];

function Section({ id, children, className = "" }) {
  return (
    <section id={id} className={`py-16 md:py-24 px-4 md:px-6 ${className}`}>
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center mb-12 md:mb-16">
      {eyebrow && (
        <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full mb-4 uppercase tracking-wider">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function Home() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="bg-slate-50 min-h-screen">
      <HomeNavbar />

      {/* HERO */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-10" />
        <div className="absolute top-20 -left-20 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-40 -z-10" />
        <div className="absolute bottom-0 -right-20 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-40 -z-10" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-indigo-200 text-indigo-600 text-xs font-semibold rounded-full mb-6 shadow-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              5000+ o'quvchi tanlagan platforma
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight mb-6">
              Matematikadan{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Attestatsiya
              </span>{" "}
              va{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Milliy sertifikat
              </span>
              ga professional tayyorlov
            </h1>
            <p className="text-slate-600 text-lg md:text-xl mb-8 leading-relaxed">
              9 yillik tajriba, IRT modeli asosidagi onlayn testlar va Telegram
              orqali bepul mashqlar bilan toifa imtihoniga ishonchli tayyorlaning.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3.5 rounded-full font-semibold text-base shadow-lg shadow-indigo-200 transition"
              >
                Testni boshlash <FiChevronRight />
              </Link>
              <a
                href="https://t.me/fayziev_attestatsiya"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-7 py-3.5 rounded-full font-semibold text-base transition"
              >
                <FaTelegramPlane className="text-sky-500" /> Telegram kanal
              </a>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500" /> Bepul mashq
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500" /> PDF natija
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500" /> Video javoblar
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative bg-white rounded-3xl shadow-2xl shadow-indigo-100 p-6 md:p-8 border border-slate-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                  AF
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">A. Fayziev</h3>
                  <p className="text-slate-500 text-sm">Bosh ustoz</p>
                  <p className="text-indigo-600 text-sm font-medium mt-1">
                    @A_Fayziev
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {achievements.slice(0, 6).map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5"
                  >
                    <span className="text-xl">{a.icon}</span>
                    <span className="text-xs font-medium text-slate-700">
                      {a.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg rotate-6">
              ⭐ Eng yaxshi ustoz
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <Section className="bg-white">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-2xl p-6 text-center hover:shadow-lg transition"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl mb-3">
                {s.icon}
              </div>
              <div className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-1">
                {s.value}
              </div>
              <div className="text-slate-500 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ABOUT */}
      <Section id="about">
        <SectionTitle
          eyebrow="Tanishuv"
          title="Bosh ustoz haqida"
          subtitle="9 yillik tajribali, sertifikatlangan matematika ustozi"
        />
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-2">
            <div className="aspect-square max-w-sm mx-auto rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-2xl">
              <div className="w-full h-full rounded-3xl bg-white flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl md:text-6xl font-bold mb-4">
                    AF
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    A. Fayziev
                  </h3>
                  <p className="text-slate-500">Bosh ustoz</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              <span className="font-bold text-slate-800">Fayziev</span> ustoz —
              matematika fanidan 9 yillik faoliyatga ega, attestatsiya va
              Milliy sertifikatga tayyorlov bo'yicha mamlakatdagi yetakchi
              mutaxassislardan biri. 5000+ dan ortiq o'quvchi va ustozlar uning
              tayyorlovi orqali Oliy toifa va A+ sertifikat olishgan.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {achievements.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-indigo-300 hover:shadow-md transition"
                >
                  <span className="text-2xl">{a.icon}</span>
                  <span className="font-semibold text-slate-700 text-sm">
                    {a.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* SERVICES */}
      <Section id="services" className="bg-white">
        <SectionTitle
          eyebrow="Yo'nalishlar"
          title="Xizmatlar"
          subtitle="Sizning maqsadingizga mos tayyorlov yo'nalishini tanlang"
        />
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div
              key={i}
              className="group relative bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-2xl hover:border-transparent transition-all hover:-translate-y-1"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-5 shadow-lg`}
              >
                {s.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                {s.title}
              </h3>
              <p className="text-slate-500 leading-relaxed">{s.desc}</p>
              <div className="mt-5 flex items-center text-indigo-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition">
                Batafsil <FiChevronRight className="ml-1" />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* FEATURES */}
      <Section id="features">
        <SectionTitle
          eyebrow="Imkoniyatlar"
          title="Platforma nima beradi?"
          subtitle="Bir tizimda barcha kerakli vositalar"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-4 bg-white rounded-2xl p-6 border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center text-xl flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">{f.title}</h4>
                <p className="text-slate-500 text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section id="testimonials" className="bg-white">
        <SectionTitle
          eyebrow="Fikrlar"
          title="Ustoz va o'quvchilar fikrlari"
          subtitle="Bizning tayyorlov orqali natijaga erishgan insonlar"
        />
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-2xl p-7 hover:shadow-lg transition"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <FiStar
                    key={j}
                    className="text-amber-400 fill-amber-400"
                    fill="currentColor"
                  />
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed mb-5 italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-800">{t.name}</div>
                  <div className="text-sm text-slate-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* TELEGRAM */}
      <Section>
        <div className="relative bg-gradient-to-br from-sky-500 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-14 overflow-hidden text-white">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <FaTelegramPlane className="text-5xl mb-5 opacity-90" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                36 000+ obunachi bilan eng yirik attestatsiya kanali
              </h2>
              <p className="text-white/90 text-lg mb-6 leading-relaxed">
                Har kuni yangi savollar, video tahlillar va attestatsiya
                yangiliklari. Telegram kanalimizga obuna bo'ling va birinchi
                bo'lib bilib oling.
              </p>
              <a
                href="https://t.me/fayziev_attestatsiya"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-indigo-600 hover:bg-slate-100 px-7 py-3.5 rounded-full font-bold transition"
              >
                <FaTelegramPlane /> Kanalga obuna bo'lish
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20">
                <div className="text-3xl font-extrabold mb-1">36K+</div>
                <div className="text-sm opacity-90">Obunachi</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20">
                <div className="text-3xl font-extrabold mb-1">Har kuni</div>
                <div className="text-sm opacity-90">Yangi savollar</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20">
                <div className="text-3xl font-extrabold mb-1">2 ta</div>
                <div className="text-sm opacity-90">Telegram bot</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20">
                <div className="text-3xl font-extrabold mb-1">Bepul</div>
                <div className="text-sm opacity-90">Mashq va testlar</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" className="bg-white">
        <SectionTitle
          eyebrow="FAQ"
          title="Tez-tez beriladigan savollar"
          subtitle="Eng ko'p so'raladigan savollarga javoblar"
        />
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((f, i) => (
            <div
              key={i}
              className={`border rounded-2xl overflow-hidden transition ${
                openFaq === i
                  ? "border-indigo-300 shadow-md"
                  : "border-slate-200"
              }`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-4 md:py-5 text-left hover:bg-slate-50 transition"
              >
                <span className="font-semibold text-slate-800 text-base md:text-lg">
                  {f.q}
                </span>
                <FiChevronDown
                  className={`text-slate-400 text-xl flex-shrink-0 transition ${
                    openFaq === i ? "rotate-180 text-indigo-600" : ""
                  }`}
                />
              </button>
              {openFaq === i && (
                <div className="px-5 md:px-6 pb-5 text-slate-600 leading-relaxed">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="contact">
        <SectionTitle
          eyebrow="Bog'lanish"
          title="Biz bilan aloqada bo'ling"
          subtitle="Savol yoki takliflaringiz bo'lsa, har doim aloqaga chiqing"
        />
        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          <a
            href="tel:+998936210809"
            className="group bg-white border border-slate-200 rounded-2xl p-7 text-center hover:border-indigo-400 hover:shadow-xl transition"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
              <FiPhone />
            </div>
            <h4 className="font-bold text-slate-800 mb-1">Telefon</h4>
            <p className="text-slate-500 text-sm mb-2">Bosh ustoz bilan</p>
            <p className="text-indigo-600 font-semibold">+998 93 621 08 09</p>
          </a>
          <a
            href="https://t.me/A_Fayziev"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white border border-slate-200 rounded-2xl p-7 text-center hover:border-indigo-400 hover:shadow-xl transition"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
              <FiMessageCircle />
            </div>
            <h4 className="font-bold text-slate-800 mb-1">Telegram</h4>
            <p className="text-slate-500 text-sm mb-2">Shaxsiy xabar</p>
            <p className="text-indigo-600 font-semibold">@A_Fayziev</p>
          </a>
          <a
            href="https://t.me/fayziev_attestatsiya"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white border border-slate-200 rounded-2xl p-7 text-center hover:border-indigo-400 hover:shadow-xl transition"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
              <FiSend />
            </div>
            <h4 className="font-bold text-slate-800 mb-1">Telegram kanal</h4>
            <p className="text-slate-500 text-sm mb-2">36 000+ obunachi</p>
            <p className="text-indigo-600 font-semibold">
              t.me/fayziev_attestatsiya
            </p>
          </a>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/assets/logo-icon.svg"
                  alt="logo"
                  className="h-8 w-8"
                />
                <span className="font-bold text-white text-xl">
                  MatematikaPro
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-4 max-w-md">
                Matematikadan attestatsiya va Milliy sertifikatga professional
                tayyorlov platformasi. 9 yillik tajriba, 5000+ o'quvchi.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://t.me/fayziev_attestatsiya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-sky-500 flex items-center justify-center transition"
                >
                  <FaTelegramPlane />
                </a>
                <a
                  href="tel:+998936210809"
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-emerald-500 flex items-center justify-center transition"
                >
                  <FiPhone />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Tezkor havolalar</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#about" className="hover:text-white transition">
                    Ustoz haqida
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white transition">
                    Xizmatlar
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="hover:text-white transition">
                    Fikrlar
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Hisob</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/login" className="hover:text-white transition">
                    Kirish
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-white transition">
                    Ro'yxatdan o'tish
                  </Link>
                </li>
                <li>
                  <Link
                    to="/attestatsiya-testlari"
                    className="hover:text-white transition"
                  >
                    Testlar
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-500">
            <p>© 2026 MatematikaPro. Barcha huquqlar himoyalangan.</p>
            <p>
              Yaratuvchi: <span className="text-slate-300">A. Fayziev</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
