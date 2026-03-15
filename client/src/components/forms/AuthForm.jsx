import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import  toast  from "react-hot-toast"
import AuthService from "../../services/authService.js"
import {
  Mail,
  Lock,
  User,
  UserCircle,
  RefreshCw
} from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom";
import {useAuthContext} from "../../context/AuthContext.jsx"
import userService from "../../services/userService.js"


const AuthForm = () => {
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode') || 'login';
    const {setCurrentUser} = useAuthContext();

    
  const [isSignup, setIsSignup] = useState(mode === 'signup');
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    name: ""
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)


    try {
      if (isSignup) {
        const { email, password, username, name } = formData
        if (!email || !password || !username || !name) {
          toast.error("Please fill all fields")
          return
        }
        
        const res = await AuthService.signUp(name, email, password, username);

        if(!res.success)
        {
          toast.error(res.message);
          return;
        }

        const userRes = await userService.getCurrentUser();
        if(userRes.success){
          setCurrentUser(userRes?.user)
          toast.success("Signup successful!");
          setIsSignup(false);
          navigate("/dashboard/" + userRes?.user?._id)
        }
      } 
      else {
        const { email, password } = formData;
        
        if (!email || !password) {
          toast.error("Email and password are required")
          return
        }
        
        const res = await AuthService.loginUser(email, password);

        if(!res.success){
          toast.error(res.message);
          return;
        }

        const userRes = await userService.getCurrentUser();
        if(userRes.success){
          setCurrentUser(userRes?.user)
          toast.success("Login successful!");
          setIsSignup(false);
          navigate("/dashboard/" + userRes?.user?._id)
        }
      }
    } catch (err) {
      toast.error(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full pl-10 rounded-lg border border-gray-300 bg-gray-100 p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"

  const renderInput = (icon, type, name, placeholder, value) => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className={inputClass}
        onChange={handleInputChange}
        value={value}
      />
    </div>
  )

  useEffect(() => {
        setIsSignup(mode === 'signup');
    }, [mode]);

  return (
    <div className="w-full bg-white p-6 rounded-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div className="space-y-3">
          {isSignup && (
            <>
              {renderInput(
                <UserCircle size={18} className="text-gray-500" />,
                "text",
                "name",
                "Full Name",
                formData.name
              )}
              {renderInput(
                <User size={18} className="text-gray-500" />,
                "text",
                "username",
                "Username",
                formData.username
              )}
            </>
          )}
          {renderInput(
            <Mail size={18} className="text-gray-500" />,
            "email",
            "email",
            "Email",
            formData.email
          )}
          {renderInput(
            <Lock size={18} className="text-gray-500" />,
            "password",
            "password",
            "Password",
            formData.password
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-2 rounded-lg bg-black text-white py-3 text-lg font-semibold transition ${
            loading ? "opacity-80 cursor-not-allowed" : "hover:bg-black/80"
          }`}
        >
          <div className="flex justify-center items-center gap-2">
            {loading ? (
              <>
                <RefreshCw className="animate-spin" size={20} />
                <span>{isSignup ? "Signing up..." : "Logging in..."}</span>
              </>
            ) : (
              <span>{isSignup ? "Sign Up" : "Log In"}</span>
            )}
          </div>
        </button>

        <div className="text-center text-sm text-gray-600 mt-4">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <Link to="/auth?mode=login">
              
              <button
                type="button"
                onClick={() => setIsSignup(false)}
                className="text-black underline hover:text-gray-800"
              >
                Log In
              </button>
              </Link>
            </>
          ) : (
            <>  
              Don't have an account?{" "}
              <Link to="/auth?mode=signup">
                <button
                  type="button"
                  onClick={() => setIsSignup(true)}
                  className="text-black underline hover:text-gray-800"
                >
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </form>
    </div>
  )
}

export default AuthForm;
