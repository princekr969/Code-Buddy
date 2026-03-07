import Button from "../components/ui/Button"
import { Card, CardContent } from "../components/ui/Card"
import { motion } from "framer-motion"
import { Code2, Users, Terminal, MessageSquare, FolderKanban, Zap, ChevronRight, Menu, X } from "lucide-react"
import { Link } from "react-router-dom"
import Tilt from 'react-parallax-tilt';
import { CodeEditor } from "../components/home/code-editor"
import LanguageSlider from "../components/home/language-slider"
import { useState } from "react"

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/75">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Code2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            <span className="text-lg sm:text-xl font-bold text-white">
              Code-Buddy
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a href="#features" className="text-sm text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#languages" className="text-sm text-gray-300 hover:text-white transition-colors">
              Languages
            </a>
          </nav>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden md:inline-flex bg-gray-700 text-gray-200 hover:text-white hover:scale-105 hover:bg-gray-600 transition-all duration-300 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
            >
              Log In
            </Button>
            <Button 
              size="sm" 
              className="hidden md:inline-flex bg-slate-900 text-white border border-white/50 hover:text-white hover:bg-slate-800 hover:border-white transition-all duration-300 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
            >
              Sign Up
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-slate-950 border-t border-white/10 py-4 px-4"
          >
            <nav className="flex flex-col space-y-3">
              <a 
                href="#features" 
                className="text-gray-300 border-b border-white/20 hover:text-white py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#languages" 
                className="text-gray-300 border-b border-white/20 hover:text-white py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Languages
              </a>
              <div className="pt-2 flex flex-col space-y-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full bg-gray-700 text-gray-200 hover:text-white hover:bg-gray-600"
                >
                  Log In
                </Button>
                <Button 
                  size="sm" 
                  className="w-full bg-slate-900 text-white border border-white/50 hover:bg-slate-800"
                >
                  Sign Up
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </header>

      <main>
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
                  <span className="relative bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
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
                        <stop offset="0%" stopColor="#4ade80" />
                        <stop offset="100%" stopColor="#10b981" />
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
                <Link to="/dashboard" className="w-full sm:w-auto">
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

      {/* Footer */}
      <footer className="border-t border-white/40 bg-slate-950">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Footer Links */}
          {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8 py-8 sm:py-12">
            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#languages" className="hover:text-white transition-colors">Languages</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Resources</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div> */}
          
          <div className="py-4 sm:py-6 text-center text-xs sm:text-sm text-gray-400 border-t border-white/10">
            © 2024 Code-Buddy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}