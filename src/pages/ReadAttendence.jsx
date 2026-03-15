import Dashbourd from "../components/Dashbourd";
import { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

const ReadAttendence = () => {
    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editStatus, setEditStatus] = useState("");
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Fetch classes and teachers from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch classes
                const classesResponse = await axios.get("https://schoolmanagement-backend-6qtd.onrender.com/read/class");
                setClasses(classesResponse.data);

                // Fetch teachers
                const teachersResponse = await axios.get("https://schoolmanagement-backend-6qtd.onrender.com/read/Teacher");
                setTeachers(teachersResponse.data);

                // Fetch students
                const studentsResponse = await axios.get("https://schoolmanagement-backend-6qtd.onrender.com/read/Student");
                setStudents(studentsResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    // Fetch attendance records based on filters
    const fetchAttendanceRecords = async () => {
        if (!selectedClass || !selectedTeacher || !selectedDate) {
            alert("Please select class, teacher, and date to view attendance records.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`https://schoolmanagement-backend-6qtd.onrender.com/read/attendance`, {
                params: {
                    classId: selectedClass,
                    teacherId: selectedTeacher,
                    date: selectedDate
                }
            });
            setAttendanceRecords(response.data);
        } catch (error) {
            console.error("Error fetching attendance records:", error);
            alert("Error fetching attendance records");
        } finally {
            setLoading(false);
        }
    };

    // Get student name by ID
    const getStudentName = (studentId) => {
        const student = students.find(s => s._id === studentId);
        return student ? student.FullName : "Unknown Student";
    };

    // Get student ID by ID
    const getStudentId = (studentId) => {
        const student = students.find(s => s._id === studentId);
        return student ? student.StudentId : "Unknown";
    };

    // Get status badge color
    const getStatusBadge = (status) => {
        switch (status) {
            case "PRESENT":
                return "bg-green-100 text-green-800 border-green-200";
            case "ABSENT":
                return "bg-red-100 text-red-800 border-red-200";
            case "LATE":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <>
            <Dashbourd isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className={`transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-[20%]'} min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 py-10`}>
                <div className="max-w-6xl mx-auto px-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Attendance Records</h1>
                        <p className="text-gray-600">View and manage student attendance records</p>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter Records</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Teacher</label>
                                <select
                                    className="w-full border-2 border-blue-700 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
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
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                                <select
                                    className="w-full border-2 border-blue-700 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                >
                                    <option value="">Select Class</option>
                                    {classes.filter(cls => cls.isActive !== false).map((cls) => (
                                        <option key={cls._id} value={cls._id}>
                                            {cls.className}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                <input
                                    type="date"
                                    className="w-full border-2 border-blue-700 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>

                            <div className="flex items-end">
                                <button
                                    onClick={fetchAttendanceRecords}
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2 px-6 rounded-lg shadow transition-all text-sm"
                                >
                                    {loading ? "Loading..." : "View Records"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Attendance Records Table */}
                    {attendanceRecords.length > 0 && (
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-800">Attendance Records</h2>
                                <p className="text-gray-600 mt-1">
                                    Showing {attendanceRecords.length} record(s) for {selectedDate}
                                </p>
                            </div>
                            <div className="overflow-x-auto">
                                <Table className="w-full">
                                    <TableHeader className="bg-gray-50">
                                        <TableRow>
                                            <TableHead className="text-gray-700 font-bold">#</TableHead>
                                            <TableHead className="text-gray-700 font-bold">Student ID</TableHead>
                                            <TableHead className="text-gray-700 font-bold">Student Name</TableHead>
                                            <TableHead className="text-gray-700 font-bold">Status</TableHead>
                                            <TableHead className="text-gray-700 font-bold">Date</TableHead>
                                            <TableHead className="text-gray-700 font-bold">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {attendanceRecords.filter(record => {
                                            const student = students.find(s => s._id === record.studentId);
                                            return student && student.class?.isActive !== false && student.isActive === true;
                                        }).map((record, idx) => (
                                            <TableRow key={record._id} className="hover:bg-gray-50">
                                                <TableCell className="font-medium">{idx + 1}</TableCell>
                                                <TableCell className="text-gray-600">
                                                    {getStudentId(record.studentId)}
                                                </TableCell>
                                                <TableCell className="font-semibold text-gray-800">
                                                    {getStudentName(record.studentId)}
                                                </TableCell>
                                                <TableCell>
                                                    {editId === record._id ? (
                                                        <select
                                                            value={editStatus}
                                                            onChange={e => setEditStatus(e.target.value)}
                                                            className="border rounded px-2 py-1"
                                                        >
                                                            <option value="PRESENT">PRESENT</option>
                                                            <option value="ABSENT">ABSENT</option>
                                                            <option value="LATE">LATE</option>
                                                        </select>
                                                    ) : (
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(record.status)}`}>
                                                            {record.status}
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    {new Date(record.date).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    {editId === record._id ? (
                                                        <button
                                                            onClick={async () => {
                                                                await axios.put(`https://schoolmanagement-backend-6qtd.onrender.com/update/attendance/${record._id}`, { status: editStatus });
                                                                setEditId(null);
                                                                fetchAttendanceRecords();
                                                            }}
                                                            className="bg-green-500 text-white px-2 py-1 rounded"
                                                        >
                                                            Save
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                setEditId(record._id);
                                                                setEditStatus(record.status);
                                                            }}
                                                            className="bg-blue-500 text-white px-2 py-1 rounded"
                                                        >
                                                            Edit
                                                        </button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}

                    {/* No Records Message */}
                    {attendanceRecords.length === 0 && !loading && selectedClass && selectedTeacher && selectedDate && (
                        <div className="bg-white rounded-xl p-8 text-center shadow-lg">
                            <div className="text-gray-400 mb-4">
                                <i className="fa-solid fa-clipboard-list text-6xl"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Records Found</h3>
                            <p className="text-gray-600">
                                No attendance records found for the selected criteria. Please try different filters.
                            </p>
                        </div>
                    )}

                    {/* Instructions */}
                    {!selectedClass || !selectedTeacher || !selectedDate ? (
                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                            <div className="flex items-center gap-3 mb-3">
                                <i className="fa-solid fa-info-circle text-blue-600 text-xl"></i>
                                <h3 className="text-lg font-semibold text-blue-800">How to View Records</h3>
                            </div>
                            <p className="text-blue-700">
                                Please select a teacher, class, and date above to view attendance records for that specific combination.
                            </p>
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );
};

export default ReadAttendence; 