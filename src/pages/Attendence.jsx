import Dashbourd from "../components/Dashbourd";
import { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

const Attendence = () => {
    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [attendance, setAttendance] = useState({});
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Fetch classes and teachers from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch classes
                const classesResponse = await axios.get("http://localhost:3000/read/class");
                setClasses(classesResponse.data);

                // Fetch teachers
                const teachersResponse = await axios.get("http://localhost:3000/read/Teacher");
                setTeachers(teachersResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    // Fetch students when class is selected
    useEffect(() => {
        const fetchStudents = async () => {
            if (selectedClass) {
                try {
                    const response = await axios.get("http://localhost:3000/read/Student");
                    // Filter students by selected class AND isActive
                    const filteredStudents = response.data.filter(
                        student => student.class?._id === selectedClass && student.isActive === true
                    );
                    setStudents(filteredStudents);
                } catch (error) {
                    console.error("Error fetching students:", error);
                }
            } else {
                setStudents([]); // Clear students when no class is selected
            }
        };
        fetchStudents();
    }, [selectedClass]);

    return <>   
        <Dashbourd isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}/>
        <div className={`transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-[20%]'} min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 py-10`}>
            <div className="flex flex-col md:flex-row gap-6 items-center mb-10">
                <select 
                    className="border-2 border-blue-700 px-8 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition ml-0 md:ml-20 bg-white text-lg font-semibold"
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                >
                    <option value="">Select Teacher</option>
                    {teachers.map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                            {teacher.FullName}
                        </option>
                    ))}
                </select>

                <select 
                    className="border-2 border-blue-700 px-8 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white text-lg font-semibold"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                >
                    <option value="">Select class</option>
                    {classes.filter(cls => cls.isActive !== false).map((cls) => (
                        <option key={cls._id} value={cls._id}>
                            {cls.className}
                        </option>
                    ))}
                </select>
            </div>

            {/* Students Table - Modern Attendance Style */}
            {students.length > 0 && (
                <div className="mt-8 mx-auto bg-white/90 rounded-2xl p-2 sm:p-4 w-full max-w-4xl border border-blue-100 overflow-x-auto">
                    <Table className="w-full min-w-[600px] rounded-2xl overflow-hidden">
                        <TableHeader className="bg-gray-100">
                            <TableRow>
                                <TableHead className="text-gray-700 text-sm py-2 font-bold tracking-wide w-8">#</TableHead>
                                <TableHead className="text-gray-700 text-sm py-2 font-bold tracking-wide">STUDENT NAME</TableHead>
                                <TableHead className="text-gray-700 text-sm py-2 px-52 font-bold tracking-wide">STATUS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map((student, idx) => (
                                <TableRow key={student._id} className={`text-center transition-all ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50/80`}>
                                    <TableCell className="py-1 text-sm font-medium text-gray-700 border-b border-blue-100">{idx + 1}</TableCell>
                                    <TableCell className="py-1 text-left border-b border-blue-100">
                                        <div className="font-bold text-gray-900 text-sm">{student.FullName}</div>
                                        <div className="text-xs text-gray-500">{student.StudentId}</div>
                                    </TableCell>
                                    <TableCell className="py-1 border-b border-blue-100">
                                        <div className="flex justify-center gap-6">
                                            <label className="flex items-center gap-1">
                                                <input
                                                    type="radio"
                                                    name={`attendance-${student._id}`}
                                                    value="PRESENT"
                                                    checked={attendance[student._id] === "PRESENT"}
                                                    onChange={() => setAttendance({ ...attendance, [student._id]: "PRESENT" })}
                                                    className="accent-green-600 w-4 h-4"
                                                />
                                                <span className="text-green-700 font-semibold text-xs">✓ PRESENT</span>
                                            </label>
                                            <label className="flex items-center gap-1">
                                                <input
                                                    type="radio"
                                                    name={`attendance-${student._id}`}
                                                    value="ABSENT"
                                                    checked={attendance[student._id] === "ABSENT"}
                                                    onChange={() => setAttendance({ ...attendance, [student._id]: "ABSENT" })}
                                                    className="accent-red-500 w-4 h-4"
                                                />
                                                <span className="text-red-600 font-semibold text-xs">✗ ABSENT</span>
                                            </label>
                                            <label className="flex items-center gap-1">
                                                <input
                                                    type="radio"
                                                    name={`attendance-${student._id}`}
                                                    value="LATE"
                                                    checked={attendance[student._id] === "LATE"}
                                                    onChange={() => setAttendance({ ...attendance, [student._id]: "LATE" })}
                                                    className="accent-yellow-400 w-4 h-4"
                                                />
                                                <span className="text-yellow-600 font-semibold text-xs">⏰ LATE</span>
                                            </label>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
            <div className="flex justify-start mt-6 mx-20">
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg shadow transition-all text-sm"
                    onClick={async () => {
                        if (!selectedClass || !selectedTeacher) {
                            alert("Please select both class and teacher.");
                            return;
                        }
                        const selectedClassObj = classes.find(cls => cls._id === selectedClass);
                        if (selectedClassObj && selectedClassObj.isActive === false) {
                            alert("Cannot take attendance for an inactive class!");
                            return;
                        }
                        const attendanceArray = Object.entries(attendance).map(([studentId, status]) => ({
                            studentId,
                            status,
                            classId: selectedClass,
                            teacherId: selectedTeacher,
                            date: new Date().toISOString().slice(0, 10),
                        }));
                        if (attendanceArray.length === 0) {
                            alert("No attendance marked.");
                            return;
                        }
                        try {
                            await axios.post("http://localhost:3000/create/attendance", attendanceArray);
                            alert("Attendance saved!");
                        } catch (error) {
                            alert("Error saving attendance");
                            console.error(error);
                        }
                    }}
                >
                    Save Attendance
                </button>
            </div>
        </div>
    </>
}

export default Attendence;      