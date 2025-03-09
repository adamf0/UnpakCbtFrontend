import { MdMenu } from "react-icons/md";
import { useAuth } from "../context/authContext";

const Navbar = ({ toggleSidebar, toggleCollapse }) => {
  const { logout } = useAuth();

  return (
    <nav className="bg-white border-b-2 border-gray-100 p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Tombol Toggle Sidebar untuk Mobile */}
        <button onClick={toggleSidebar} className="lg:hidden text-gray-700">
          <MdMenu size={24} />
        </button>

        {/* Tombol Collapse Sidebar untuk Desktop */}
        <button onClick={toggleCollapse} className="hidden lg:flex text-gray-700">
          <MdMenu size={24} />
        </button>
      </div>

      {/* Logout Link */}
      <button onClick={logout}>Logout</button>
    </nav>
  );
};

export default Navbar;
