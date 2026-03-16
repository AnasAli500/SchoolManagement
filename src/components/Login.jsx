import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [Email, setEmail] = useState("");
    const [password, setpassword] = useState("");
    const [notification, setNotification] = useState({ message: "", type: "" }); // type: 'error' | 'success'
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        if (isAuthenticated) {
            navigate('/boxes');
        }
    }, [navigate]);

    const handleLogin = (e) => {
        e.preventDefault(); 
        setNotification({ message: "", type: "" }); // Reset notification
        axios.post("https://schoolmanagement-backend-6qtd.onrender.com/create/Login", {
            "Email": Email,
            "password": password
        }).then((res) => {
            if (res.data.error) {
                setNotification({ message: "❌ Incorrect Email or Password", type: "error" });
            } else {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userEmail', Email);
                setNotification({ message: "✅ Login Successful", type: "success" });
                setTimeout(() => navigate("/boxes"), 1000); // Navigate after 1s
            }
        }).catch((err) => {
            console.error(err);
            setNotification({ message: "❌ Login failed. Please try again.", type: "error" });
        });
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

                    {/* Notification Box */}
                    {notification.message && (
                        <div
                            className={`p-2 rounded text-center text-sm font-medium ${
                                notification.type === "error"
                                    ? "bg-red-600/80 text-white animate-pulse"
                                    : "bg-green-600/80 text-white animate-pulse"
                            }`}
                        >
                            {notification.message}
                        </div>
                    )}

                    <button 
                        onClick={handleLogin} 
                        className={`w-full px-4 py-2 rounded-lg text-white text-base font-semibold mt-4 transition duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2
                            ${notification.type === "error" 
                                ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500' 
                                : 'bg-gradient-to-r from-[#00bcd4] to-[#0097a7] hover:opacity-90 focus:ring-[#00bcd4]'}
                        `}
                    >
                        {notification.type === "error" ? 'Login Failed' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;