import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MabaLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="p-5 flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default MabaLayout;
