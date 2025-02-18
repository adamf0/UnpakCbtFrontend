import { Link } from "react-router-dom";

const MabaDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard Mahasiswa</h1>
      <p>Selamat datang! Pilih ujian Anda.</p>
      <Link to="/maba/ujian/1" className="mt-3 p-2 bg-green-500 text-white rounded">Mulai Ujian</Link>
    </div>
  );
};

export default MabaDashboard;
