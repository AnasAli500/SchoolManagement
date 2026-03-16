import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [Email, setEmail] = useState("");
    const [password, setpassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // New state for error
    const navigate = useNavigate();

    // Check if user is already logged in
    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        if (isAuthenticated) {
            navigate('/boxes');
        }
    }, [navigate]);

    const handleLogin = (e) => {
        e.preventDefault(); 
        setErrorMessage(""); // Reset error on new attempt
        axios.post("https://schoolmanagement-backend-6qtd.onrender.com/create/Login", {
            "Email": Email,
            "password": password
        }).then((res) => {
            if (res.data.error) {
                setErrorMessage("❌ Incorrect Email or Password"); // Show error in red
            } else {
                // Store authentication state
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userEmail', Email);
                alert("✅ Login Successful");
                navigate("/boxes");
            }
        }).catch((err) => {
            console.error(err);
            setErrorMessage("❌ Login failed. Please try again."); // Show network or other errors
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userEmail');
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-4">
            <div className="bg-[#1a1a2e]/80 backdrop-blur-sm text-white p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-[#00bcd4]/20">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-[#00bcd4] mb-2">Welcome Back</h2>
                    <p className="text-sm text-gray-400">Please sign in to continue</p>
                </div>

                <form className="space-y-6">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-300">Email</label>
                        <input 
                            required
                            type="email"
                            value={Email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full px-3 py-2 rounded-lg border border-[#00bcd4]/30 bg-[#0f0f23]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:border-transparent transition duration-200" 
                            placeholder="Enter your email"
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-300">Password</label>
                        <input 
                            required
                            type="password"  
                            value={password} 
                            onChange={(e) => setpassword(e.target.value)}  
                            className="w-full px-3 py-2 rounded-lg border border-[#00bcd4]/30 bg-[#0f0f23]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:border-transparent transition duration-200" 
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Error message */}
                    {errorMessage && (
                        <div className="bg-red-600/80 text-white p-2 rounded text-center text-sm animate-pulse">
                            {errorMessage}
                        </div>
                    )}

                    <button 
                        onClick={handleLogin} 
                        className={`w-full px-4 py-2 rounded-lg text-white text-base font-semibold mt-4 transition duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2
                            ${errorMessage ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500' : 'bg-gradient-to-r from-[#00bcd4] to-[#0097a7] hover:opacity-90 focus:ring-[#00bcd4]'}
                        `}
                    >
                        {errorMessage ? 'Login Failed' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;