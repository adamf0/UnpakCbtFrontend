import { useState } from "react";
import axios from "axios";
import Select from "../../components/Select";
import Button from "../../components/Button";
import { FaPlus } from "react-icons/fa";

const SoalForm = ({ uuid, fetchSoalList }) => {
  const [tipeSoal, setTipeSoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tipeSoalOptions = [
    { value: "TPA", label: "TPA" },
    { value: "BI", label: "Bahasa Inggris" },
    { value: "MTK", label: "Matematika" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tipeSoal) {
      setError("Tipe soal tidak boleh kosong");
      return;
    }

    setLoading(true);
    setError("");

    try {
      
      const formData = new FormData();
      formData.append("idBankSoal", uuid);
      formData.append("tipe", tipeSoal);

      const response = await axios.post("/api/TemplatePertanyaan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Tipe soal berhasil ditambahkan!");
      setTipeSoal(""); // Reset pilihan setelah submit

      // Update daftar soal setelah berhasil menambah
      fetchSoalList();

    } catch (error) {
      console.error("Gagal menambahkan tipe soal:", error);
      setError("Terjadi kesalahan, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-5 rounded-lg shadow-md mb-4"
    >
      {/* Tipe Soal + Tombol Tambah */}
      <div className="flex flex-col md:flex-row items-end gap-4">
        <div className="w-full md:w-auto flex-grow">
          <Select
            label="Tipe Soal"
            options={tipeSoalOptions}
            value={tipeSoal}
            onChange={(value) => {
              setTipeSoal(value);
              setError("");
            }}
            required
          />
        </div>

        <Button loading={loading} type="submit" className="w-full md:w-auto">
          <div className="flex items-center">
            <FaPlus size={16} className="mr-2" />
            Tambah Soal
          </div>
        </Button>
      </div>

      {/* Tampilkan error jika ada */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
  );
};

export default SoalForm;
