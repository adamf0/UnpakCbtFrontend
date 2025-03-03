import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Select from "../../components/Select";
import axios from "axios";

const UjianAdminTambah = () => {
  const [deskripsi, setDeskripsi] = useState("");
  const [kouta, setKouta] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jamMulai, setJamMulai] = useState("");
  const [jamAkhir, setJamAkhir] = useState("");
  const [idBankSoal, setIdBankSoal] = useState("");
  const [bankSoalList, setBankSoalList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBankSoal = async () => {
      try {
        const response = await axios.get("/api/BankSoal");
        const activeBankSoal = response.data.filter(
          (item) => item.status === "active"
        );
        setBankSoalList(activeBankSoal);
      } catch (error) {
        console.error("Gagal mengambil data Bank Soal:", error);
      }
    };

    fetchBankSoal();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/JadwalUjian", {
        deskripsi,
        kouta,
        tanggal,
        jamMulai,
        jamAkhir,
        idBankSoal,
      });

      alert("Jadwal Ujian berhasil ditambahkan!");
      navigate("/admin/ujian"); // Redirect ke halaman daftar ujian
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
          to="/admin/ujian"
          className="font-bold text-purple-700 hover:underline"
        >
          Jadwal Ujian
        </Link>{" "}
        /<span className="text-gray-500"> Tambah Data</span>
      </nav>

      {/* Form Tambah Data */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <Input
            label="Deskripsi Ujian"
            type="text"
            placeholder="Masukkan deskripsi ujian"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Input
            label="Kouta Peserta"
            type="number"
            placeholder="Masukkan kouta peserta"
            value={kouta}
            onChange={(e) => setKouta(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Input
            label="Tanggal Ujian"
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Input
            label="Jam Mulai"
            type="time"
            value={jamMulai}
            onChange={(e) => setJamMulai(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Input
            label="Jam Akhir"
            type="time"
            value={jamAkhir}
            onChange={(e) => setJamAkhir(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Select
            label="Pilih Bank Soal"
            options={bankSoalList.map((soal) => ({
              value: soal.uuid,
              label: soal.judul,
            }))}
            value={idBankSoal || ""}
            onChange={setIdBankSoal}
            required
          />
        </div>

        <div className="flex justify-end gap-3">
          <Link to="/admin/ujian">
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

export default UjianAdminTambah;
