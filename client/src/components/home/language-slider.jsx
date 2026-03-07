import { motion } from "framer-motion"
import { 
  FileCode2, Coffee, Hash, Server, Code2, Terminal, 
  Box, Cpu, Globe, Wrench 
} from "lucide-react"
import { useRef, useEffect, useState } from "react"

const LanguageSlider = () => {
  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(0)

  const languages = [
    { name: "JavaScript", icon: "JS", color: "from-yellow-400 to-yellow-500" },
    { name: "Python", icon: "PY", color: "from-blue-400 to-blue-500" },
    { name: "Java", icon: "JV", color: "from-orange-400 to-red-500" },
    { name: "C++", icon: "C++", color: "from-blue-500 to-indigo-500" },
    { name: "TypeScript", icon: "TS", color: "from-blue-400 to-cyan-500" },
    { name: "PHP", icon: "PHP", color: "from-purple-400 to-purple-500" },
    { name: "Ruby", icon: "RB", color: "from-red-400 to-red-500" },
    { name: "Go", icon: "GO", color: "from-cyan-400 to-cyan-500" },
    { name: "Swift", icon: "SW", color: "from-orange-400 to-red-400" },
    { name: "Kotlin", icon: "KT", color: "from-purple-400 to-pink-500" },
    { name: "Rust", icon: "RS", color: "from-gray-600 to-gray-700" },
    { name: "C#", icon: "C#", color: "from-green-400 to-green-500" },
    { name: "Node.js", icon: "NODE", color: "from-green-500 to-emerald-500" },
  ]

  const duplicatedLanguages = [...languages, ...languages]

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.scrollWidth / 2)
    }
  }, [])

  return (
    <div className="relative w-full py-8 overflow-hidden">
      {/* Gradient fade edges */}
      {/* <div className="absolute left-0 top-0 w-40 h-full bg-gradient-to-r from-gray-800 via-gray-800/20 to-transparent z-10" />
      <div className="absolute right-0 top-0 w-40 h-full bg-gradient-to-l from-gray-800 via-gray-800/20 to-transparent z-10" />
       */}
      <div className="overflow-hidden w-full" ref={containerRef}>
        <motion.div
          className="flex gap-3"
          animate={{
            x: [-containerWidth, 0],
          }}
          transition={{
            x: {
              duration: 45,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            },
          }}
          style={{
            width: containerWidth * 2,
          }}
        >
          {duplicatedLanguages.map((language, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3 px-5 py-3 bg-white rounded-full shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
              style={{ minWidth: "fit-content" }}
              whileHover={{ y: -2 }}
            >
              {/* Gradient icon */}
              <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${language.color} flex items-center justify-center text-white text-xs font-bold`}>
                {language.icon}
              </div>
              
              <span className="font-medium text-gray-800">{language.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default LanguageSlider