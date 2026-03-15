import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import Button from "../ui/Button"
import { Code2, Menu, X, User, LogOut, ChevronDown } from "lucide-react"
import { useState } from "react"
import { useAuthContext } from "../../context/AuthContext"
import authService from "../../services/authService"

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [profileMenuOpen, setProfileMenuOpen] = useState(false)
    const navigate = useNavigate()
    const { currentUser, setCurrentUser } = useAuthContext();

    const handleLogout = async () => {
        try {
          await authService.logout();
          setCurrentUser(null);
          navigate('/')
          setProfileMenuOpen(false)
        } catch (error) {
          console.log("Error: logout")
        }
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-slate-950/95 backdrop-blur ">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
                    <div className="relative">
                        <Code2 className="relative h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-white">
                        Code-Buddy
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
                    <Link to="/" className="text-sm text-gray-300 hover:text-white transition-colors">
                        Home
                    </Link>
                    <a href="#features" className="text-sm text-gray-300 hover:text-white transition-colors">
                        Features
                    </a>
                    <a href="#languages" className="text-sm text-gray-300 hover:text-white transition-colors">
                        Languages
                    </a>
                    {currentUser && (
                        <Link to={`/dashboard/${currentUser._id}`} className="text-sm text-gray-300 hover:text-white transition-colors">
                            Dashboard
                        </Link>
                    )}
                </nav>

                {/* Right side - Auth buttons or User menu */}
                <div className="flex items-center gap-2">
                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-gray-300 hover:text-white"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>

                    {/* Desktop: Auth buttons or User menu */}
                    <div className="hidden md:block">
                        {currentUser ? (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                                        {currentUser.avatar ? (
                                            <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover" />
                                        ) : (
                                            currentUser.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />
                                        )}
                                    </div>
                                    <span className="text-sm text-white hidden lg:inline">{currentUser.name}</span>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {profileMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2"
                                        >
                                            <Link
                                                to="/profile"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                                                onClick={() => setProfileMenuOpen(false)}
                                            >
                                                <User className="w-4 h-4" />
                                                Profile
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Link to="/auth?mode=login">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="bg-gray-700 text-gray-200 hover:text-white hover:scale-105 hover:bg-gray-600 transition-all duration-300 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
                                    >
                                        Log In
                                    </Button>
                                </Link>
                                <Link to="/auth?mode=signup">
                                    <Button
                                        size="sm"
                                        className="bg-slate-900 text-white border border-white/50 hover:text-white hover:bg-slate-800 hover:border-white transition-all duration-300 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
                                    >
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
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
                        <Link
                            to="/"
                            className="text-gray-300 border-b border-white/20 hover:text-white py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
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
                        {currentUser && (
                            <Link
                                to={`/dashboard/${currentUser._id}`}
                                className="text-gray-300 border-b border-white/20 hover:text-white py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                        )}
                        <div className="pt-2 flex flex-col space-y-2">
                            {currentUser ? (
                                <>
                                    <div className="flex items-center gap-3 px-3 py-2 bg-gray-800/50 rounded-lg">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                                            {currentUser.avatar ? (
                                                <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover" />
                                            ) : (
                                                currentUser.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />
                                            )}
                                        </div>
                                        <span className="text-sm text-white font-medium">{currentUser.name}</span>
                                    </div>
                                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full bg-gray-700 text-gray-200 hover:text-white hover:bg-gray-600"
                                        >
                                            <User className="w-4 h-4 mr-2" />
                                            Profile
                                        </Button>
                                    </Link>
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            handleLogout()
                                            setMobileMenuOpen(false)
                                        }}
                                        className="w-full bg-slate-900 text-white border border-white/50 hover:bg-slate-800"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
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
                                </>
                            )}
                        </div>
                    </nav>
                </motion.div>
            )}
        </header>
    )
}