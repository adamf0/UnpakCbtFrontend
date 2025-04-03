import { MdMenu } from "react-icons/md";
import { useAuth } from "../context/authContext";
import Button from "./Button";
import { FiLogOut } from "react-icons/fi";


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
        <button
          onClick={toggleCollapse}
          className="hidden lg:flex text-gray-700"
        >
          <MdMenu size={24} />
        </button>
      </div>

      {/* Logout Link */}
      <Button
        onClick={logout}
        className="px-3 py-1 text-xs flex items-center gap-1"
      >
        <FiLogOut className="text-sm" />
        Logout
      </Button>
    </nav>
  );
};

export default Navbar;
