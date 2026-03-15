import { useState } from "react"
import Button from "../components/ui/Button"
import { Card, CardContent } from "../components/ui/Card"
import { motion } from "framer-motion"
import { Code2, Users, Terminal, MessageSquare, FolderKanban, Zap, ChevronRight, Menu, X } from "lucide-react"
import { Link } from "react-router-dom"
import Tilt from 'react-parallax-tilt';
import { CodeEditor } from "../components/home/code-editor"
import LanguageSlider from "../components/home/language-slider"
import Navbar from "../components/common/Navbar"

const features = [
  {
    title: "Collaborative Editing",
    description: "Code together in real-time with multiple developers on the same file.",
    icon: <Users className="h-6 w-6 md:h-8 md:w-8" />,
  },
  {
    title: "Code Execution",
    description: "Run your code directly in the browser with instant feedback.",
    icon: <Terminal className="h-6 w-6 md:h-8 md:w-8" />,
  },
  {
    title: "Integrated Chat",
    description: "Communicate with your team without leaving the editor.",
    icon: <MessageSquare className="h-6 w-6 md:h-8 md:w-8" />,
  },
  {
    title: "File Management",
    description: "Organize your projects with our intuitive file system.",
    icon: <FolderKanban className="h-6 w-6 md:h-8 md:w-8" />,
  },
  {
    title: "Multi-Language Support",
    description: "Code in JavaScript, Python, Java, C++, C, C# and many more.",
    icon: <Code2 className="h-6 w-6 md:h-8 md:w-8" />,
  },
  {
    title: "Lightning Fast",
    description: "Optimized performance for a smooth coding experience.",
    icon: <Zap className="h-6 w-6 md:h-8 md:w-8" />,
  },
]

export default function Home() {

  return (
    <div className="min-h-screen bg-slate-950">
        
      

      <main className="relative min-h-screen bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
        {/* Animated Background Elements - Dark Theme */}
        <div className="absolute inset-0 overflow-hidden">
            {/* Gradient Orbs */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        </div>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 bg-slate-950">
          <div className="px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                className="inline-flex items-center rounded-full bg-gray-800 px-3 py-1 text-xs sm:text-sm text-white mb-4 sm:mb-6 border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 mr-1.5 sm:mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-500"></span>
                </span>
                The Future of Coding
              </motion.div>
              
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-4 sm:mb-6 text-white px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Collaborate on code in{' '}
                <span className="relative whitespace-nowrap">
                  <span className="relative bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    real-time
                  </span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full hidden sm:block"
                    height="8"
                    viewBox="0 0 300 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 5.5C77.5 2.5 155 2.5 231.5 5.5C253 6.5 276 7.5 299 6"
                      stroke="url(#gradient)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#C084FC" />
                        <stop offset="100%" stopColor="#F472B6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </motion.h1>
              
              <motion.p
                className="text-sm sm:text-base md:text-lg text-gray-400 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-4"
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

            {/* Code Editor Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative mx-auto max-w-5xl mt-8 sm:mt-12 md:mt-16 px-4 sm:px-0"
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-b from-green-500/20 via-transparent to-transparent rounded-3xl blur-3xl" />
              <div className="relative rounded-lg sm:rounded-xl border border-gray-800 shadow-2xl overflow-hidden bg-gray-900">
                <CodeEditor />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Languages Section */}
        <section id="languages" className="py-8 sm:py-12 md:py-16 text-white border-t border-white/20">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight px-4">
                Supported Languages
              </h2>
            </div>
            <LanguageSlider />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-20 md:py-24 border-t border-white/40">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-12 sm:mb-16">
              <motion.div
                className="inline-flex items-center rounded-full bg-gray-800 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm text-gray-300 border border-gray-700 mb-3 sm:mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                ✨ Features
              </motion.div>
              
              <motion.h2
                className="text-white text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4 px-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Everything you need to succeed
              </motion.h2>
              
              <motion.p
                className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto px-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Powerful features designed for modern development teams
              </motion.p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4">
              {features.map((feature, index) => (
                <Tilt key={index} tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="h-full"
                  >
                    <Card className="h-full bg-gray-800/50 border border-gray-700 transition-all duration-300 hover:border-gray-600 hover:bg-gray-800/70">
                      <CardContent className="p-4 sm:p-5 md:p-6">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-gray-700 flex items-center justify-center mb-3 sm:mb-4 text-purple-400">
                          {feature.icon}
                        </div>
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-white">
                          {feature.title}
                        </h3>
                        <p className="text-xs sm:text-sm md:text-base text-gray-400">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Tilt>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Animation Keyframes */}
            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
    </div>
  )
}