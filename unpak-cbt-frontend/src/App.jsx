import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Layouts
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import BankSoal from "./pages/admin/BankSoal";
import BankSoalTambah from "./pages/admin/BankSoalTambah";
import BankSoalEdit from "./pages/admin/BankSoalEdit";
import UjianAdmin from "./pages/admin/UjianAdmin";
import MabaDashboard from "./pages/user/Dashboard";
import AdminLayout from "./layouts/AdminLayout";
import MabaLayout from "./layouts/MabaLayout";
import TemplateSoal from "./pages/admin/TemplateSoal";

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
          <Route path="bank-soal/tambah" element={<BankSoalTambah />} />
          <Route path="bank-soal/edit/:uuid" element={<BankSoalEdit />} />
          <Route path="bank-soal/template/:uuid" element={<TemplateSoal />} />
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
