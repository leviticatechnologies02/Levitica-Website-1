import { Link } from "react-router-dom";
import LoginForm from "./LoginForm";
import { FaGraduationCap, FaLaptopCode, FaBriefcase } from "react-icons/fa";

const LoginPage = () => {
  return (
    <section className="pt-24 pb-24 bg-slate-50 dark:bg-darkmode min-h-[90vh] flex items-center">
      <div className="container mx-auto max-w-6xl px-4">
        {/* CARD CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-semidark border border-slate-100 dark:border-dark_border/20">

          {/* LEFT SIDE: BRAND CONTENT */}
          <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-12 text-white overflow-hidden"
            style={{ background: "linear-gradient(135deg, #090d16 0%, #1e3a8a 70%, #1d4ed8 100%)" }}>

            {/* Background elements */}
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #38bdf8, transparent)" }} />
            <div className="absolute -bottom-24 -right-12 w-80 h-80 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] opacity-70" />

            {/* Top Brand Logo & Tagline */}
            <div className="relative z-10 flex items-center gap-4">
              <div className=" rounded-2xl border-2 border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center w-16 h-16 shadow-lg">
                <img src="/img/leviticalogo.png" alt="Levitica Logo" className="w-full h-full rounded-xl" />
              </div>
              <div>
                <span className="block font-extrabold text-lg tracking-wide text-white leading-tight">Levitica</span>
                <span className="block text-xs text-[#38bdf8] tracking-widest uppercase font-extrabold mt-0.5">Academy</span>
              </div>
            </div>

            {/* Middle Feature List */}
            <div className="relative z-10 my-auto py-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-snug mb-6">
                Learn, Build, and Elevate Your Tech Career.
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 bg-white/10 rounded-2xl flex-shrink-0 h-12 w-12 flex items-center justify-center border border-white/10 shadow-sm">
                    <FaGraduationCap className="text-[#38bdf8]" size={22} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-100">Live LMS & Courses</h4>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed font-normal">Interactive live training sessions, recorded lecture access, and comprehensive test prep modules.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2.5 bg-white/10 rounded-2xl flex-shrink-0 h-12 w-12 flex items-center justify-center border border-white/10 shadow-sm">
                    <FaLaptopCode className="text-[#38bdf8]" size={22} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-100">Online & Offline Internships</h4>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed font-normal">Real project deliverables, corporate workspace exposure, and mentorship for colleges.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2.5 bg-white/10 rounded-2xl flex-shrink-0 h-12 w-12 flex items-center justify-center border border-white/10 shadow-sm">
                    <FaBriefcase className="text-[#38bdf8]" size={22} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-100">Placement Support</h4>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed font-normal">Exclusive access to hiring partners, portfolio evaluations, and corporate job match alignments.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Quote */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span>© {new Date().getFullYear()} Levitica Academy</span>
              <div className="flex gap-2 items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Academy portal active</span>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: LOGIN FORM */}
          <div className="col-span-1 lg:col-span-7 flex flex-col justify-center px-6 py-12 sm:px-12 md:px-16 lg:px-20 bg-white dark:bg-semidark">
            {/* Small mobile logo */}
            <div className="lg:hidden mb-8 flex justify-center">
              <div className="inline-flex items-center gap-2 p-2 px-3.5 rounded-xl border border-slate-100 dark:border-dark_border/20 bg-slate-50 dark:bg-darklight">
                <img src="/img/leviticalogo.png" alt="Levitica Logo" className="h-6 w-auto object-contain rounded-md" />
                <span className="font-bold text-sm text-midnight_text dark:text-white">Levitica</span>
              </div>
            </div>

            {/* TITLE */}
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-midnight_text dark:text-white">
                Welcome Back
              </h2>
              <p className="text-gray-500 dark:text-slate-400 mt-2 text-sm md:text-base">
                Sign in to your account to access your workspace dashboard.
              </p>
            </div>

            {/* FORM */}
            <LoginForm />

            {/* FOOTER */}
            <div className="mt-8 text-center text-sm text-gray-500 dark:text-slate-400">
              Not a member yet?{" "}
              <Link
                to="/sign-up"
                className="text-primary dark:text-cyan font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LoginPage;