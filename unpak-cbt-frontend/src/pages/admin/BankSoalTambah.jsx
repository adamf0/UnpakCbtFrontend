import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
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
        <Link
          to="/admin/bank-soal"
          className="font-bold text-purple-700 hover:underline"
        >
          Bank Soal
        </Link>{" "}
        /<span className="text-gray-500"> Tambah Data</span>
      </nav>

      {/* Form Tambah Data */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-lg shadow-md border"
      >
        <div className="mb-4">
          <Input
            label="Judul Soal"
            type="text"
            placeholder="Masukkan judul soal"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required={true}
          />
        </div>
        <div className="mb-4">
          <Input
            label="Rule Soal"
            type="text"
            placeholder="Masukkan rule soal"
            value={rule}
            onChange={(e) => setRule(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Link to="/admin/bank-soal">
            <Button variant="secondary">Batal</Button>
          </Link>
          <Button loading={loading} type="submit">
            Simpan
          </Button>
        </div>
      </form>
    </>
  );
};

export default BankSoalTambah;
