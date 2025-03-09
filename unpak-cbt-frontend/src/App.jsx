import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Pages
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import BankSoal from "./pages/admin/BankSoal";
import BankSoalTambah from "./pages/admin/BankSoalTambah";
import BankSoalEdit from "./pages/admin/BankSoalEdit";
import UjianAdmin from "./pages/admin/UjianAdmin";
import UjianAdminTambah from "./pages/admin/UjianAdminTambah";
import UjianAdminEdit from "./pages/admin/UjianAdminEdit";
import TemplateSoal from "./pages/admin/TemplateSoal";
import MabaDashboard from "./pages/user/Dashboard";

// Import Layouts
import AdminLayout from "./layouts/AdminLayout";
import MabaLayout from "./layouts/MabaLayout";

// Import PrivateRoute Component
import PrivateRoute from "./components/PrivateRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Login />} />

      {/* Protected Admin Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="bank-soal" element={<BankSoal />} />
          <Route path="bank-soal/tambah" element={<BankSoalTambah />} />
          <Route path="bank-soal/edit/:uuid" element={<BankSoalEdit />} />
          <Route path="bank-soal/template" element={<TemplateSoal />} />
          <Route path="ujian" element={<UjianAdmin />} />
          <Route path="ujian/tambah" element={<UjianAdminTambah />} />
          <Route path="ujian/edit/:uuid" element={<UjianAdminEdit />} />
        </Route>
      </Route>

      {/* Maba Routes */}
      <Route path="/maba" element={<MabaLayout />}>
        <Route path="dashboard" element={<MabaDashboard />} />
        {/* Other Maba routes */}
      </Route>

      {/* 404 Not Found */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default AppRoutes;
