import { MdMenu, MdMenuOpen } from "react-icons/md";
import { Link } from "react-router-dom";

const Navbar = ({ toggleSidebar, toggleCollapse }) => {
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
      <Link to="/" className="hover:underline">Logout</Link>
    </nav>
  );
};

export default Navbar;
