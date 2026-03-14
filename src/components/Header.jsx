import { Link } from 'react-router-dom';
const Header = () => {
    return (
        <header className=" bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 shadow-lg">
            <nav className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-96">
                   <div className="text-xl font-bold text-white">
                        <span className="text-blue-500 text-2xl">🧑‍💻</span>
                         SchoolManagement
                        </div> 
                        <div className="hidden md:flex space-x-6">
                            <div className="text-white hover:text-gray-200 transition duration-300">
                                Home
                            </div> 
                            <div className="text-white hover:text-gray-200 transition duration-300">
                                Services
                           </div> 
                            <div className="text-white hover:text-gray-200 transition duration-300">
                                Contact
                            </div> 
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 ">
                       <Link to="/login"><div className="px-4 py-2 text-white hover:text-gray-200 transition duration-300" >
                            Login
                        </div></Link>  
                        <div
                            className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-100 transition duration-300"
                        >
                            Register
                        </div>                     </div>
                </div>
            </nav>
        </header>
    );
};

export default Header; 