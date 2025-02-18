import { Link, useLocation } from "react-router-dom";
import { MdDashboard, MdAssignmentInd, MdBook } from "react-icons/md";

const Sidebar = ({ isOpen, toggleSidebar, isCollapsed }) => {
  const location = useLocation();

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed lg:relative top-0 left-0 h-screen bg-white border-r-2 border-gray-100 transition-all duration-300 ease-in-out z-50 p-3 flex flex-col 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 
          ${isCollapsed ? "w-18" : "w-64"}`}
      >
        {/* Sidebar Content */}
        <div className="flex items-center gap-3 mb-4">
          <img src="/src/assets/images/logo-unpak.png" alt="Logo" className="w-11 h-11" />
          <span className={`text-xl font-bold whitespace-nowrap ${isCollapsed ? "hidden" : "block"}`}>
            UNPAK CBT
          </span>
        </div>

        {/* Sidebar Menu */}
        <ul className="flex flex-col gap-3 mt-4">
          <li>
            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-3 hover:bg-gray-200 hover:text-purple-600 p-3 rounded-lg transition ${
                location.pathname === "/admin/dashboard" ? "bg-purple-600 text-white" : ""
              }`}
              onClick={toggleSidebar} // Tutup sidebar saat di mobile
            >
              <MdDashboard size={24} />
              <span className={`${isCollapsed ? "hidden" : "block"}`}>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/bank-soal"
              className={`flex items-center gap-3 hover:bg-gray-200 hover:text-purple-600 p-3 rounded-lg transition ${
                location.pathname === "/admin/bank-soal" ? "bg-purple-600 text-white" : ""
              }`}
              onClick={toggleSidebar} // Tutup sidebar saat di mobile
            >
              <MdBook size={24} />
              <span className={`${isCollapsed ? "hidden" : "block"}`}>Bank Soal</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/ujian"
              className={`flex items-center gap-3 hover:bg-gray-200 hover:text-purple-600 p-3 rounded-lg transition ${
                location.pathname === "/admin/ujian" ? "bg-purple-600 text-white" : ""
              }`}
              onClick={toggleSidebar} // Tutup sidebar saat di mobile
            >
              <MdAssignmentInd size={24} />
              <span className={`${isCollapsed ? "hidden" : "block"}`}>Ujian</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Overlay untuk Mobile */}
      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
