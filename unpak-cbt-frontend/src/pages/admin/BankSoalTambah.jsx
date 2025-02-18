import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const BankSoalTambah = () => {
  const [judul, setJudul] = useState("");
  const [rule, setRule] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Untuk redirect setelah submit

  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman
    setLoading(true);

    try {
      const response = await axios.post("/api/BankSoal", {
        judul: judul,
        rule: rule,
      });

      console.log("Berhasil menambahkan data:", response.data);
      alert("Bank Soal berhasil ditambahkan!");
      navigate("/admin/bank-soal"); // Redirect ke halaman Bank Soal
    } catch (error) {
      console.error("Gagal menambahkan data:", error);
      alert("Terjadi kesalahan, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <nav className="text-gray-600 text-sm mb-4">
        <Link to="/admin/bank-soal" className="font-bold text-purple-700 hover:underline">Bank Soal</Link> /
        <span className="text-gray-500"> Tambah Data</span>
      </nav>

      {/* Form Tambah Data */}
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow-md border">
        <div className="mb-4">
          <label className="block font-semibold mb-3">Judul Soal</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-100"
            placeholder="Masukkan judul soal"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-3">Rule Soal</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-100"
            placeholder="Masukkan rule soal"
            value={rule}
            onChange={(e) => setRule(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end gap-3">
          <Link to="/admin/bank-soal" className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500">
            Batal
          </Link>
          <button
            type="submit"
            className={`bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </>
  );
};

export default BankSoalTambah;
