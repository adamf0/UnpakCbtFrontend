import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Input from "../../components/Input";
import Button from "../../components/Button";

const BankSoalEdit = () => {
  const { uuid } = useParams();
  const [judul, setJudul] = useState("");
  const [rule, setRule] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/BankSoal/${uuid}`)
      .then((response) => {
        setJudul(response.data.judul);
        setRule(response.data.rule);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
        alert("Data tidak ditemukan.");
        navigate("/admin/bank-soal");
      });
  }, [uuid, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put("/api/BankSoal", {
        id: uuid, // API membutuhkan ID dalam body request
        judul: judul,
        rule: rule,
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
        /<span className="text-gray-500"> Edit Data</span>
      </nav>

      <form
        onSubmit={handleUpdate}
        className="bg-white p-5 rounded-lg shadow-md"
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
          <Link
            to="/admin/bank-soal"
          >
            <Button variant="secondary">Batal</Button>
          </Link>
          <Button loading={loading} type="submit">
            Update
          </Button>
        </div>
      </form>
    </>
  );
};

export default BankSoalEdit;
