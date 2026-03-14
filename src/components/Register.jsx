import { useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    
    const [Name , setName] = useState("")
    const [Adress , seetAdress] = useState("")
    const [Email , setEmail] = useState("")
    const [password , setpassword] = useState("")

    const navigate = useNavigate()

    const handleRegister = (e) => {
        e.preventDefault() 
        axios.post("http://localhost:3000/create/Register",{
            "Name":Name,
            "Adress":Adress,
            "Email":Email,
            "password":password
        }).then((res)=> {
            if(res.data.error){
                alert(" ❌  Incorrect Email Or Password ")
            }
            else{
                alert(" ✅ succes Login ")
                navigate("/")
            }
        }) .catch((err) => console.error(err));
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-4">
            <div className="bg-[#1a1a2e]/80 backdrop-blur-sm text-white p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-[#00bcd4]/20">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-[#00bcd4] mb-2">Create Account</h2>
                    <p className="text-sm text-gray-400">Join us and start your journey</p>
                </div>

                <div className="space-y-3">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-300">Full Name</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={Name} 
                                onChange={(e) => setName(e.target.value)} 
                                className="w-full px-3 py-2 rounded-lg border border-[#00bcd4]/30 bg-[#0f0f23]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:border-transparent transition duration-200" 
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-300">Address</label>
                        <div className="relative">
                            <input 
                                type="text"  
                                value={Adress} 
                                onChange={(e) => seetAdress(e.target.value)}  
                                className="w-full px-3 py-2 rounded-lg border border-[#00bcd4]/30 bg-[#0f0f23]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:border-transparent transition duration-200" 
                                placeholder="Enter your address"
                            />
                        </div>
                    </div>

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
                                placeholder="Create a password"
                            />
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleRegister} 
                        className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-[#00bcd4] to-[#0097a7] text-white text-base font-semibold hover:opacity-90 transition duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:ring-offset-2 focus:ring-offset-[#1a1a2e] mt-4"
                    >
                        Create Account
                    </button>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-400">
                            Already have an account?{' '}
                            <Link to="/" className="text-[#00bcd4] hover:text-[#0097a7] font-medium transition duration-200">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register; 