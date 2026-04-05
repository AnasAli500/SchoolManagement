import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [Email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [notification, setNotification] = useState({ message: "", type: "" }); // type: 'error' | 'success'
    const [errors, setErrors] = useState({ Email: false, password: false }); // validation errors
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        if (isAuthenticated) {
            navigate('/boxes');
        }
    }, [navigate]);

    // Auto-hide notification after 3 seconds
    useEffect(() => {
        if (notification.message) {
            const timer = setTimeout(() => {
                setNotification({ message: "", type: "" });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleLogin = (e) => {
        e.preventDefault(); 
        setNotification({ message: "", type: "" });

        // Check for empty fields
        const newErrors = {
            Email: Email.trim() === "",
            password: password.trim() === ""
        };
        setErrors(newErrors);

        if (newErrors.Email || newErrors.password) return; // stop if any field is empty

        axios.post("https://schoolmanagement-backend-6qtd.onrender.com/create/Login", {
            Email,
            password
        }).then((res) => {
            if (res.data.error) {
                setNotification({ message: " Invalid Email or Password", type: "error" });
            } else {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userEmail', Email);
                setNotification({ message: " Admin login successfully", type: "success" });
                setTimeout(() => navigate("/boxes"), 1000);
            }
        }).catch((err) => {
            console.error(err);
            setNotification({ message: "❌ Login failed. Please try again.", type: "error" });
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-4 relative">
            
            {/* Toast Notification */}
            {notification.message && (
                <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 max-w-md w-full z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 
                    ${notification.type === 'error' 
                        ? 'bg-red-600 border-red-800 text-white' 
                        : 'bg-green-600 border-green-800 text-white'}`}>
                    <span className="text-lg">{notification.type === 'error' ? '❌' : '✅'}</span>
                    <p className="font-medium">{notification.message}</p>
                </div>
            )}

            <div className="bg-[#1a1a2e]/80 backdrop-blur-sm text-white p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-[#00bcd4]/20">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-[#00bcd4] mb-2">Welcome Back</h2>
                    <p className="text-sm text-gray-400">Please sign in to continue</p>
                </div>

                <form className="space-y-6">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-300">Email</label>
                        <input 
                            type="email"
                            value={Email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className={`w-full px-3 py-2 rounded-lg border ${errors.Email ? 'border-red-500' : 'border-[#00bcd4]/30'} bg-[#0f0f23]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:border-transparent transition duration-200`} 
                            placeholder="Enter your email"
                        />
                        {errors.Email && <p className="text-red-500 text-sm mt-1">Email is required</p>}
                    </div>
                    
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-300">Password</label>
                        <input 
                            type="password"  
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}  
                            className={`w-full px-3 py-2 rounded-lg border ${errors.password ? 'border-red-500' : 'border-[#00bcd4]/30'} bg-[#0f0f23]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:border-transparent transition duration-200`} 
                            placeholder="Enter your password"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">Password is required</p>}
                    </div>

                    <button 
                        onClick={handleLogin} 
                        className="w-full px-4 py-2 rounded-lg text-white text-base font-semibold mt-4 bg-gradient-to-r from-[#00bcd4] to-[#0097a7] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition duration-200 transform hover:scale-[1.02]"
                    >
                        login
                    </button>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-400">
                            Don't have an account?{' '}
                            {/* <Link to="/Register" className="text-[#00bcd4] hover:text-[#0097a7] font-medium transition duration-200">
                                Sign Up
                            </Link> */}
                        </p>
                    </div>
                    
                </form>
            </div>
        </div>
    );
};

export default Login;