import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import Dashbourd from "../components/Dashbourd";
import axios from "axios";
import { useEffect, useState } from "react";

const FinanceRead = () => {
  const [financeData, setFinanceData] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all"); // all, paid, unpaid
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedFeeType, setSelectedFeeType] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Read all finance records
  const handleReadData = () => {
    axios.get("http://localhost:3000/read/Finance").then((res) => {
      setFinanceData(res.data);
    }).catch(error => console.log(error));
  };

  // Read all students and classes
  useEffect(() => {
    handleReadData();
    axios.get('http://localhost:3000/read/Student')
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
    
    axios.get('http://localhost:3000/read/class')
      .then((response) => {
        setClasses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
      });
  }, []);

  // Get students with their payment status
  const getStudentsWithPaymentStatus = () => {
    const studentsWithPayments = students.map(student => {
      // Find all finance records for this student
      const studentPayments = financeData.filter(payment => 
        payment.studentId === student.StudentId || 
        payment.studentName === student.FullName
      );

      // Calculate total fees and paid amounts
      const totalFees = studentPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
      const paidAmount = studentPayments
        .filter(payment => payment.paymentStatus === 'paid')
        .reduce((sum, payment) => sum + (payment.amount || 0), 0);
      
      const unpaidAmount = totalFees - paidAmount;
      const paymentStatus = totalFees > 0 ? (paidAmount >= totalFees ? 'paid' : 'unpaid') : 'no_fees';

      return {
        ...student,
        totalFees,
        paidAmount,
        unpaidAmount,
        paymentStatus,
        lastPaymentDate: studentPayments
          .filter(p => p.paymentStatus === 'paid')
          .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))[0]?.paymentDate || null
      };
    });

    return studentsWithPayments;
  };

  // Filter and search students
  const filteredStudents = getStudentsWithPaymentStatus().filter(student => {
    // Status filter
    const matchesStatus = 
      filterStatus === 'all' ? true :
      filterStatus === 'paid' ? student.paymentStatus === 'paid' :
      filterStatus === 'unpaid' ? student.paymentStatus === 'unpaid' :
      filterStatus === 'no_fees' ? student.paymentStatus === 'no_fees' : true;

    // Class filter
    const matchesClass = selectedClass ? student.class?._id === selectedClass : true;

    // Fee type filter (if student has payments of that type)
    const matchesFeeType = selectedFeeType ? 
      financeData.some(payment => 
        (payment.studentId === student.StudentId || payment.studentName === student.FullName) &&
        payment.feeType === selectedFeeType
      ) : true;

    // Month filter (if selected)
    const matchesMonth = selectedMonth ? financeData.some(payment => {
      const isThisStudent = payment.studentId === student.StudentId || payment.studentName === student.FullName;
      if (!isThisStudent || !payment.paymentDate) return false;
      const month = new Date(payment.paymentDate).toLocaleString('en-US', { month: '2-digit' });
      return month === selectedMonth;
    }) : true;

    // Year filter (if selected)
    const matchesYear = selectedYear ? financeData.some(payment => {
      const isThisStudent = payment.studentId === student.StudentId || payment.studentName === student.FullName;
      if (!isThisStudent || !payment.paymentDate) return false;
      const year = new Date(payment.paymentDate).getFullYear().toString();
      return year === selectedYear;
    }) : true;

    // Search filter
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      student.FullName?.toLowerCase().includes(search) ||
      student.StudentId?.toString().includes(search) ||
      student.class?.className?.toLowerCase().includes(search);

    // Hide students whose class is inactive
    const classIsActive = student.class?.isActive !== false;
    // Hide students who are not active
    const studentIsActive = student.isActive === true;

    return matchesStatus && matchesClass && matchesFeeType && matchesMonth && matchesYear && matchesSearch && classIsActive && studentIsActive;
  });

  // Calculate summary statistics
  const totalStudents = filteredStudents.length;
  const paidStudents = filteredStudents.filter(s => s.paymentStatus === 'paid').length;
  const unpaidStudents = filteredStudents.filter(s => s.paymentStatus === 'unpaid').length;
  const noFeesStudents = filteredStudents.filter(s => s.paymentStatus === 'no_fees').length;
  
  const totalFees = filteredStudents.reduce((sum, s) => sum + s.totalFees, 0);
  const totalPaid = filteredStudents.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalUnpaid = filteredStudents.reduce((sum, s) => sum + s.unpaidAmount, 0);

  return (
    <>
      <Dashbourd isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 min-h-screen p-6 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-[20%]'}`}>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Payments</h1>
          <p className="text-gray-600">View students who have paid and those who have not paid</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border-2 border-blue-700 px-4 py-2 rounded-lg"
            >
              <option value="all">All Students</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="no_fees">No Fees</option>
            </select>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border-2 border-blue-700 px-4 py-2 rounded-lg"
            >
              <option value="">All Classes</option>
              {classes.filter(cls => cls.isActive !== false).map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.className}
                </option>
              ))}
            </select>

            <select
              value={selectedFeeType}
              onChange={(e) => setSelectedFeeType(e.target.value)}
              className="border-2 border-blue-700 px-4 py-2 rounded-lg"
            >
              <option value="">All Fee Types</option>
              <option value="tuition">Tuition</option>
              <option value="library">Library</option>
              <option value="laboratory">Laboratory</option>
              <option value="transportation">Transportation</option>
              <option value="examination">Examination</option>
              <option value="other">Other</option>
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border-2 border-blue-700 px-4 py-2 rounded-lg"
            >
              <option value="">All Months</option>
              <option value="01">January</option>
              <option value="02">February</option>
              <option value="03">March</option>
              <option value="04">April</option>
              <option value="05">May</option>
              <option value="06">June</option>
              <option value="07">July</option>
              <option value="08">August</option>
              <option value="09">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border-2 border-blue-700 px-4 py-2 rounded-lg"
            >
              <option value="">All Years</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
              <option value="2029">2029</option>
              <option value="2030">2030</option>
              <option value="2031">2031</option>
              <option value="2032">2032</option>
              <option value="2033">2033</option>
              <option value="2034">2034</option>
              <option value="2035">2035</option>
              <option value="2036">2036</option>
            </select>

            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-2 border-blue-700 px-4 py-2 rounded-lg"
            />

            <button
              onClick={() => {
                setFilterStatus("all");
                setSelectedClass("");
                setSelectedFeeType("");
                setSelectedMonth("");
                setSelectedYear("");
                setSearchTerm("");
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-600">Total Students</h3>
            <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-600">Paid</h3>
            <p className="text-2xl font-bold text-green-600">{paidStudents}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
            <h3 className="text-sm font-medium text-gray-600">Unpaid</h3>
            <p className="text-2xl font-bold text-red-600">{unpaidStudents}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
            <h3 className="text-sm font-medium text-gray-600">No Fees</h3>
            <p className="text-2xl font-bold text-yellow-600">{noFeesStudents}</p>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-indigo-500">
            <h3 className="text-sm font-medium text-gray-600">Total Fees</h3>
            <p className="text-2xl font-bold text-indigo-600">${totalFees.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-600">Total Paid</h3>
            <p className="text-2xl font-bold text-green-600">${totalPaid.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
            <h3 className="text-sm font-medium text-gray-600">Total Unpaid</h3>
            <p className="text-2xl font-bold text-red-600">${totalUnpaid.toLocaleString()}</p>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-50">
                <TableHead className="font-semibold">Student ID</TableHead>
                <TableHead className="font-semibold">Student Name</TableHead>
                <TableHead className="font-semibold">Class</TableHead>
                <TableHead className="font-semibold">Total Fees</TableHead>
                <TableHead className="font-semibold">Paid</TableHead>
                <TableHead className="font-semibold">Unpaid</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Last Payment Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student._id} className="hover:bg-gray-50">
                  <TableCell>{student.StudentId}</TableCell>
                  <TableCell className="font-medium">{student.FullName}</TableCell>
                  <TableCell>{student.class?.className || "N/A"}</TableCell>
                  <TableCell className="font-semibold">${student.totalFees.toLocaleString()}</TableCell>
                  <TableCell className="text-green-600 font-semibold">${student.paidAmount.toLocaleString()}</TableCell>
                  <TableCell className="text-red-600 font-semibold">${student.unpaidAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      student.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      student.paymentStatus === 'unpaid' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.paymentStatus === 'paid' ? 'Paid' :
                       student.paymentStatus === 'unpaid' ? 'Unpaid' :
                       'No Fees'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {student.lastPaymentDate ? 
                      new Date(student.lastPaymentDate).toLocaleDateString() : 
                      "No payment made"
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* No Results Message */}
        {filteredStudents.length === 0 && (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-lg">No students found for the selected filter</p>
          </div>
        )}
      </div>
    </>
  );
};

export default FinanceRead;
