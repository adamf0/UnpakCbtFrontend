import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Select from "../../components/Select";

const BankSoalEdit = () => {
  const { uuid } = useParams();
  const [judul, setJudul] = useState("");
  const [fakultas, setFakultas] = useState([]);
  const [prodi, setProdi] = useState([]);
  const [jenjang, setJenjang] = useState([]);

  const [fakultasList, setFakultasList] = useState([]);
  const [prodiList, setProdiList] = useState([]);
  const [jenjangList, setJenjangList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch Data Bank Soal untuk Edit
  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/BankSoal/${uuid}`)
      .then((response) => {
        console.log("Data Bank Soal Diterima:", response.data); // Debugging log
        const data = response.data;
        setJudul(data.judul || "");

        // Jika tidak ada data rule, biarkan kosong untuk ditambahkan baru
        if (data.rule) {
          const ruleData = JSON.parse(data.rule);
          setFakultas(ruleData.fakultas?.map((f) => f.value) || []);
          setProdi(ruleData.prodi?.map((p) => p.value) || []);
          setJenjang(ruleData.jenjang?.map((j) => j.value) || []);
        }

        setError(null); // Reset error jika data ditemukan
      })
      .catch(() => {
        setError("Data tidak ditemukan, silakan tambahkan baru.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [uuid]);

  // Fetch Fakultas
  useEffect(() => {
    axios.get("/select2/list_fakultas").then((response) => {
      setFakultasList(
        response.data.map((item) => ({
          value: item.id,
          label: item.text,
        }))
      );
    });
  }, []);

  // Fetch Jenjang
  useEffect(() => {
    axios.get("/select2/list_jenjang").then((response) => {
      setJenjangList(
        response.data.map((item) => ({
          value: item.id,
          label: item.text,
        }))
      );
    });
  }, []);

  // Fetch Prodi berdasarkan Fakultas
  useEffect(() => {
    if (fakultas.length > 0) {
      Promise.all(
        fakultas.map((fak) => axios.get(`/select2/list_prodi/${fak}`))
      ).then((responses) => {
        const prodiOptions = responses
          .flatMap((response) => response.data)
          .map((item) => ({
            value: item.id,
            label: item.text,
          }));
        setProdiList(prodiOptions);
      });
    } else {
      setProdiList([]);
    }
  }, [fakultas]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Format rule sebagai JSON string
    const rule = JSON.stringify({
      fakultas: fakultasList.filter((f) => fakultas.includes(f.value)),
      prodi: prodiList.filter((p) => prodi.includes(p.value)),
      jenjang: jenjangList.filter((j) => jenjang.includes(j.value)),
    });

    try {
      await axios.put("/api/BankSoal", {
        id: uuid,
        judul,
        rule,
      });

      alert("Data berhasil diperbarui!");
      navigate("/admin/bank-soal");
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
        <Link
          to="/admin/bank-soal"
          className="font-bold text-purple-700 hover:underline"
        >
          Bank Soal
        </Link>{" "}
        / <span className="text-gray-500">Edit Data</span>
      </nav>

      <div className="bg-white p-5 rounded-lg shadow-md">
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleUpdate}>
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
              {error ? "Tambah" : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default BankSoalEdit;
