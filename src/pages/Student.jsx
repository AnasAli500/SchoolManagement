import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import Dashbourd from "../components/Dashbourd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Student = () => {
  const [getData, setData] = useState([]);
  const [isclose, setIsclose] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    StudentId: "",
    FullName: "",
    Age: "",
    adress: "",
    phone: "",
    Gender: "",
    Prent: "",
    Pr_PHONE: "",
    classId: "",
    className: "",
    isActive: true
  });
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [attendanceInfo, setAttendanceInfo] = useState(null);
  const [financeInfo, setFinanceInfo] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showSuccess, setShowSuccess] = useState(null); // { type: 'create' | 'update' }

  // Read all students
  const handleRaedData = () => {
    axios.get("http://localhost:3000/read/Student").then((res) => {
      setData(res.data);
    }).catch(error => console.log(error));
  };

  // Read all classes
  useEffect(() => {
    handleRaedData();
    axios.get('http://localhost:3000/read/class')
      .then((response) => {
        setClasses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
      });
  }, []);

  // Open modal for create
  const HandleClick = () => {
    setFormData({
      StudentId: "",
      FullName: "",
      Age: "",
      adress: "",
      phone: "",
      Gender: "",
      Prent: "",
      Pr_PHONE: "",
      classId: "",
      className: "",
      isActive: true
    });
    setEditId(null);
    setIsclose(true);
  };

  // Open modal for edit
  const handleEdit = (student) => {
    setFormData({
      StudentId: student.StudentId || "",
      FullName: student.FullName || "",
      Age: student.Age || "",
      adress: student.adress || "",
      phone: student.phone || "",
      Gender: student.Gender || "",
      Prent: student.Prent || "",
      Pr_PHONE: student.Pr_PHONE || "",
      classId: student.class?._id || "",
      className: student.class?.className || "",
      isActive: student.isActive !== undefined ? student.isActive : true
    });
    setEditId(student._id);
    setIsclose(true);
  };

  // Create or update student
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.Age) {
      alert('Age is required');
      return;
    }
    const payload = {
      ...formData,
      class: {
        _id: formData.classId,
        className: formData.className,
      },
      Age: formData.Age
    };
    if (editId) {
      axios.put(`http://localhost:3000/update/Student/${editId}`, payload)
        .then(() => {
          setShowSuccess({ type: 'update' });
          setTimeout(() => setShowSuccess(null), 1800);
          setIsclose(false);
          setEditId(null);
          handleRaedData();
        })
        .catch((error) => console.log(error));
    } else {
      axios.post("http://localhost:3000/create/student", payload)
        .then(() => {
          setShowSuccess({ type: 'create' });
          setTimeout(() => setShowSuccess(null), 1800);
          setIsclose(false);
          handleRaedData();
        })
        .catch((error) => console.log(error));
    }
  };

  // Delete student
  const handleDeleteData = (id) => {
    axios.delete(`http://localhost:3000/delete/Student/${id}`)
      .then(() => {
        setShowSuccess({ type: 'delete' });
        setTimeout(() => setShowSuccess(null), 1800);
        handleRaedData();
      })
      .catch((error) => console.log(error));
  };

  // Toggle active status
  const toggleActiveStatus = (id, currentStatus) => {
    axios.put(`http://localhost:3000/update/Student/${id}`, { isActive: !currentStatus })
      .then(() => {
        setShowSuccess({ type: 'status' });
        setTimeout(() => setShowSuccess(null), 1800);
        handleRaedData();
      })
      .catch((error) => console.log(error));
  };

  // filter class and search
  const filteredData = getData.filter(item => {
    const matchesClass = formData.classId ? item.class?._id === formData.classId : true;
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      item.FullName?.toLowerCase().includes(search) ||
      item.StudentId?.toString().includes(search) ||
      item.adress?.toLowerCase().includes(search) ||
      item.phone?.toString().includes(search) ||
      item.Gender?.toLowerCase().includes(search) ||
      item.Prent?.toLowerCase().includes(search) ||
      item.Pr_PHONE?.toString().includes(search) ||
      item.class?.className?.toLowerCase().includes(search);
    // Hide students whose class is inactive
    const classIsActive = item.class?.isActive !== false;
    return matchesClass && matchesSearch && classIsActive;
  });

  // Fetch attendance and finance info for a student
  const handleShowInfo = async (student) => {
    setSelectedStudent(student);
    setIsInfoOpen(true);
    setAttendanceInfo(null);
    setFinanceInfo(null);
    try {
      // Fetch attendance
      const attRes = await axios.get(`http://localhost:3000/read/attendence/student/${student._id}`);
      setAttendanceInfo(attRes.data);
    } catch (err) {
      setAttendanceInfo({ error: 'Attendance info not found' });
    }
    try {
      // Fetch finance
      const finRes = await axios.get(`http://localhost:3000/read/finance/student/${student._id}`);
      setFinanceInfo(finRes.data);
    } catch (err) {
      setFinanceInfo({ error: 'Finance info not found' });
    }
  };

  return <>
    <style>{`
      @keyframes dash {
        to { stroke-dashoffset: 0; }
      }
      .checkmark-path { stroke-dasharray: 60; stroke-dashoffset: 60; animation: dash 600ms ease forwards; }
    `}</style>
    <Dashbourd isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 min-h-screen p-6 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-[20%]'}`}>
      {showSuccess && (
        <div className="fixed top-6 inset-x-0 z-[60] flex items-start justify-center pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2 bg-green-100 text-green-700 border border-green-400 px-5 py-2 rounded-full shadow-md animate-fadeIn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#16a34a" strokeWidth="2" fill="#d1fae5"/>
              <path className="checkmark-path" d="M7 12.5l3 3L17 9" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-medium">Success</span>
          </div>
        </div>
      )}
      <button onClick={HandleClick} className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-2xl mt-2 text-white transition-colors duration-200">+ Add Student</button>
      <select
        value={formData.classId}
        onChange={(e) => {
          const selectedId = e.target.value;
          setFormData(f => ({
            ...f,
            classId: selectedId,
            className: classes.find(cls => cls._id === selectedId)?.className || ""
          }));
        }}
        className="border-2 border-blue-700 px-8 py-2 rounded-lg ml-20"
      >
        <option value="">Select Class</option>
        {classes.filter(cls => cls.isActive !== false).map((cls) => (
          <option key={cls._id} value={cls._id}>
            {cls.className}
          </option>
        ))}
      </select>
      {/* Modal for create/update */}
      {isclose && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-[#18182f] w-[320px] p-6 rounded-2xl shadow-2xl border border-[#00bcd4] relative animate-fadeIn backdrop-blur-md">
            <h2 className="text-center text-[#00bcd4] text-3xl font-bold mb-6 tracking-wide drop-shadow">{editId ? "Update" : "Create"} Student</h2>
            <form onSubmit={handleSubmit}>
              <div className="flex gap-2 mb-3">
                <div className="w-1/2">
                  <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">StudentId</label>
                  <input value={formData.StudentId} onChange={e => setFormData(f => ({ ...f, StudentId: e.target.value }))} type="number" className="w-full px-3 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all" />
                </div>
                <div className="w-1/2">
                  <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">FullName</label>
                  <input value={formData.FullName} onChange={e => setFormData(f => ({ ...f, FullName: e.target.value }))} type="text" className="w-full px-3 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all" />
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <div className="w-1/2">
                  <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">Age</label>
                  <input value={formData.Age} onChange={e => setFormData(f => ({ ...f, Age: e.target.value }))} type="text" required className="w-full px-3 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all" />
                </div>
                <div className="w-1/2">
                  <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">Adress</label>
                  <input value={formData.adress} onChange={e => setFormData(f => ({ ...f, adress: e.target.value }))} type="text" className="w-full px-3 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all" />
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <div className="w-1/2">
                  <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">Phone</label>
                  <input value={formData.phone} onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))} type="number" className="w-full px-3 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all" />
                </div>
                <div className="w-1/2">
                  <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">Prent</label>
                  <input value={formData.Prent} onChange={e => setFormData(f => ({ ...f, Prent: e.target.value }))} type="text" className="w-full px-3 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all" />
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <div className="w-1/2">
                  <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">Pr_PHONE</label>
                  <input value={formData.Pr_PHONE} onChange={e => setFormData(f => ({ ...f, Pr_PHONE: e.target.value }))} type="number" className="w-full px-3 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all" />
                </div>
                <div className="w-1/2">
                  <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">Gender</label>
                  <select value={formData.Gender} onChange={e => setFormData(f => ({ ...f, Gender: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all">
                    <option value="">Select Gender</option>
                    <option value="male">male</option>
                    <option value="female">female</option>
                  </select>
                </div>
              </div>
              {/* Select Class Dropdown */}
              <div className="mb-3">
                <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">Class</label>
                <select
                  value={formData.classId}
                  onChange={e => {
                    const selectedId = e.target.value;
                    setFormData(f => ({
                      ...f,
                      classId: selectedId,
                      className: classes.find(cls => cls._id === selectedId)?.className || ""
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all"
                >
                  <option value="">Select Class</option>
                  {classes.filter(cls => cls.isActive !== false).map(cls => (
                    <option key={cls._id} value={cls._id}>
                      {cls.className}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">Status</label>
                <select value={formData.isActive} onChange={e => setFormData(f => ({ ...f, isActive: e.target.value === 'true' }))} className="w-full px-3 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all">
                  <option value={true}>Active</option>
                  <option value={false}>Not Active</option>
                </select>
              </div>
              <div className="flex gap-2 mt-3">
                <button type="submit" className="w-full px-2 py-2 rounded-lg border-none bg-gradient-to-r from-indigo-400 to-indigo-600 text-[#18182f] text-lg font-bold cursor-pointer hover:from-indigo-500 hover:to-indigo-700 shadow-md transition-all duration-200">{editId ? "Update" : "Save"}</button>
                <button type="button" onClick={() => setIsclose(false)} className="w-full px-2 py-2 rounded-lg border-none bg-gray-600 text-[#18182f] text-lg font-bold cursor-pointer hover:bg-gray-700 shadow-md transition-all duration-200">Cancel</button>
              </div>
            </form>
            <button onClick={() => setIsclose(false)} className="absolute top-3 right-4 text-[#00bcd4] text-2xl hover:text-red-400 transition-colors">&times;</button>
          </div>
        </div>
      )}
      <input 
        className="px-8 py-2 rounded-lg ml-32 outline-none border-2 border-indigo-200 focus:border-indigo-500 transition-colors duration-200" 
        placeholder="Search" 
        type="search" 
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <Table className="w-[50%] mt-6 shadow-lg rounded-lg overflow-hidden">
        <TableHeader className="bg-indigo-600 ">
          <TableRow>
            <TableHead className="text-white">StudentID</TableHead>
            <TableHead className="text-white px-10">FullName</TableHead>
            <TableHead className="text-white px-10">Age</TableHead>
            <TableHead className="text-white">adress</TableHead>
            <TableHead className="text-white">phone</TableHead>
            <TableHead className="text-white">Gender</TableHead>
            <TableHead className="text-white">prents</TableHead>
            <TableHead className="text-white">Pr_PHONE</TableHead>
            <TableHead className="text-white">classId</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-white">options</TableHead>
            <TableHead className="text-white">Options</TableHead>
          </TableRow>
        </TableHeader>
        {filteredData.map((item) => (
          <TableBody className="bg-white" key={item._id}>
            <TableRow className="text-center hover:bg-indigo-50 transition-colors duration-200">
              <TableCell>{item.StudentId}</TableCell>
              <TableCell>{item.FullName}</TableCell>
              <TableCell>{item.Age}</TableCell>
              <TableCell>{item.adress}</TableCell>
              <TableCell>{item.phone}</TableCell>
              <TableCell>{item.Gender}</TableCell>
              <TableCell>{item.Prent}</TableCell>
              <TableCell>{item.Pr_PHONE}</TableCell>
              <TableCell>{item.class?.className}</TableCell>
              <TableCell>
                <span 
                  className={`px-2 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                    item.isActive 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                  onClick={() => toggleActiveStatus(item._id, item.isActive)}
                  title="Click to toggle status"
                >
                  {item.isActive ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell className="flex gap-2">
                <i onClick={() => handleEdit(item)} className="fa-solid text-green-600 hover:text-green-800 fa-edit cursor-pointer"></i>
                <i className="text-blue-700 mt-1 fa-solid fa-book" onClick={() => handleShowInfo(item)} style={{cursor:'pointer'}}></i>
              </TableCell>
              <TableCell>
                <i onClick={() => handleDeleteData(item._id)} className="fa-solid text-red-600 hover:text-red-800 fa-trash cursor-pointer"></i>
              </TableCell>
            </TableRow>
          </TableBody>
        ))}
      </Table>

    </div>
    {/* Student Info Modal */}
    {isInfoOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
        <div className="bg-white w-[350px] p-6 rounded-2xl shadow-2xl border border-blue-400 relative animate-fadeIn backdrop-blur-md">
          <h2 className="text-center text-blue-600 text-2xl font-bold mb-4">Student Info</h2>
          <div className="mb-2">
            <span className="font-semibold">Name:</span> {selectedStudent?.FullName}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Student ID:</span> {selectedStudent?.StudentId}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Class:</span> {selectedStudent?.class?.className}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Attendance:</span><br/>
            {attendanceInfo ? (
              attendanceInfo.error ? (
                <span className="text-red-500">{attendanceInfo.error}</span>
              ) : (
                <>
                  <span className="text-green-700">Present: {attendanceInfo.presentCount ?? '-'}</span><br/>
                  <span className="text-red-700">Absent: {attendanceInfo.absentCount ?? '-'}</span>
                </>
              )
            ) : (
              <span>Loading...</span>
            )}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Finance:</span><br/>
            {financeInfo ? (
              financeInfo.error ? (
                <span className="text-red-500">{financeInfo.error}</span>
              ) : (
                <>
                  <span className="text-blue-700">Bills Paid: {financeInfo.billsPaid ?? '-'}</span><br/>
                  <span className="text-blue-700">Years Paid: {financeInfo.yearsPaid ?? '-'}</span>
                </>
              )
            ) : (
              <span>Loading...</span>
            )}
          </div>
          <button onClick={() => setIsInfoOpen(false)} className="absolute top-3 right-4 text-blue-600 text-2xl hover:text-red-400 transition-colors">&times;</button>
        </div>
      </div>
    )}
  </>;
};

export default Student;