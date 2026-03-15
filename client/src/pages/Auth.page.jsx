import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import AuthForm from "../components/forms/AuthForm";
import authService from '../services/authService';

export default function AuthPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const mode = searchParams.get('mode') || 'login';
    const [isLogin, setIsLogin] = useState(mode === 'login');

    useEffect(() => {
        setIsLogin(mode === 'login');
    }, [mode]);

    const handleGoogleAuth = () => {
        authService.loginWithGoogle();
    };

    return (
        <div className="relative min-h-screen bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
            {/* Animated Background Elements - Dark Theme */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradient Orbs */}
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
            </div>

            {/* Back Button */}
            <div className="absolute top-10 left-4 sm:left-8 z-20">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm">Back</span>
                </motion.button>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
                <div className="flex flex-row items-center justify-center gap-8 lg:gap-16">
                    
                    {/* Left Section - Value Proposition */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="hidden md:block w-full lg:w-1/2 text-left"
                    >
                        <div className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 px-3 py-1 text-sm text-purple-400 mb-6">
                            <Sparkles className="w-4 h-4 mr-2" />
                            {isLogin ? 'Welcome Back!' : 'Join the Community'}
                        </div>
                        
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                            {isLogin ? (
                                <>Continue your <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">coding journey</span></>
                            ) : (
                                <>Start <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">collaborating</span> today</>
                            )}
                        </h1>
                        
                        <p className="text-base sm:text-lg text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0">
                            {isLogin 
                                ? "Access your projects, continue where you left off, and collaborate with your team in real-time."
                                : "Join thousands of developers who are already building amazing things together on Code-Buddy."}
                        </p>

                        {/* Feature List */}
                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                <span className="text-sm text-gray-300">Real-time editing</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                                <span className="text-sm text-gray-300">50+ languages</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                <span className="text-sm text-gray-300">Team chat</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                <span className="text-sm text-gray-300">File sharing</span>
                            </div>
                        </div>

                    </motion.div>

                    {/* Right Section - Auth Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full lg:w-1/2 flex justify-center"
                    >
                        <div className="w-full max-w-md">
                            {/* Form Card */}
                            <div className="relative group">
                                {/* Glow Effect */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                                
                                {/* Form Container */}
                                <div className="relative bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
                                    {/* Header with Mode Toggle */}
                                    <div className="mb-8">
                                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                            {isLogin ? 'Welcome Back' : 'Create Account'}
                                        </h2>
                                        <p className="text-sm text-gray-400">
                                            {isLogin 
                                                ? "Enter your credentials to access your account" 
                                                : "Sign up to start collaborating with your team"}
                                        </p>
                                    </div>

                                    {/* Mode Toggle */}
                                    <div className="flex gap-2 mb-8 p-1 bg-gray-800/50 rounded-lg">
                                        <Link
                                            to="/auth?mode=login"
                                            className={`flex-1 text-center py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                                                isLogin 
                                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                            }`}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/auth?mode=signup"
                                            className={`flex-1 text-center py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                                                !isLogin 
                                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                            }`}
                                        >
                                            Sign Up
                                        </Link>
                                    </div>

                                    {/* Social Auth Buttons */}
                                    <div className="space-y-3">
                                        {/* Google Auth */}
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleGoogleAuth}
                                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium transition-all duration-300 group"
                                        >
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path
                                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                    fill="#4285F4"
                                                />
                                                <path
                                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                    fill="#34A853"
                                                />
                                                <path
                                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                    fill="#FBBC05"
                                                />
                                                <path
                                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                    fill="#EA4335"
                                                />
                                            </svg>
                                            <span>Google</span>
                                        </motion.button>

                                    </div>


                                    {/* Divider */}
                                    <div className="relative my-6">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-700"></div>
                                        </div>
                                        <div className="relative flex justify-center text-xs">
                                            <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
                                        </div>
                                    </div>
                                    {/* Auth Form */}
                                    <AuthForm />

                                    

                                    {/* Additional Links */}
                                    {isLogin && (
                                        <div className="mt-4 text-center">
                                            <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                                                Forgot password?
                                            </button>
                                        </div>
                                    )}

                                    {/* Terms */}
                                    <p className="text-xs text-center text-gray-500 mt-6">
                                        By continuing, you agree to our{' '}
                                        <a href="#" className="text-purple-400 hover:text-purple-300">
                                            Terms of Service
                                        </a>{' '}
                                        and{' '}
                                        <a href="#" className="text-purple-400 hover:text-purple-300">
                                            Privacy Policy
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none"></div>

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
    );
}