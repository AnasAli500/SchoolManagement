import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import Dashbourd from "../components/Dashbourd";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Class = () => {
  const [getData, setData] = useState([]);
  const [isclose, setIsclose] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    classId: "",
    className: "",
    isActive: true
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null); // { type: 'create' | 'update' | 'delete' | 'status' }

  // Read all classes
  const handleRaedData = () => {
    axios.get("https://schoolmanagement-backend-6qtd.onrender.com/read/class").then((res) => {
      setData(res.data);
    }).catch(error => console.log(error));
  };

  useEffect(() => {
    handleRaedData();
  }, []);

  // Open modal for create
  const HandleClick = () => {
    setFormData({
      classId: "",
      className: "",
      isActive: true
    });
    setEditId(null);
    setIsclose(true);
  };

  // Open modal for edit
  const handleEdit = (cls) => {
    setFormData({
      classId: cls.classId || "",
      className: cls.className || "",
      isActive: cls.isActive !== undefined ? cls.isActive : true
    });
    setEditId(cls._id);
    setIsclose(true);
  };

  // Create or update class
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      axios.put(`https://schoolmanagement-backend-6qtd.onrender.com/update/class/${editId}`, formData)
        .then(() => {
          setShowSuccess({ type: 'update' });
          setTimeout(() => setShowSuccess(null), 1800);
          setIsclose(false);
          setEditId(null);
          handleRaedData();
        })
        .catch((error) => console.log(error));
    } else {
      axios.post("https://schoolmanagement-backend-6qtd.onrender.com/Create/Class", formData)
        .then(() => {
          setShowSuccess({ type: 'create' });
          setTimeout(() => setShowSuccess(null), 1800);
          setIsclose(false);
          handleRaedData();
        })
        .catch((error) => console.log(error));
    }
  };

  // Delete class
  const handleDeleteData = (id) => {
    axios.delete(`https://schoolmanagement-backend-6qtd.onrender.com/delete/class/${id}`)
      .then(() => {
        setShowSuccess({ type: 'delete' });
        setTimeout(() => setShowSuccess(null), 1800);
        handleRaedData();
      })
      .catch((error) => console.log(error));
  };

  // Toggle active status
  const toggleActiveStatus = (id, currentStatus) => {
    axios.put(`https://schoolmanagement-backend-6qtd.onrender.com/update/class/${id}`, { isActive: !currentStatus })
      .then(() => {
        setShowSuccess({ type: 'status' });
        setTimeout(() => setShowSuccess(null), 1800);
        handleRaedData();
      })
      .catch((error) => console.log(error));
  };

  return <>
    <style>{`
      @keyframes dash { to { stroke-dashoffset: 0; } }
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
      <button onClick={HandleClick} className="bg-orange-500 hover:bg-orange-500 px-8 py-3 rounded-2xl mt-2 text-white transition-colors duration-200">+ Add Class</button>
      <input className="px-8 py-2 rounded-lg ml-96 outline-none border-2 border-orange-200 focus:border-orange-200 transition-colors duration-200" placeholder="Search" type="search" />
      {/* Modal for create/update */}
      {isclose && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-[#18182f] w-[320px] p-6 rounded-2xl shadow-2xl border border-[#ff9800] relative animate-fadeIn backdrop-blur-md">
            <h2 className="text-center text-[#ff9800] text-3xl font-bold mb-6 tracking-wide drop-shadow">{editId ? "Update" : "Create"} Class</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-xs font-semibold mb-1 text-[#ff9800]">ClassId</label>
                <input value={formData.classId} onChange={e => setFormData(f => ({ ...f, classId: e.target.value }))} type="text" className="w-full px-3 py-2 rounded-lg border border-[#ff9800] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#ff9800] transition-all" />
              </div>
              <div className="mb-6">
                <label className="block text-xs font-semibold mb-1 text-[#ff9800]">ClassName</label>
                <input value={formData.className} onChange={e => setFormData(f => ({ ...f, className: e.target.value }))} type="text" className="w-full px-3 py-2 rounded-lg border border-[#ff9800] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#ff9800] transition-all" />
              </div>
              <div className="mb-6">
                <label className="block text-xs font-semibold mb-1 text-[#ff9800]">Status</label>
                <select value={formData.isActive} onChange={e => setFormData(f => ({ ...f, isActive: e.target.value === 'true' }))} className="w-full px-3 py-2 rounded-lg border border-[#ff9800] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#ff9800] transition-all">
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
              <div className="flex gap-2 mt-6">
                <button type="submit" className="w-full px-2 py-2 rounded-lg border-none bg-gradient-to-r from-orange-400 to-orange-600 text-[#18182f] text-lg font-bold cursor-pointer hover:from-orange-500 hover:to-orange-700 shadow-md transition-all duration-200">{editId ? "Update" : "Save"}</button>
                <button type="button" onClick={() => setIsclose(false)} className="w-full px-2 py-2 rounded-lg border-none bg-gray-600 text-[#18182f] text-lg font-bold cursor-pointer hover:bg-gray-700 shadow-md transition-all duration-200">Cancel</button>
              </div>
            </form>
            <button onClick={() => setIsclose(false)} className="absolute top-3 right-4 text-[#ff9800] text-2xl hover:text-red-400 transition-colors">&times;</button>
          </div>
        </div>
      )}
      <Table className="w-[50%] mt-6 shadow-lg rounded-lg overflow-hidden">
        <TableHeader className="bg-orange-500">
          <TableRow>
            <TableHead className="text-white">ClassID</TableHead>
            <TableHead className="text-white">ClassName</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-white">Options</TableHead>
            <TableHead className="text-white">Options</TableHead>
          </TableRow>
        </TableHeader>
        {getData.map((item) => (
          <TableBody className="bg-white" key={item._id}>
            <TableRow className="text-center hover:bg-indigo-50 transition-colors duration-200">
              <TableCell>{item.classId}</TableCell>
              <TableCell>{item.className}</TableCell>
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
              <TableCell>
                <i onClick={() => handleEdit(item)} className="fa-solid text-green-600 hover:text-green-800 fa-edit cursor-pointer"></i>
              </TableCell>
              <TableCell>
                <i onClick={() => handleDeleteData(item._id)} className="fa-solid text-red-600 hover:text-red-800 fa-trash cursor-pointer"></i>
              </TableCell>
            </TableRow>
          </TableBody>
        ))}
      </Table>
    </div>
  </>;
};

export default Class;