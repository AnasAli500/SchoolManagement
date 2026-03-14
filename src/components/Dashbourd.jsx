import { Link, useNavigate, useLocation } from "react-router-dom"
import '../App.css';

const Dashbourd = ({ isCollapsed, setIsCollapsed }) => {
	const navigate = useNavigate();
	const location = useLocation();

	const handleLogout = () => {
		localStorage.removeItem('isAuthenticated');
		localStorage.removeItem('userEmail');
		navigate('/');
	};

	const toggleSidebar = (e) => {
		e.stopPropagation(); // Prevent bubbling just in case
		setIsCollapsed(!isCollapsed);
	};

	// Menu items
	const menu = [
		{ to: "/boxes", icon: "fa-brands fa-windows", label: "Dashboard" },
		{ to: "/student", icon: "fa-solid fa-circle-user", label: "Student" },
		{ to: "/teacher", icon: "fa-solid fa-chalkboard-user", label: "Teacher" },
		{ to: "/class", icon: "fa-solid fa-landmark", label: "Classes" },
		{ to: "/Attendence", icon: "fa-solid fa-clipboard-check", label: "Attendance" },
		{ to: "/ReadAttendence", icon: "fa-solid fa-book-open-reader", label: "ReadAttendence" },
		{ to: "/period", icon: "fa-solid fa-calendar-days", label: "Period" },
		{ to: "/finance", icon: "fa-solid fa-dollar-sign", label: "Finance" },
		{ to: "/FinanceRead", icon: "fa-solid fa-dollar-sign", label: "FinanceRead" },
	];

	return (
		<div className={`sidebar-scroll h-screen fixed transition-all duration-300 z-20
			${isCollapsed ? "w-16" : "w-64"}
			bg-gradient-to-b from-blue-800 via-blue-900 to-indigo-900
			shadow-2xl text-white border-r border-blue-900
			overflow-y-auto`}
		>
			{/* Profile Section */}
			<div className="flex items-center justify-between py-6 px-3 border-b border-blue-700">
				<div className="flex items-center gap-2">
					<img
						src="https://ui-avatars.com/api/?name=Admin"
						alt="Admin"
						className="w-10 h-10 rounded-full border-2 border-blue-400 shadow"
					/>
					{!isCollapsed && <span className="text-lg font-bold tracking-wide">Admin</span>}
				</div>
				<button
					onClick={toggleSidebar}
					className="p-2 hover:bg-blue-700 rounded transition"
				>
					<i className={`fa-solid ${isCollapsed ? "fa-bars" : "fa-xmark"} text-xl`}></i>
				</button>
			</div>

			{/* Menu */}
			<ul className="flex flex-col mt-6 space-y-2">
				{menu.map((item, idx) => (
					<li key={idx}>
						<Link
							to={item.to}
							className={`
								flex items-center gap-4 py-3 px-4 rounded-lg transition-all
								${location.pathname === item.to
									? "bg-blue-600 shadow-lg"
									: "hover:bg-blue-700 hover:shadow"}
								${isCollapsed ? "justify-center" : ""}
							`}
						>
							<i className={`${item.icon} text-xl`}></i>
							{!isCollapsed && <span className="font-medium">{item.label}</span>}
						</Link>
					</li>
				))}
				{/* Logout */}
				<li className="mt-8">
					<button
						onClick={handleLogout}
						className={`
							flex items-center gap-4 py-3 px-4 rounded-lg w-full text-left transition-all
							hover:bg-red-600 hover:shadow
							${isCollapsed ? "justify-center" : ""}
						`}
					>
						<i className="fa-solid fa-right-to-bracket text-xl"></i>
						{!isCollapsed && <span className="font-medium">Logout</span>}
					</button>
				</li>
			</ul>
		</div>
	)
}

export default Dashbourd