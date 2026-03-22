import Button from "../components/ui/Button";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Features from "../components/home/Features";
import LanguagesHoneycomb from "../components/home/LanguagesHoneycomb";

function SectionDivider({ label }) {
  return (
    <div className="relative flex items-center justify-center py-2">
      <div className="flex-1 h-px bg-linear-to-r from-transparent via-white/40 to-white/10" />

      {label ? (
        <span className="mx-4 px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest uppercase text-gray-400 border border-white/40 bg-slate-950 select-none">
          {label}
        </span>
      ) : (
        <div className="mx-3 flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-white/15" />
          <div className="w-1.5 h-1.5 rotate-45 bg-white/20" />
          <div className="w-1 h-1 rounded-full bg-white/15" />
        </div>
      )}

      <div className="flex-1 h-px bg-linear-to-l from-transparent via-white/40 to-white/10" />
    </div>
  );
}

export default function Home() {

  return (
    <div className="min-h-screen bg-slate-950">
      <main className="relative min-h-screen bg-slate-950">

        <section className="relative overflow-hidden pt-16 pb-12 sm:pt-20 sm:pb-16 md:pt-24 md:pb-20 bg-slate-950">
          <div
            className="pointer-events-none absolute inset-0 flex items-start justify-center"
            aria-hidden
          >
            <div className="w-150 h-100 rounded-full bg-purple-900/20 blur-[120px] translate-y-[-30%]" />
          </div>

          <div className="relative px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                className="inline-flex items-center rounded-full bg-gray-800 px-3 py-1 text-xs sm:text-sm text-white mb-4 sm:mb-6 border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 mr-1.5 sm:mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-500" />
                </span>
                The Future of Coding
              </motion.div>

              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-4 sm:mb-6 text-white px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Collaborate on code in{" "}
                <span className="relative whitespace-nowrap">
                  <span className="relative text-purple-400">real-time</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full hidden sm:block"
                    height="8"
                    viewBox="0 0 300 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 5.5C77.5 2.5 155 2.5 231.5 5.5C253 6.5 276 7.5 299 6"
                      stroke="url(#heroGrad)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
  <stop offset="0%" stopColor="#C084FC" />  
  <stop offset="100%" stopColor="#9333EA" /> 
</linearGradient>
                    </defs>
                  </svg>
                </span>
              </motion.h1>

              <motion.p
                className="text-sm sm:text-base md:text-lg text-gray-400 mb-8 sm:mb-10 max-w-2xl mx-auto px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                A powerful collaborative code editor that brings teams together.
                Write, execute, and share code seamlessly.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link to="/auth" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto flex items-center justify-center bg-gray-900 border border-white/20 text-white hover:bg-gray-800 hover:border-white/60 transition-all duration-300 group px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base"
                  >
                    Start Coding Now
                    <ChevronRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <SectionDivider label="Languages" />
        </div>

        {/* ── Languages ── */}
        <div className="pt-6 pb-4 sm:pt-4 sm:pb-6">
          <LanguagesHoneycomb />
        </div>

        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <SectionDivider label="Features" />
        </div>

        <div className="pt-6 pb-16 sm:pt-4 sm:pb-20 md:pb-24">
          <Features />
        </div>

      </main>

      <style jsx>{`
        @keyframes blob {
          0%   { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(30px, -50px) scale(1.1); }
          66%  { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}