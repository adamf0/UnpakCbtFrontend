import { useState } from "react";
import axios from "axios";
import Modal from "../../components/Modal";

const SoalList = ({ soalList, setSoalList, uuid, fetchSoalList }) => {
  const [activeTab, setActiveTab] = useState("TPA");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedSoal, setSelectedSoal] = useState(null);
  const [detailSoal, setDetailSoal] = useState(null);

  // Mendapatkan tipe soal unik dari data API
  const uniqueTypes = [...new Set(soalList.map((soal) => soal.tipe))];

  const typeMapping = {
    BI: "Bahasa Inggris",
    MTK: "Matematika",
  };

  // Filter soal berdasarkan tab yang dipilih
  const filteredSoalList = soalList.filter((soal) => soal.tipe === activeTab);

  const fetchDetailSoal = async (id) => {
    try {
      const response = await axios.get(`/api/TemplatePertanyaan/${id}`);
      setDetailSoal(response.data);
    } catch (error) {
      console.error("Error fetching detail soal:", error);
      setDetailSoal(null);
    }
  };

  const handleConfirmDelete = (soal) => {
    setSelectedSoal(soal);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    if (!selectedSoal) return;

    try {
      await axios.delete(`/api/TemplatePertanyaan/${selectedSoal.uuid}`);

      fetchSoalList();
      setShowConfirm(false);
      setSelectedSoal(null);
      setDetailSoal(null);
    } catch (error) {
      console.error("Error deleting soal:", error);
      alert("Gagal menghapus soal. Silakan coba lagi.");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Daftar Soal</h2>

      {/* Tabs */}
      <div className="border-b-2 border-gray-200 flex space-x-4 mb-4">
        {uniqueTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`py-2 px-4 text-sm font-semibold border-b-2 transition ${
              activeTab === type
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-purple-600"
            }`}
          >
            {typeMapping[type] || type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Detail Soal (Lebih Besar di Desktop) */}
        <div className="md:col-span-2 bg-gray-100 p-4 rounded-lg shadow-sm min-h-[200px] flex flex-col justify-center">
          {detailSoal ? (
            <>
              <h3 className="text-md font-semibold text-purple-600">
                Detail Soal
              </h3>
              <p className="text-gray-700 mt-2">
                <strong>Pertanyaan:</strong> {detailSoal.pertanyaan || "-"}
              </p>
              {detailSoal.gambar && (
                <img
                  src={detailSoal.gambar}
                  alt="Gambar Soal"
                  className="w-full h-32 object-cover rounded-md mt-2"
                />
              )}
              <p className="text-gray-700 mt-2">
                <strong>Jawaban Benar:</strong> {detailSoal.jawabanBenar || "-"}
              </p>
              <p className="text-gray-700">
                <strong>Bobot:</strong>{" "}
                {detailSoal.bobot !== null ? detailSoal.bobot : "-"}
              </p>
              <span
                className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full ${
                  detailSoal.state === "init"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {detailSoal.state}
              </span>
            </>
          ) : (
            <p className="text-gray-500 text-center">
              Silahkan pilih nomor soal terlebih dahulu.
            </p>
          )}
        </div>

        {/* Grid Nomor Soal + Tombol */}
        <div className="flex flex-col justify-between">
          {/* Grid Nomor Soal */}
          <div className="grid grid-cols-5 gap-4 p-4 bg-gray-100 rounded-lg shadow-sm h-auto md:h-full">
            {filteredSoalList.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center">
                Belum ada soal untuk kategori ini.
              </p>
            ) : (
              filteredSoalList.map((soal, index) => (
                <div
                  key={soal.uuid}
                  onClick={() => fetchDetailSoal(soal.uuid)}
                  className="relative border border-gray-200 rounded-lg shadow-sm bg-gray-50 flex items-center justify-center text-lg font-bold text-gray-700 cursor-pointer hover:bg-purple-200 transition aspect-square"
                >
                  {/* Tombol Hapus di Pojok Kanan Atas */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Agar tidak memicu klik detail
                      handleConfirmDelete(soal);
                    }}
                    className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-xs rounded-md transition"
                  >
                    X
                  </button>

                  {/* Nomor Soal */}
                  {index + 1}
                </div>
              ))
            )}
          </div>

          {/* Tombol Simpan & Simpan Permanen */}
          <div className="mt-4 flex space-x-2">
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
              onClick={() => console.log("Simpan data sementara")}
            >
              Simpan
            </button>
            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
              onClick={() => console.log("Simpan data secara permanen")}
            >
              Simpan Permanen
            </button>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus */}
      <Modal
        isOpen={showConfirm}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus soal "${
          selectedSoal?.pertanyaan || "Soal ini"
        }"?`}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        confirmText="Hapus"
        cancelText="Batal"
      />
    </div>
  );
};

export default SoalList;
