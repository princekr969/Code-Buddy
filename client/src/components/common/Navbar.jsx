import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import Button from "../ui/Button"
import { Code2, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar(){
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return(
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
            <a href="/" className="text-sm text-gray-300 hover:text-white transition-colors">
              Home
            </a>
            <a href="#features" className="text-sm text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#languages" className="text-sm text-gray-300 hover:text-white transition-colors">
              Languages
            </a>
          </nav>
          
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            
            <div className="flex gap-2">

            <Link to="/auth?mode=login">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden md:inline-flex bg-gray-700 text-gray-200 hover:text-white hover:scale-105 hover:bg-gray-600 transition-all duration-300 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
            >
              Log In
            </Button>
            </Link>
             <Link to="/auth?mode=signup">
             
            <Button 
              size="sm" 
              className="hidden md:inline-flex bg-slate-900 text-white border border-white/50 hover:text-white hover:bg-slate-800 hover:border-white transition-all duration-300 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
            >
              Sign Up
            </Button>
            </Link>
            </div>
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
                href="/" 
                className="text-gray-300 border-b border-white/20 hover:text-white py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Home
              </a>
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
                <Link to="/auth?mode=login" onClick={() => setMobileMenuOpen(false)}>
                 <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full bg-gray-700 text-gray-200 hover:text-white hover:bg-gray-600"
                >
                  Log In
                </Button>
                </Link>
                <Link to="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)}>
                <Button 
                  size="sm" 
                  className="w-full bg-slate-900 text-white border border-white/50 hover:bg-slate-800"
                >
                  Sign Up
                </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </header>
    )
}