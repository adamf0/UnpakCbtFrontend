import { useState } from "react";
import axios from "axios";

const SoalList = ({ soalList, setSoalList, uuid }) => {
  const [activeTab, setActiveTab] = useState("TPA"); // Tab default

  // Mendapatkan tipe soal unik dari data API
  const uniqueTypes = [...new Set(soalList.map((soal) => soal.tipe))];

  // Filter soal berdasarkan tab yang dipilih
  const filteredSoalList = soalList.filter((soal) => soal.tipe === activeTab);

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus soal ini?")) {
      axios
        .delete(`/api/TemplatePertanyaan/${id}`)
        .then(() => {
          setSoalList((prev) => prev.filter((soal) => soal.uuid !== id));
        })
        .catch((error) => {
          console.error("Error deleting soal:", error);
        });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Daftar Soal</h2>

      {/* Tabs */}
      <div className="border-b flex space-x-4 mb-4">
        {uniqueTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`py-2 px-4 text-sm font-semibold border-b-2 transition ${
              activeTab === type
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-indigo-600"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Konten Tab */}
      {filteredSoalList.length === 0 ? (
        <p className="text-gray-500">Belum ada soal untuk kategori ini.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSoalList.map((soal) => (
            <div
              key={soal.uuid}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200 bg-gray-50"
            >
              {/* Tipe Soal */}
              <h3 className="text-md font-semibold text-indigo-600">
                {soal.tipe || "Tidak Ada Tipe"}
              </h3>

              {/* Pertanyaan */}
              <p className="text-gray-700 mt-2">
                <strong>Pertanyaan:</strong> {soal.pertanyaan || "-"}
              </p>

              {/* Gambar */}
              {soal.gambar ? (
                <img
                  src={soal.gambar}
                  alt="Gambar Soal"
                  className="w-full h-32 object-cover rounded-md mt-2"
                />
              ) : (
                <p className="text-gray-500 mt-2">Tidak ada gambar</p>
              )}

              {/* Jawaban Benar */}
              <p className="text-gray-700 mt-2">
                <strong>Jawaban Benar:</strong> {soal.jawabanBenar || "-"}
              </p>

              {/* Bobot */}
              <p className="text-gray-700">
                <strong>Bobot:</strong> {soal.bobot !== null ? soal.bobot : "-"}
              </p>

              {/* State */}
              <span
                className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full ${
                  soal.state === "init"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {soal.state}
              </span>

              {/* Tombol Hapus */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleDelete(soal.uuid)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded-md transition"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SoalList;
