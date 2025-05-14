import { Routes, Route } from "react-router-dom";

// lazyComponents.js
import { lazy } from "react";

// Public
export const Login = lazy(() => import("./pages/Login"));

// Layouts
export const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
export const MabaLayout = lazy(() => import("./layouts/MabaLayout"));

// Admin Pages
export const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
export const BankSoal = lazy(() => import("./pages/admin/BankSoal"));
export const BankSoalTambah = lazy(() => import("./pages/admin/BankSoalTambah"));
export const BankSoalEdit = lazy(() => import("./pages/admin/BankSoalEdit"));
export const TemplateSoal = lazy(() => import("./pages/admin/TemplateSoal"));
export const UjianAdmin = lazy(() => import("./pages/admin/UjianAdmin"));
export const UjianAdminDetail = lazy(() => import("./pages/admin/UjianAdminDetail"));
export const UjianAdminTambah = lazy(() => import("./pages/admin/UjianAdminTambah"));
export const UjianAdminEdit = lazy(() => import("./pages/admin/UjianAdminEdit"));

// Maba Pages
// export const MabaDashboard = lazy(() => import("./pages/user/Dashboard"));
export const UjianMaba = lazy(() => import("./pages/user/Ujian"));
export const UjianMabaDetail = lazy(() => import("./pages/user/UjianDetail"));
export const SoalUjian = lazy(() => import("./pages/user/SoalUjian"));

// Import PrivateRoute Component
import PrivateRoute from "./components/PrivateRoute";
import { Suspense } from "react";
import LoadingScreen from "./components/LoadingScreen";

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen message="Sedang memuat data..." />}>
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
            <Route path="ujian/:uuid" element={<UjianAdminDetail />} />
            <Route path="ujian/tambah" element={<UjianAdminTambah />} />
            <Route path="ujian/edit/:uuid" element={<UjianAdminEdit />} />
          </Route>
        </Route>

        {/* Maba Routes */}
        <Route path="/maba" element={<MabaLayout />}>
          <Route path=":uuid/:noReg" element={<UjianMaba />} />
          <Route path="ujian/:uuid" element={<UjianMabaDetail />} />
          <Route path="ujian/:uuid/tipe/:tipe" element={<SoalUjian />} />
        </Route>

        {/* 404 Not Found */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
