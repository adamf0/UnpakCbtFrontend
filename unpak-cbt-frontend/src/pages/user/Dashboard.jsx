import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";

const MabaDashboard = () => {
  const [npm, setNPM] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Hentikan navigasi jika input kosong
    if (!npm.trim()) {
      return;
    }
    navigate("/maba/ujian", { state: { npm } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-400 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        {/* Logo & Heading */}
        <div className="flex justify-center mb-4">
          <img
            src="/src/assets/images/logo-unpak.png"
            alt="Logo"
            className="h-16"
          />
        </div>
        <h2 className="text-xl mb-2 font-bold text-center">Selamat Datang Mahasiswa Baru!</h2>
        <div className="mb-8"></div>
        <p className="mb-6">
          Silakan masukkan NPM atau Nomor Registrasi Anda untuk memulai Computer Based Test (CBT).
          Pastikan Data yang dimasukkan sudah benar sebelum melanjutkan.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              label="NPM / No Registrasi Anda"
              type="number"
              placeholder="Masukan NPM / No Registrasi Anda"
              value={npm}
              onChange={(e) => setNPM(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MabaDashboard;
