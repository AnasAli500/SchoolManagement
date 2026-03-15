import { Link } from "react-router-dom"
import Dashbourd from "../components/Dashbourd"
import { useState, useEffect } from "react"
import axios from "axios"

const Boxes = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [studentCount, setStudentCount] = useState(0)
    const [teacherCount, setTeacherCount] = useState(0)
    const [classCount, setClassCount] = useState(0)
    const [periodCount, setPeriodCount] = useState(0)

    useEffect(() => {
        // Fetch student data
        axios.get("https://schoolmanagement-backend-6qtd.onrender.com/read/Student")
            .then((res) => {
                setStudentCount(res.data.length)
            })
            .catch(error => console.log(error))

        // Fetch teacher data
        axios.get("https://schoolmanagement-backend-6qtd.onrender.com/read/Teacher")
            .then((res) => {
                setTeacherCount(res.data.length)
            })
            .catch(error => console.log(error))

        // Fetch class data
        axios.get("https://schoolmanagement-backend-6qtd.onrender.com/read/class")
            .then((res) => {
                setClassCount(res.data.length)
            })
            .catch(error => console.log(error))

        // Fetch period data
        axios.get("https://schoolmanagement-backend-6qtd.onrender.com/period")
            .then((res) => {
                setPeriodCount(res.data.length)
            })
            .catch(error => console.log(error))
    }, [])

    return <>
        <Dashbourd isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className={`flex gap-2 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-72'}`}>
                 <Link to="/student"> <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-6 w-42 mt-10 shadow-lg transform hover:scale-105 transition-transform duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-2">Students</h2>
                                <p className="text-orange-100 text-sm">Manage student records</p>
                                <p className="text-orange-100 text-2xl font-bold">Total : {studentCount}</p>
                            </div>
                            <i className="fa-solid fa-users text-3xl text-white opacity-80"></i>
                        </div>
                 </div></Link>
                 
                <Link to="/teacher">  <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 w-42 mt-10 shadow-lg transform hover:scale-105 transition-transform duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-2">Teacher</h2>
                                <p className="text-orange-100 text-sm">Manage Teacher records</p>
                                <p className="text-orange-100 text-2xl font-bold">Total : {teacherCount}</p>
                            </div>
                            <i className="fa-solid fa-chalkboard-user text-3xl text-white opacity-80"></i>
                        </div>
                 </div></Link>
            <Link to="/class"><div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 w-42 mt-10 shadow-lg transform hover:scale-105 transition-transform duration-200">
                       <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-2">clasess</h2>
                                <p className="text-orange-100 text-sm">Manage classes records</p>
                                <p className="text-orange-100 text-2xl font-bold">Total : {classCount}</p>
                            </div>
                            <i className="fa-solid fa-landmark text-3xl text-white opacity-80"></i>
                        </div>
                 </div></Link>
            <Link to="/period"><div className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl p-6 w-42 mt-10 shadow-lg transform hover:scale-105 transition-transform duration-200">
                       <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-2">period</h2>
                                <p className="text-orange-100 text-sm">Manage period records</p>
                                <p className="text-orange-100 text-2xl font-bold">Total : {periodCount}</p>
                            </div>
                            <i className="fa-solid fa-calendar-days text-3xl text-white opacity-80"></i>
                        </div>
                 </div></Link>
        </div>

        <div className={`flex gap-10 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-72'}`}>

                <Link to="/Attendence"><div className="bg-gradient-to-r from-black to-black rounded-xl p-6 w-48 mt-10 shadow-lg transform hover:scale-105 transition-transform duration-200">
                       <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-2">Attendence</h2>
                                <p className="text-orange-100 text-sm">Manage Attendence records</p>
                            </div>
                            <i className="fa-solid fa-clipboard-check text-3xl text-white opacity-80"></i>
                        </div>
                 </div></Link>


            <Link to=""><div className="bg-gradient-to-r from-purple-800 to-purple-800 rounded-xl p-6 w-48 mt-10 shadow-lg transform hover:scale-105 transition-transform duration-200">
                       <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-2">Finance</h2>
                                <p className="text-orange-100 text-sm">Manage Finance records</p>
                            </div>
                            <i className="fa-solid fa-dollar-sign text-3xl text-white opacity-80"></i>
                        </div>
                 </div></Link>
                 </div>

    <div className={`space-y-6 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-72'} mt-5 mb-10 w-80`}>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/Attendence" className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <i className="fa-solid fa-clipboard-check text-blue-600 mr-3"></i>
                <span className="font-medium text-gray-800 text-sm">Mark Attendance</span>
              </Link>
              <Link to="/teacher" className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <i className="fa-solid fa-star text-green-600 mr-3"></i>
                <span className="font-medium text-gray-800 text-sm">View Teacher</span>
              </Link>
              <Link to="/class" className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <i className="fa-solid fa-calendar text-purple-600 mr-3"></i>
                <span className="font-medium text-gray-800 text-sm">Schedule Class</span>
              </Link>
              <Link to="/student" className="flex items-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                <i className="fa-solid fa-users text-orange-600 mr-3"></i>
                <span className="font-medium text-gray-800 text-sm">View Students</span>
              </Link>
            </div>
          </div>
        </div>
                 
 </>
}

export default Boxes