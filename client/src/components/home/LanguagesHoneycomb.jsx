import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const LANGUAGES = [
  {
    id: 1,
    name: "Python 3",
    language: "python",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    id: 2,
    name: "JavaScript",
    language: "javascript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  {
    id: 3,
    name: "TypeScript",
    language: "typescript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  {
    id: 4,
    name: "Java",
    language: "java",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  },
  {
    id: 5,
    name: "C++",
    language: "c++",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  },
  {
    id: 6,
    name: "C",
    language: "c",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
  },
  {
    id: 7,
    name: "C#",
    language: "csharp",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
  },
  {
    id: 8,
    name: "Go",
    language: "go",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg",
  },
  {
    id: 9,
    name: "Rust",
    language: "rust",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg",
  },
  {
    id: 10,
    name: "Ruby",
    language: "ruby",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg",
  },
  {
    id: 11,
    name: "PHP",
    language: "php",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
  },
  {
    id: 12,
    name: "Swift",
    language: "swift",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
  },
  {
    id: 13,
    name: "Kotlin",
    language: "kotlin",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
  },
  {
    id: 14,
    name: "Bash",
    language: "bash",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-plain.svg",
  },
  {
    id: 15,
    name: "Lua",
    language: "lua",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/lua/lua-original.svg",
  },
  {
    id: 16,
    name: "Haskell",
    language: "haskell",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/haskell/haskell-original.svg",
  },
  {
    id: 17,
    name: "Scala",
    language: "scala",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg",
  },
  {
    id: 18,
    name: "Perl",
    language: "perl",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/perl/perl-original.svg",
  },
  {
    id: 19,
    name: "R",
    language: "rscript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg",
  },
  {
    id: 20,
    name: "Dart",
    language: "dart",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
  },
  {
    id: 21,
    name: "Elixir",
    language: "elixir",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elixir/elixir-original.svg",
  },
  {
    id: 22,
    name: "Groovy",
    language: "groovy",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/groovy/groovy-original.svg",
  },
  {
    id: 23,
    name: "Julia",
    language: "julia",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/julia/julia-original.svg",
  },
  {
    id: 24,
    name: "Pascal",
    language: "pascal",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/objectpascal/objectpascal-original.svg",
  },
  {
    id: 25,
    name: "SQLite",
    language: "sqlite3",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
  },
];

const CLIP = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

const BREAKPOINTS = [
  [1024, 8, 118], // desktop lg
  [768, 6, 108], // tablet
  [480, 4, 88], // mobile landscape
  [0, 3, 76], // mobile portrait
];

function getConfig(width) {
  for (const [minW, cols, hexW] of BREAKPOINTS) {
    if (width >= minW) return { cols, hexW };
  }
  return { cols: 3, hexW: 76 };
}

function HexCell({ lang, hexW, hexH }) {
  const [hovered, setHovered] = useState(false);
  const iconSize = Math.round(hexW * 0.42);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={lang.name}
      className="relative shrink-0 transition-all bg-gray-400/60 duration-200"
      style={{
        width: hexW,
        height: hexH,
        clipPath: CLIP,
        filter: hovered
          ? "drop-shadow(0 0 16px rgb(168 85 247 / 0.5))"
          : "drop-shadow(0 3px 8px rgb(0 0 0 / 0.55))",
        cursor: "default",
      }}
    >
      <div
        className="absolute flex items-center justify-center"
        style={{
          inset: 3,
          clipPath: CLIP,
          background: hovered ? "rgb(30 41 59)" : "rgb(15 23 42)",
          transition: "background 0.2s",
        }}
      >
        <img
          src={lang.icon}
          alt={lang.name}
          width={iconSize}
          height={iconSize}
          loading="lazy"
          className="object-contain transition-all duration-200"
          style={{
            transform: hovered ? "scale(1.12)" : "scale(1)",
            filter: hovered
              ? "drop-shadow(0 0 8px rgb(216 180 254 / 0.8))"
              : "none",
          }}
        />
      </div>
    </div>
  );
}

function HexRow({ items, offset, hexW, hexH, gap }) {
  return (
    <div
      className="flex flex-row"
      style={{
        gap,
        marginLeft: offset ? hexW / 2 + gap / 2 : 0,
      }}
    >
      {items.map((lang) => (
        <HexCell key={lang.id} lang={lang} hexW={hexW} hexH={hexH} />
      ))}
    </div>
  );
}

export default function LanguagesHoneycomb() {
  const [expanded, setExpanded] = useState(false);
  const [config, setConfig] = useState({ cols: 8, hexW: 118 });
  const containerRef = useRef(null);

  useEffect(() => {
    function update() {
      const width = containerRef.current?.offsetWidth ?? window.innerWidth;
      setConfig(getConfig(width));
    }
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const { cols, hexW } = config;
  const hexH = Math.round(hexW / 0.866);
  const gap = Math.round(hexW * 0.05);
  const overlap = Math.round(hexH * 0.25);

  const visibleLangs = expanded ? LANGUAGES : LANGUAGES.slice(0, cols * 2);
  const rows = [];
  for (let i = 0; i < visibleLangs.length; i += cols) {
    rows.push(visibleLangs.slice(i, i + cols));
  }

  return (
    <section id="languages" className="py-8 sm:py-12 md:py-16 text-white bg-slate-950">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      
        <div className="text-center mb-12 sm:mb-16">
          
          <motion.h2
            className="text-white text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4 px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Code in Any Language
          </motion.h2>

          <motion.p
            className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            25+ languages supported out of the box — from Python to Pascal, write and run without setup.
          </motion.p>
        </div>

        {/* Honeycomb */}
        <div
          ref={containerRef}
          className="flex flex-col items-center w-full py-4"
        >
          <div className="flex flex-col items-start gap-2">
            {rows.map((rowItems, rowIndex) => (
              <div
                key={rowIndex}
                style={{ marginTop: rowIndex === 0 ? 0 : -overlap }}
              >
                <HexRow
                  items={rowItems}
                  offset={rowIndex % 2 === 1}
                  hexW={hexW}
                  hexH={hexH}
                  gap={gap}
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-10 px-8 py-2.5 rounded-lg text-sm font-semibold tracking-widest uppercase text-white bg-gray-900 border border-white/20 hover:bg-gray-800 hover:border-white/60 transition-all duration-300 cursor-pointer"
          >
            {expanded ? "Show Less" : "See All"}
          </button>
        </div>
      </div>
    </section>
  );
}
