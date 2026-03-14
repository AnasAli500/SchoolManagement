import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import Dashbourd from "../components/Dashbourd";
import axios from "axios";
import { useEffect, useState } from "react";

const Finance = () => {
  const [getData, setData] = useState([]);
  const [isclose, setIsclose] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(null); // { type: 'create' | 'update' | 'delete' | 'status' }
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    feeType: "tuition",
    amount: "",
    dueDate: "",
    paymentDate: "",
    paymentStatus: "pending",
    paymentMethod: "",
    description: "",
    classId: "",
    className: ""
  });
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  // Read all finance records
  const handleReadData = () => {
    axios.get("http://localhost:3000/read/Finance").then((res) => {
      setData(res.data);
    }).catch(error => console.log(error));
  };

  // Read all classes and students
  useEffect(() => {
    handleReadData();
    axios.get('http://localhost:3000/read/class')
      .then((response) => {
        setClasses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
      });
    
    axios.get('http://localhost:3000/read/Student')
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  }, []);

  // Filter students by selected class
  const getStudentsByClass = (classId) => {
    return students.filter(student => student.class?._id === classId && student.isActive === true);
  };

  // Handle class selection and populate students
  const handleClassChange = (classId) => {
    const selectedClass = classes.find(cls => cls._id === classId);
    setFormData(f => ({
      ...f,
      classId: classId,
      className: selectedClass?.className || ""
    }));
  };

  // Open modal for create
  const HandleClick = () => {
    setFormData({
      studentId: "",
      studentName: "",
      feeType: "tuition",
      amount: "",
      dueDate: "",
      paymentDate: "",
      paymentStatus: "pending",
      paymentMethod: "",
      description: "",
      classId: "",
      className: ""
    });
    setEditId(null);
    setIsclose(true);
  };

  // Open modal for edit
  const handleEdit = (finance) => {
    setFormData({
      studentId: finance.studentId || "",
      studentName: finance.studentName || "",
      feeType: finance.feeType || "tuition",
      amount: finance.amount || "",
      dueDate: finance.dueDate ? new Date(finance.dueDate).toISOString().split('T')[0] : "",
      paymentDate: finance.paymentDate ? new Date(finance.paymentDate).toISOString().split('T')[0] : "",
      paymentStatus: finance.paymentStatus || "pending",
      paymentMethod: finance.paymentMethod || "",
      description: finance.description || "",
      classId: finance.class?._id || "",
      className: finance.class?.className || ""
    });
    setEditId(finance._id);
    setIsclose(true);
  };

  // Create or update finance record
  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedClassObj = classes.find(cls => cls._id === formData.classId);
    if (selectedClassObj && selectedClassObj.isActive === false) {
      alert("Cannot create finance for an inactive class!");
      return;
    }
    const selectedStudentObj = students.find(stu => stu.StudentId === formData.studentId || stu.FullName === formData.studentName);
    if (selectedStudentObj && selectedStudentObj.isActive === false) {
      alert("Cannot create finance for an inactive student!");
      return;
    }
    const payload = {
      ...formData,
      class: {
        _id: formData.classId,
        className: formData.className,
      },
    };
    
    if (editId) {
      axios.put(`http://localhost:3000/update/Finance/${editId}`, payload)
        .then(() => {
          setShowSuccess({ type: 'update' });
          setTimeout(() => setShowSuccess(null), 1800);
          setIsclose(false);
          setEditId(null);
          handleReadData();
        })
        .catch((error) => console.log(error));
    } else {
      axios.post("http://localhost:3000/create/Finance", payload)
        .then(() => {
          setShowSuccess({ type: 'create' });
          setTimeout(() => setShowSuccess(null), 1800);
          setIsclose(false);
          handleReadData();
        })
        .catch((error) => console.log(error));
    }
  };

  // Delete finance record
  const handleDeleteData = (id) => {
    axios.delete(`http://localhost:3000/delete/Finance/${id}`)
      .then(() => {
        setShowSuccess({ type: 'delete' });
        setTimeout(() => setShowSuccess(null), 1800);
        handleReadData();
      })
      .catch((error) => console.log(error));
  };

  // Update payment status
  const updatePaymentStatus = (id, newStatus) => {
    const updateData = { paymentStatus: newStatus };
    if (newStatus === 'paid') {
      updateData.paymentDate = new Date().toISOString();
    }
    
    axios.put(`http://localhost:3000/update/Finance/${id}`, updateData)
      .then(() => {
        setShowSuccess({ type: 'status' });
        setTimeout(() => setShowSuccess(null), 1800);
        handleReadData();
      })
      .catch((error) => console.log(error));
  };

  // Filter and search
  const filteredData = getData.filter(item => {
    const matchesStatus = filterStatus ? item.paymentStatus === filterStatus : true;
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      item.studentName?.toLowerCase().includes(search) ||
      item.studentId?.toString().includes(search) ||
      item.feeType?.toLowerCase().includes(search) ||
      item.amount?.toString().includes(search) ||
      item.paymentStatus?.toLowerCase().includes(search) ||
      item.class?.className?.toLowerCase().includes(search);
    return matchesStatus && matchesSearch;
  });

  // Calculate totals
  const totalAmount = filteredData.reduce((sum, item) => sum + (item.amount || 0), 0);
  const paidAmount = filteredData.filter(item => item.paymentStatus === 'paid').reduce((sum, item) => sum + (item.amount || 0), 0);
  const pendingAmount = filteredData.filter(item => item.paymentStatus === 'pending').reduce((sum, item) => sum + (item.amount || 0), 0);
  const overdueAmount = filteredData.filter(item => item.paymentStatus === 'overdue').reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <>
      <style>{`
        @keyframes dash { to { stroke-dashoffset: 0; } }
        .checkmark-path { stroke-dasharray: 60; stroke-dashoffset: 60; animation: dash 600ms ease forwards; }
      `}</style>
      <Dashbourd isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`bg-gradient-to-r from-green-50 to-emerald-50 min-h-screen p-6 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-[20%]'}`}>
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
        <div className="flex justify-between items-center mb-6">
          <button onClick={HandleClick} className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3 rounded-2xl text-white transition-colors duration-200">
            + Add Finance Record
          </button>
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border-2 border-emerald-700 px-4 py-2 rounded-lg"
            >
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="partial">Partial</option>
            </select>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-2 border-emerald-700 px-4 py-2 rounded-lg"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-emerald-500">
            <h3 className="text-sm font-medium text-gray-600">Total Amount</h3>
            <p className="text-2xl font-bold text-emerald-600">${totalAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-600">Paid</h3>
            <p className="text-2xl font-bold text-green-600">${paidAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
            <h3 className="text-sm font-medium text-gray-600">Pending</h3>
            <p className="text-2xl font-bold text-yellow-600">${pendingAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
            <h3 className="text-sm font-medium text-gray-600">Overdue</h3>
            <p className="text-2xl font-bold text-red-600">${overdueAmount.toLocaleString()}</p>
          </div>
        </div>

        {/* Finance Records Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-emerald-50">
                <TableHead className="font-semibold">Student ID</TableHead>
                <TableHead className="font-semibold">Student Name</TableHead>
                <TableHead className="font-semibold">Class</TableHead>
                <TableHead className="font-semibold">Fee Type</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Due Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Payment Date</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item._id} className="hover:bg-gray-50">
                  <TableCell>{item.studentId}</TableCell>
                  <TableCell>{item.studentName}</TableCell>
                  <TableCell>{item.class?.className || "N/A"}</TableCell>
                  <TableCell className="capitalize">{item.feeType}</TableCell>
                  <TableCell className="font-semibold">${item.amount?.toLocaleString()}</TableCell>
                  <TableCell>{new Date(item.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      item.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      item.paymentStatus === 'overdue' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {item.paymentStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    {item.paymentDate ? new Date(item.paymentDate).toLocaleDateString() : "Not paid"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteData(item._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                      {item.paymentStatus !== 'paid' && (
                        <button
                          onClick={() => updatePaymentStatus(item._id, 'paid')}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Modal for create/update */}
        {isclose && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-[#18182f] w-[400px] p-6 rounded-2xl shadow-2xl border border-[#00bcd4] relative animate-fadeIn backdrop-blur-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-center text-[#00bcd4] text-3xl font-bold mb-6 tracking-wide drop-shadow">
                {editId ? "Update" : "Create"} Finance Record
              </h2>
              <p className="text-center text-[#00bcd4] text-sm mb-4">
                Dooro class-ka marka hore, kadibna dooro ardayga
              </p>
              <form onSubmit={handleSubmit}>
                <div className="flex gap-2 mb-3">
                  <div className="w-1/2">
                    <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">Student ID</label>
                    <input 
                      value={formData.studentId} 
                      onChange={e => {
                        const id = e.target.value;
                        // Raadi ardayga ID-gaas leh
                        const foundStudent = students.find(student => String(student.StudentId) === String(id));
                        setFormData(f => ({
                          ...f,
                          studentId: id,
                          studentName: foundStudent ? foundStudent.FullName : ""
                        }));
                      }} 
                      type="number" 
                      className="w-full px-3 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all" 
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">Student Name</label>
                    <select
                      value={formData.studentName}
                      onChange={(e) => {
                        const selectedStudent = students.find(student => student.FullName === e.target.value);
                        setFormData(f => ({
                          ...f,
                          studentId: selectedStudent?.StudentId || "",
                          studentName: e.target.value
                        }));
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all"
                      disabled={!formData.classId}
                    >
                      <option value="">
                        {formData.classId ? "Select Student" : "Dooro class-ka marka hore"}
                      </option>
                      {formData.classId && getStudentsByClass(formData.classId).map((student) => (
                        <option key={student._id} value={student.FullName}>
                          {student.FullName} (ID: {student.StudentId})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 mb-3">
                  <div className="w-1/2">
                    <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">Fee Type</label>
                    <select 
                      value={formData.feeType} 
                      onChange={e => setFormData(f => ({ ...f, feeType: e.target.value }))} 
                      className="w-full px-3 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all"
                    >
                      <option value="tuition">Tuition</option>
                      <option value="library">Library</option>
                      <option value="laboratory">Laboratory</option>
                      <option value="transportation">Transportation</option>
                      <option value="examination">Examination</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">Amount</label>
                    <input 
                      value={formData.amount} 
                      onChange={e => setFormData(f => ({ ...f, amount: e.target.value }))} 
                      type="number" 
                      step="0.01"
                      className="w-full px-3 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all" 
                    />
                  </div>
                </div>

                <div className="flex gap-2 mb-3">
                  <div className="w-1/2">
                    <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">Due Date</label>
                    <input 
                      value={formData.dueDate} 
                      onChange={e => setFormData(f => ({ ...f, dueDate: e.target.value }))} 
                      type="date" 
                      className="w-full px-3 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all" 
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">Payment Date</label>
                    <input 
                      value={formData.paymentDate} 
                      onChange={e => setFormData(f => ({ ...f, paymentDate: e.target.value }))} 
                      type="date" 
                      className="w-full px-3 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all" 
                    />
                  </div>
                </div>

                <div className="flex gap-2 mb-3">
                  <div className="w-1/2">
                    <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">Payment Status</label>
                    <select 
                      value={formData.paymentStatus} 
                      onChange={e => setFormData(f => ({ ...f, paymentStatus: e.target.value }))} 
                      className="w-full px-3 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                      <option value="partial">Partial</option>
                    </select>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">Payment Method</label>
                    <select 
                      value={formData.paymentMethod} 
                      onChange={e => setFormData(f => ({ ...f, paymentMethod: e.target.value }))} 
                      className="w-full px-3 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all"
                    >
                      <option value="">Select Method</option>
                      <option value="cash">Cash</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="check">Check</option>
                      <option value="online">Online</option>
                      <option value="card">Card</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">Class</label>
                  <select
                    value={formData.classId}
                    onChange={e => handleClassChange(e.target.value)}
                    className="border-2 border-emerald-700 px-4 py-2 rounded-lg"
                  >
                    <option value="">Select Class</option>
                    {classes.filter(cls => cls.isActive !== false).map(cls => (
                      <option key={cls._id} value={cls._id}>{cls.className}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">Description</label>
                  <textarea 
                    value={formData.description} 
                    onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} 
                    rows="3"
                    className="w-full px-3 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all" 
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-[#00bcd4] hover:bg-[#0097a7] text-white py-3 rounded-lg font-semibold transition-colors duration-200"
                  >
                    {editId ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsclose(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Finance;
