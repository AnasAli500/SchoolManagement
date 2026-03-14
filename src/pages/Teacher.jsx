import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import Dashbourd from "../components/Dashbourd";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Teacher = () => {
  const [getData, setData] = useState([]);
  const [isclose, setIsclose] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    TeacherId: "",
    FullName: "",
    adress: "",
    phone: "",
    Gender: "",
    Period: "",
    className: "",
    classId: "",
    image: ""
  });
  const [classes, setClasses] = useState([]);
  const [periods, setPeriods] = useState([]);
  const Navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null); // { type: 'create' | 'update' | 'delete' }

  // Read all teachers
  const handleRaedData = () => {
    axios.get("http://localhost:3000/read/Teacher").then((res) => {
      setData(res.data);
    }).catch(error => console.log(error));
  };

  // Read all classes and periods
  useEffect(() => {
    handleRaedData();
    axios.get("http://localhost:3000/read/Class")
      .then((res) => setClasses(res.data))
      .catch((error) => console.log(error));
    axios.get("http://localhost:3000/period")
      .then((res) => setPeriods(res.data))
      .catch((error) => console.log(error));
  }, []);

  // Open modal for create
  const HandleClick = () => {
    setFormData({
      TeacherId: "",
      FullName: "",
      adress: "",
      phone: "",
      Gender: "",
      Period: "",
      className: "",
      classId: "",
      image: ""
    });
    setEditId(null);
    setIsclose(true);
  };

  // Open modal for edit
  const handleEdit = (teacher) => {
    setFormData({
      TeacherId: teacher.TeacherId || "",
      FullName: teacher.FullName || "",
      adress: teacher.adress || "",
      phone: teacher.phone || "",
      Gender: teacher.Gender || "",
      Period: teacher.Period || "",
      className: teacher.class?.className || "",
      classId: teacher.class?._id || "",
      image: teacher.image || ""
    });
    setEditId(teacher._id);
    setIsclose(true);
  };

  // Create or update teacher
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      class: {
        _id: formData.classId,
        className: formData.className,
      },
      image: formData.image
    };
    if (editId) {
      axios.put(`http://localhost:3000/update/Teacher/${editId}`, payload)
        .then(() => {
          setShowSuccess({ type: 'update' });
          setTimeout(() => setShowSuccess(null), 1800);
          setIsclose(false);
          setEditId(null);
          handleRaedData();
        })
        .catch((error) => console.log(error));
    } else {
      axios.post("http://localhost:3000/create/Teacher", payload)
        .then(() => {
          setShowSuccess({ type: 'create' });
          setTimeout(() => setShowSuccess(null), 1800);
          setIsclose(false);
          handleRaedData();
        })
        .catch((error) => console.log(error));
    }
  };

  // Delete teacher
  const handleDeleteData = (id) => {
    axios.delete(`http://localhost:3000/delete/Teacher/${id}`)
      .then(() => {
        setShowSuccess({ type: 'delete' });
        setTimeout(() => setShowSuccess(null), 1800);
        handleRaedData();
      })
      .catch((error) => console.log(error));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(f => ({ ...f, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
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
      <button onClick={HandleClick} className="bg-green-500 hover:bg-green-500 px-8 py-3 rounded-2xl mt-2 text-white transition-colors duration-200">+ Add Teacher</button>
      {/* Modal for create/update */}
      {isclose && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-[#18182f] w-[320px] p-6 rounded-2xl shadow-2xl border border-[#00bcd4] relative animate-fadeIn backdrop-blur-md">
            <h2 className="text-center text-[#00bcd4] text-3xl font-bold mb-6 tracking-wide drop-shadow">{editId ? "Update" : "Create"} Teacher</h2>
            <form onSubmit={handleSubmit}>
              <div className="flex gap-2 mb-3">
                <div className="w-1/2">
                  <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">TeacherId</label>
                  <input value={formData.TeacherId} onChange={e => setFormData(f => ({ ...f, TeacherId: e.target.value }))} type="number" className="w-full px-3 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all" />
                </div>
                <div className="w-1/2">
                  <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">FullName</label>
                  <input value={formData.FullName} onChange={e => setFormData(f => ({ ...f, FullName: e.target.value }))} type="text" className="w-full px-3 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all" />
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-3 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all" />
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="w-16 h-16 rounded-full mt-2 mx-auto" />
                )}
              </div>
              <div className="flex gap-2 mb-3">
                <div className="w-1/2">
                  <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">Adress</label>
                  <input value={formData.adress} onChange={e => setFormData(f => ({ ...f, adress: e.target.value }))} type="text" className="w-full px-3 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all" />
                </div>
                <div className="w-1/2">
                  <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">Phone</label>
                  <input value={formData.phone} onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))} type="number" className="w-full px-3 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all" />
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <div className="w-1/2">
                  <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">Gender</label>
                  <select value={formData.Gender} onChange={e => setFormData(f => ({ ...f, Gender: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all">
                    <option value="">Select Gender</option>
                    <option value="male">male</option>
                    <option value="female">female</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="block text-xs font-semibold mb-1 text-[#00bcd4]">Period</label>
                  <select value={formData.Period} onChange={e => setFormData(f => ({ ...f, Period: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all">
                    <option value="">Select Period</option>
                    {periods.map((p) => (
                      <option key={p._id} value={p.periodName}>{p.periodName}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4">
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
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>{cls.className}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 mt-3">
                <button type="submit" className="w-full px-2 py-2 rounded-lg border-none bg-gradient-to-r from-cyan-400 to-cyan-600 text-[#18182f] text-lg font-bold cursor-pointer hover:from-cyan-500 hover:to-cyan-700 shadow-md transition-all duration-200">{editId ? "Update" : "Save"}</button>
                <button type="button" onClick={() => setIsclose(false)} className="w-full px-2 py-2 rounded-lg border-none bg-gray-600 text-[#18182f] text-lg font-bold cursor-pointer hover:bg-gray-700 shadow-md transition-all duration-200">Cancel</button>
              </div>
            </form>
            <button onClick={() => setIsclose(false)} className="absolute top-3 right-4 text-[#00bcd4] text-2xl hover:text-red-400 transition-colors">&times;</button>
          </div>
        </div>
      )}
      <input className="px-8 py-2 rounded-lg ml-96 outline-none border-2 border-green-200 focus:border-green-200 transition-colors duration-200" placeholder="Search" type="search" />
      <Table className="w-[50%] mt-6 shadow-lg rounded-lg overflow-hidden">
        <TableHeader className="bg-green-500">
          <TableRow>
            <TableHead className="text-white">image</TableHead>
            <TableHead className="text-white">TeacherID</TableHead>
            <TableHead className="text-white">FullName</TableHead>
            <TableHead className="text-white">adress</TableHead>
            <TableHead className="text-white">phone</TableHead>
            <TableHead className="text-white">Gadern</TableHead>
            <TableHead className="text-white">preod</TableHead>
            <TableHead className="text-white">classId</TableHead>
            <TableHead className="text-white">options</TableHead>
            <TableHead className="text-white">Options</TableHead>
          </TableRow>
        </TableHeader>
        {getData.map((item) => (
          <TableBody className="bg-white" key={item._id}>
            <TableRow className="text-center hover:bg-indigo-50 transition-colors duration-200">
              <TableCell><img className="w-10 h-10 rounded-full" src={item.image || "https://www.pexels.com/photo/elegant-portrait-of-a-woman-in-black-attire-32633205/"} alt="" /></TableCell>
              <TableCell>{item.TeacherId}</TableCell>
              <TableCell>{item.FullName}</TableCell>
              <TableCell>{item.adress}</TableCell>
              <TableCell>{item.phone}</TableCell>
              <TableCell>{item.Gender}</TableCell>
              <TableCell>{item.Period}</TableCell>
              <TableCell>{item.class?.className}</TableCell>
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

export default Teacher;