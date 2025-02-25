import { useState } from "react";
import axios from "axios";

import Select from "../../components/Select";

const SoalForm = ({ uuid, setSoalList }) => {
  const [tipeSoal, setTipeSoal] = useState("TPA");
  const [pertanyaan, setPertanyaan] = useState("");
  const [jawaban, setJawaban] = useState("");

  const tipeSoalOptions = [
    { value: "TPA", label: "TPA" },
    { value: "Bahasa Inggris", label: "Bahasa Inggris" },
    { value: "MTK", label: "Matematika" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`/api/TemplatePertanyaan/${uuid}`, {
        tipe: tipeSoal,
        pertanyaan,
        jawaban,
      })
      .then((response) => {
        setSoalList((prev) => [...prev, response.data]);
        setPertanyaan("");
        setJawaban("");
      })
      .catch((error) => {
        console.error("Error adding soal:", error);
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-5 rounded-lg shadow-md mb-4"
    >
      <h2 className="text-lg font-semibold mb-2">Tambah Soal</h2>
      <div className="mb-2">
        <label className="block text-gray-700 text-sm font-bold mb-1">
          Tipe Soal
        </label>
        <select
          value={tipeSoal}
          onChange={(e) => setTipeSoal(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="TPA">TPA</option>
          <option value="Bahasa Inggris">Bahasa Inggris</option>
          <option value="MTK">Matematika</option>
        </select>

        <Select
          label="Tipe Soal"
          options={tipeSoalOptions}
          value={tipeSoal}
          onChange={(e) => setTipeSoal(e.target.value)}
          required
        />
      </div>

      <div className="mb-2">
        <label className="block text-gray-700 text-sm font-bold mb-1">
          Pertanyaan
        </label>
        <textarea
          value={pertanyaan}
          onChange={(e) => setPertanyaan(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      <div className="mb-2">
        <label className="block text-gray-700 text-sm font-bold mb-1">
          Jawaban
        </label>
        <input
          type="text"
          value={jawaban}
          onChange={(e) => setJawaban(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded-md"
      >
        Tambah Soal
      </button>
    </form>
  );
};

export default SoalForm;
