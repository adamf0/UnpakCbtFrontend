import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Select from "../../components/Select";
import { apiProduction, apiSelectProduction } from "@src/Constant"

const UjianAdminEdit = () => {
  const { uuid } = useParams();
  const [deskripsi, setDeskripsi] = useState("");
  const [kouta, setKouta] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jamMulai, setJamMulai] = useState("");
  const [jamAkhir, setJamAkhir] = useState("");
  const [idBankSoal, setIdBankSoal] = useState("");
  const [bankSoalList, setBankSoalList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch Data Ujian untuk Edit
  useEffect(() => {
    setLoading(true);
    apiProduction
      .get(`/api/JadwalUjian/${uuid}`)
      .then((response) => {
        if (!response.data) {
          console.warn(`Data tidak ditemukan untuk UUID: ${uuid}`);
          setError("Data tidak ditemukan, silakan tambahkan baru.");
          return;
        }

        const data = response.data;
        console.log("Data Ujian Diterima:", data); // Debugging log
        setDeskripsi(data.deskripsi || "");
        setKouta(data.kouta || "");
        setTanggal(data.tanggal || "");
        setJamMulai(data.jamMulai || "");
        setJamAkhir(data.jamAkhir || "");
        setIdBankSoal(data.uuidBankSoal || "");
        setError(null);
      })
      .catch((error) => {
        console.error(`Gagal mengambil data untuk UUID: ${uuid}`, error);
        setError("Data tidak ditemukan, silakan tambahkan baru.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [uuid]);

  // Fetch List Bank Soal
  useEffect(() => {
    apiProduction
      .get("/api/BankSoal")
      .then((response) => {
        const activeBankSoal = response.data
          .filter((item) => item.status === "active")
          .map((soal) => ({
            value: soal.uuid,
            label: soal.judul,
          }));
        setBankSoalList(activeBankSoal);
      })
      .catch((error) => {
        console.error("Gagal mengambil data Bank Soal:", error);
      });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiProduction.put("/api/JadwalUjian", {
        id: uuid,
        deskripsi,
        kouta,
        tanggal,
        jamMulai,
        jamAkhir,
        idBankSoal,
      });

      alert("Data Ujian berhasil diperbarui!");
      navigate("/admin/ujian");
    } catch (error) {
      console.error("Gagal memperbarui data:", error);
      alert("Terjadi kesalahan, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="text-gray-600 text-sm mb-4">
        <Link to="/admin/ujian" className="font-bold text-purple-700 hover:underline">
          Jadwal Ujian
        </Link>{" "}
        / <span className="text-gray-500">Edit Data</span>
      </nav>

      <div className="bg-white p-5 rounded-lg shadow-md">
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleUpdate}>
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
              options={bankSoalList}
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
              {error ? "Tambah" : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UjianAdminEdit;
