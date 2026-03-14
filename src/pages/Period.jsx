import { useEffect, useState } from "react";
import axios from "axios";
import Dashbourd from "../components/Dashbourd";

const Period = () => {
  const [periods, setPeriods] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [periodId, setPeriodId] = useState("");
  const [periodName, setPeriodName] = useState("");
  const [editId, setEditId] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null); // { type: 'create' | 'update' | 'delete' }

  // Read all periods
  const fetchPeriods = () => {
    axios.get("http://localhost:3000/period").then((res) => {
      setPeriods(res.data);
    });
  };

  useEffect(() => {
    fetchPeriods();
  }, []);

  // Create or Update period
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      // Update
      axios
        .put(`http://localhost:3000/period/${editId}`, {
          periodId,
          periodName,
        })
        .then(() => {
          setShowSuccess({ type: 'update' });
          setTimeout(() => setShowSuccess(null), 1800);
          fetchPeriods();
          setIsFormOpen(false);
          setEditId(null);
          setPeriodId("");
          setPeriodName("");
        });
    } else {
      // Create
      axios
        .post("http://localhost:3000/period", {
          periodId,
          periodName,
        })
        .then(() => {
          setShowSuccess({ type: 'create' });
          setTimeout(() => setShowSuccess(null), 1800);
          fetchPeriods();
          setIsFormOpen(false);
          setPeriodId("");
          setPeriodName("");
        });
    }
  };

  // Delete period
  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/period/${id}`).then(() => {
      setShowSuccess({ type: 'delete' });
      setTimeout(() => setShowSuccess(null), 1800);
      fetchPeriods();
    });
  };

  // Edit period
  const handleEdit = (period) => {
    setEditId(period._id);
    setPeriodId(period.periodId);
    setPeriodName(period.periodName);
    setIsFormOpen(true);
  };

  return (
    <>
      <style>{`
        @keyframes dash { to { stroke-dashoffset: 0; } }
        .checkmark-path { stroke-dasharray: 60; stroke-dashoffset: 60; animation: dash 600ms ease forwards; }
      `}</style>
      <Dashbourd isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 min-h-screen p-6 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-[20%]'} flex flex-col items-start`}>
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
        <button
          onClick={() => {
            setIsFormOpen(true);
            setEditId(null);
            setPeriodId("");
            setPeriodName("");
          }}
          className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 px-6 py-2 rounded-xl mt-2 text-white font-semibold shadow-md transition-all duration-200 mb-2 text-base ml-8"
        >
          + Add Period
        </button>

        {/* Create/Update Period Form */}
        {isFormOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-[#18182f] w-[370px] p-8 rounded-2xl shadow-2xl border border-[#00bcd4] relative animate-fadeIn">
              <h2 className="text-center text-[#00bcd4] text-3xl font-bold mb-6 tracking-wide drop-shadow ">{editId ? "Update" : "Create"} Period</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label className="block text-sm font-semibold mb-1 text-[#00bcd4]">Period ID</label>
                  <input
                    value={periodId}
                    onChange={(e) => setPeriodId(e.target.value)}
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all"
                    required
                  />
                </div>
                <div className="mb-7">
                  <label className="block text-sm font-semibold mb-1 text-[#00bcd4]">Period Name</label>
                  <input
                    value={periodName}
                    onChange={(e) => setPeriodName(e.target.value)}
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-[#00bcd4] bg-[#101024] text-white focus:outline-none focus:ring-2 focus:ring-[#00bcd4] transition-all"
                    required
                  />
                </div>
                <div className="flex gap-3 mt-3">
                  <button
                    type="submit"
                    className="w-full px-2 py-2 rounded-lg border-none bg-gradient-to-r from-cyan-400 to-cyan-600 text-[#18182f] text-lg font-bold cursor-pointer hover:from-cyan-500 hover:to-cyan-700 shadow-md transition-all duration-200"
                  >
                    {editId ? "Update" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="w-full px-2 py-2 rounded-lg border-none bg-gray-600 text-[#18182f] text-lg font-bold cursor-pointer hover:bg-gray-700 shadow-md transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
              <button onClick={() => setIsFormOpen(false)} className="absolute top-3 right-4 text-[#00bcd4] text-2xl hover:text-red-400 transition-colors">&times;</button>
            </div>
          </div>
        )}

        {/* Periods Table */}
        <div className="w-full flex justify-start mt-2 pl-8">
          <table className="w-[50%] mt-2 rounded-2xl overflow-hidden bg-white border border-green-200">
            <thead className="bg-gradient-to-r from-green-400 to-green-600">
              <tr>
                <th className="text-white py-3 px-4 text-lg font-semibold">Period ID</th>
                <th className="text-white py-3 px-4 text-lg font-semibold">Period Name</th>
                <th className="text-white py-3 px-4 text-lg font-semibold">Edit</th>
                <th className="text-white py-3 px-4 text-lg font-semibold">Delete</th>
              </tr>
            </thead>
            <tbody>
              {periods.map((period, idx) => (
                <tr key={period._id} className={`text-center transition-colors duration-200 ${idx % 2 === 0 ? 'bg-blue-50' : 'bg-white'} hover:bg-green-50`}>
                  <td className="py-3 px-4 text-base">{period.periodId}</td>
                  <td className="py-3 px-4 text-base">{period.periodName}</td>
                  <td>
                    <button onClick={() => handleEdit(period)} className="text-green-600 hover:text-green-800 text-xl transition-colors"><i className="fa-solid fa-edit"></i></button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(period._id)} className="text-red-600 hover:text-red-800 text-xl transition-colors"><i className="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Period;
