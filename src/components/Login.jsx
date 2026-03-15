import { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [Email, setEmail] = useState("")
    const [password, setpassword] = useState("")
    const [islogedIn, setIsloeedIn] = useState(false)
    const navigate = useNavigate()

    // Check if user is already logged in
    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        if (isAuthenticated) {
            navigate('/boxes');
        }
    }, [navigate]);

    const handleLogin = (e) => {
        e.preventDefault() 
        axios.post("https://schoolmanagement-backend-6qtd.onrender.com/create/Login", {
            "Email": Email,
            "password": password
        }).then((res) => {
            if (res.data.error) {
                alert(" ❌  Incorrect Email Or Password ")
            } else {
                // Store authentication state
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userEmail', Email);
                setIsloeedIn(true);
                alert(" ✅ Success Login ")
                navigate("/boxes")
            }
        }).catch((err) => {
            console.error(err);
            alert(" ❌ Login failed. Please try again.");
        });
    }

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userEmail');
        setIsloeedIn(false);
        navigate('/');
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-4">
            <div className="bg-[#1a1a2e]/80 backdrop-blur-sm text-white p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-[#00bcd4]/20">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-[#00bcd4] mb-2">Welcome Back</h2>
                    <p className="text-sm text-gray-400">Please sign in to continue</p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-300">Email</label>
                        <div className="relative">
                            <input 
                                type="email"
                                value={Email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="w-full px-3 py-2 rounded-lg border border-[#00bcd4]/30 bg-[#0f0f23]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:border-transparent transition duration-200" 
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-300">Password</label>
                        <div className="relative">
                            <input 
                                type="password"  
                                value={password} 
                                onChange={(e) => setpassword(e.target.value)}  
                                className="w-full px-3 py-2 rounded-lg border border-[#00bcd4]/30 bg-[#0f0f23]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:border-transparent transition duration-200" 
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleLogin} 
                        className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-[#00bcd4] to-[#0097a7] text-white text-base font-semibold hover:opacity-90 transition duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:ring-offset-2 focus:ring-offset-[#1a1a2e] mt-4"
                    >
                        Sign In
                    </button>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/Register" className="text-[#00bcd4] hover:text-[#0097a7] font-medium transition duration-200">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login; 