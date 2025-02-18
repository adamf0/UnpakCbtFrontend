import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import BankSoal from "./pages/admin/BankSoal";
import UjianAdmin from "./pages/admin/UjianAdmin";
import MabaDashboard from "./pages/user/Dashboard";
// import UjianMaba from "./pages/maba/UjianMaba";
// import NotFound from "./pages/NotFound";

// Import Layouts
import AdminLayout from "./layouts/AdminLayout";
import MabaLayout from "./layouts/MabaLayout";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="bank-soal" element={<BankSoal />} />
          <Route path="ujian" element={<UjianAdmin />} />
        </Route>

        {/* Maba Routes */}
        <Route path="/maba" element={<MabaLayout />}>
          <Route path="dashboard" element={<MabaDashboard />} />
          {/* <Route path="ujian/:id" element={<UjianMaba />} /> */}
        </Route>

        {/* 404 Not Found */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default AppRoutes;
