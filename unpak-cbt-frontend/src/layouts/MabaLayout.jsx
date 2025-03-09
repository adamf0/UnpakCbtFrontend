import { Outlet } from "react-router-dom";

const MabaLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="p-5 flex-1">
        <h1 className="text-center text-2xl font-bold mb-4">Ujian</h1>
        <Outlet />
      </div>
    </div>
  );
};

export default MabaLayout;
