import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Select from "../../components/Select";
import axios from "axios";

const BankSoalTambah = () => {
  const [judul, setJudul] = useState("");
  const [fakultas, setFakultas] = useState([]);
  const [prodi, setProdi] = useState([]);
  const [jenjang, setJenjang] = useState([]);

  const [fakultasList, setFakultasList] = useState([]);
  const [prodiList, setProdiList] = useState([]);
  const [jenjangList, setJenjangList] = useState([]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch Fakultas
  useEffect(() => {
    const fetchFakultas = async () => {
      try {
        const response = await axios.get("/select2/list_fakultas");
        const fakultasOptions = response.data.map((item) => ({
          value: item.id, // Sesuai dengan struktur API
          label: item.text, // Menampilkan label Fakultas
        }));
        setFakultasList(fakultasOptions);
      } catch (error) {
        console.error("Gagal mengambil data Fakultas:", error);
      }
    };
    fetchFakultas();
  }, []);

  // Fetch Jenjang
  useEffect(() => {
    const fetchJenjang = async () => {
      try {
        const response = await axios.get("/select2/list_jenjang");
        const jenjangOptions = response.data.map((item) => ({
          value: item.id, // Sesuai dengan struktur API
          label: item.text, // Menampilkan label Jenjang
        }));
        setJenjangList(jenjangOptions);
      } catch (error) {
        console.error("Gagal mengambil data Jenjang:", error);
      }
    };
    fetchJenjang();
  }, []);

  // Fetch Prodi berdasarkan Fakultas yang dipilih
  useEffect(() => {
    const fetchProdi = async () => {
      if (fakultas.length > 0) {
        try {
          const responses = await Promise.all(
            fakultas.map((fak) =>
              axios.get(`/select2/list_prodi/${fak}`)
            )
          );
          const prodiOptions = responses
            .flatMap((response) => response.data)
            .map((item) => ({
              value: item.id, // Sesuai dengan struktur API
              label: item.text, // Menampilkan nama Prodi
            }));
          setProdiList(prodiOptions);
        } catch (error) {
          console.error("Gagal mengambil data Prodi:", error);
        }
      } else {
        setProdiList([]);
      }
    };
    fetchProdi();
  }, [fakultas]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Format rule sebagai JSON string
    const rule = JSON.stringify({
      fakultas: fakultasList.filter((f) => fakultas.includes(f.value)),
      prodi: prodiList.filter((p) => prodi.includes(p.value)),
      jenjang: jenjangList.filter((j) => jenjang.includes(j.value)),
    });

    try {
      const response = await axios.post("/api/BankSoal", {
        judul,
        rule,
      });

      console.log("Berhasil menambahkan data:", response.data);
      alert("Bank Soal berhasil ditambahkan!");
      navigate("/admin/bank-soal");
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
        <Link to="/admin/bank-soal" className="font-bold text-purple-700 hover:underline">
          Bank Soal
        </Link>{" "}
        / <span className="text-gray-500">Tambah Data</span>
      </nav>

      {/* Form Tambah Data */}
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow-md">
        <div className="mb-4">
          <Input
            label="Judul Soal"
            type="text"
            placeholder="Masukkan judul soal"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
          />
        </div>

        {/* Select Fakultas */}
        <div className="mb-4">
          <Select
            label="Fakultas"
            options={fakultasList}
            value={fakultas}
            onChange={setFakultas}
            multiple={true}
            required
          />
        </div>

        {/* Select Prodi (Berdasarkan Fakultas yang Dipilih) */}
        <div className="mb-4">
          <Select
            label="Program Studi"
            options={prodiList}
            value={prodi}
            onChange={setProdi}
            multiple={true}
            required
          />
        </div>

        {/* Select Jenjang */}
        <div className="mb-4">
          <Select
            label="Jenjang"
            options={jenjangList}
            value={jenjang}
            onChange={setJenjang}
            multiple={true}
            required
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
