import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Textarea from "../../components/Textarea";
import { FaPlus } from "react-icons/fa";

const SoalList = ({ soalList, fetchSoalList }) => {
  const [activeTab, setActiveTab] = useState("TPA");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAddJawabanModal, setShowAddJawabanModal] = useState(false);
  const [selectedSoal, setSelectedSoal] = useState(null);
  const [detailSoal, setDetailSoal] = useState(null);
  const [listJawaban, setListJawaban] = useState([]);
  const [selectedJawabanBenar, setSelectedJawabanBenar] = useState(null);

  const [showConfirmDeleteJawaban, setShowConfirmDeleteJawaban] =
    useState(false);
  const [selectedJawaban, setSelectedJawaban] = useState(null);

  const [loading, setLoading] = useState(false);

  // State untuk menyimpan input yang dapat diedit
  const [pertanyaanInput, setPertanyaanInput] = useState(
    detailSoal?.pertanyaan || ""
  );
  const [bobotInput, setBobotInput] = useState(detailSoal?.bobot || "");
  const [gambarInput, setGambarInput] = useState(null);
  const [gambarPreview, setGambarPreview] = useState(
    detailSoal?.gambar || null
  );

  // State untuk input jawaban baru
  const [jawabanText, setJawabanText] = useState("");
  const [jawabanImg, setJawabanImg] = useState(null);
  const [jawabanPreview, setJawabanPreview] = useState(null);

  const tipeUrutan = ["TPA", "BI", "MTK"];
  
  // Mendapatkan tipe soal unik dari data API
  const uniqueTypes = tipeUrutan.filter((tipe) =>
    soalList.some((soal) => soal.tipe === tipe)
  );

  const typeMapping = {
    BI: "Bahasa Inggris",
    MTK: "Matematika",
  };

  // Filter soal berdasarkan tab yang dipilih
  const filteredSoalList = soalList
  .filter((soal) => soal.tipe === activeTab)
  .sort((a, b) => a.uuid.localeCompare(b.uuid));

  // Fetch detail soal
  const fetchDetailSoal = async (id) => {
    try {
      const response = await axios.get(`/api/TemplatePertanyaan/${id}`);
      setDetailSoal(response.data);
      console.log("Detail soal:", response.data);

      // Set input berdasarkan data yang didapat
      setPertanyaanInput(response.data.pertanyaan || "");
      setBobotInput(response.data.bobot || "");
      setGambarPreview(
        response.data.gambar ? `/uploads/${response.data.gambar}` : null
      );
      setGambarInput(null);
    } catch (error) {
      console.error("Error fetching detail soal:", error);
      setDetailSoal(null);
    }
  };

  // Fetch daftar jawaban
  const fetchListJawaban = async (id) => {
    try {
      const response = await axios.get("/api/TemplateJawaban");

      // Filter jawaban hanya yang memiliki uuidTemplateSoal sama dengan id
      const filteredJawaban = response.data.filter(
        (jawaban) => jawaban.uuidTemplateSoal === id
      );

      setListJawaban(filteredJawaban);
      console.log("Filtered jawaban:", filteredJawaban);

      // Set jawaban benar jika sudah ada di detailSoal
      if (detailSoal && detailSoal.uuidJawabanBenar) {
        setSelectedJawabanBenar(detailSoal.uuidJawabanBenar);
      }
    } catch (error) {
      console.error("Error fetching jawaban:", error);
      setListJawaban([]);
    }
  };

  // Fungsi untuk menyimpan jawaban benar ke state
  const handleSelectCorrectAnswer = (jawabanId) => {
    setSelectedJawabanBenar(jawabanId);
  };

  const handleConfirmDeleteJawaban = (jawaban) => {
    setSelectedJawaban(jawaban);
    setShowConfirmDeleteJawaban(true);
  };

  // Fungsi untuk menghapus jawaban
  const handleDeleteJawabanConfirmed = async () => {
    if (!selectedJawaban) return;

    try {
      await axios.delete(`/api/TemplateJawaban/${selectedJawaban.uuid}`);
      // alert("Jawaban berhasil dihapus!");
      fetchListJawaban(detailSoal.uuid);
      setShowConfirmDeleteJawaban(false);
      setSelectedJawaban(null);
    } catch (error) {
      console.error("Error deleting jawaban:", error);
      alert("Gagal menghapus jawaban.");
    }
  };

  // Fungsi untuk menampilkan modal tambah jawaban
  const handleShowAddJawabanModal = () => {
    setLoading(true);
    setShowAddJawabanModal(true);
    setJawabanText("");
    setJawabanImg(null);
    setJawabanPreview(null);
  };

  // Fungsi untuk menangani perubahan input gambar jawaban
  const handleJawabanImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setJawabanImg(file);
      setJawabanPreview(URL.createObjectURL(file));
    }
  };

  // Fungsi untuk menambahkan jawaban baru
  const handleAddJawaban = async () => {
    setLoading(true);
    if (!detailSoal) return;

    try {
      const formData = new FormData();
      formData.append("idTemplateSoal", detailSoal.uuid);
      formData.append("jawabanText", jawabanText);

      if (jawabanImg) {
        formData.append("jawabanImg", jawabanImg);
      }

      await axios.post("/api/TemplateJawaban", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // alert("Jawaban berhasil ditambahkan!");
      setShowAddJawabanModal(false);
      setLoading(false);
      fetchListJawaban(detailSoal.uuid);
    } catch (error) {
      console.error("Error adding jawaban:", error);
      alert("Gagal menambahkan jawaban. Silakan coba lagi.");
      setLoading(false);
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

  // Fungsi untuk menangani perubahan input gambar
  const handleGambarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGambarInput(file);
      setGambarPreview(URL.createObjectURL(file)); // Preview gambar sebelum diunggah
    }
  };

  // Fungsi untuk menyimpan data ke API
  const handleSave = async () => {
    if (!detailSoal) return;

    try {
      const formData = new FormData();
      formData.append("id", detailSoal.uuid);
      formData.append("idBankSoal", detailSoal.uuidBankSoal);
      formData.append("tipe", detailSoal.tipe);
      formData.append("pertanyaan", pertanyaanInput);
      formData.append("bobot", bobotInput);
      formData.append("jawaban", selectedJawabanBenar);
      formData.append("state", "");

      if (gambarInput) {
        formData.append("gambar", gambarInput);
      }

      await axios.put("/api/TemplatePertanyaan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Data berhasil disimpan!");
      fetchSoalList();
    } catch (error) {
      console.error("Error saving soal:", error);
      alert("Gagal menyimpan data. Silakan coba lagi.");
    }
  };

  useEffect(() => {
    if (detailSoal?.uuidJawabanBenar) {
      setSelectedJawabanBenar(detailSoal.uuidJawabanBenar);
    }
  }, [detailSoal]);

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
        <div className="md:col-span-2 border border-gray-200 p-4 rounded-lg shadow-sm min-h-[400px]">
          {detailSoal ? (
            <>
              <Textarea
                label="Pertanyaan"
                placeholder="Masukkan pertanyaan"
                value={pertanyaanInput}
                onChange={(e) => setPertanyaanInput(e.target.value)}
                className="mb-3"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <Input
                    label="Bobot"
                    type="text"
                    placeholder="Masukkan bobot"
                    value={bobotInput}
                    onChange={(e) => setBobotInput(e.target.value)}
                    className="mb-3"
                  />
                </div>

                <div>
                  <Input
                    label="Pertanyaan Gambar"
                    type="file"
                    placeholder="Upload file gambar"
                    onChange={handleGambarChange}
                    accept="image/*"
                    className="mb-3"
                  />
                </div>
              </div>

              {gambarPreview && (
                <div className="flex flex-col justify-center md:justify-center gap-3">
                  <p>Preview Gambar</p>
                  <img
                    src={gambarPreview}
                    alt="Preview"
                    className="w-full md:w-1/2 lg:w-1/3 rounded-md mb-3"
                  />
                </div>
              )}

              {/* <span
                className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full ${
                  detailSoal.state === "init"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {detailSoal.state}
              </span> */}

              <hr className="border border-gray-200" />

              <div className="flex justify-between align-center my-4">
                <h3 className="font-semibold">Daftar Jawaban</h3>
                <Button
                  loading={loading}
                  onClick={handleShowAddJawabanModal}
                  className="px-2 py-1 text-xs font-medium"
                  variant="primary"
                >
                  <div className="flex items-center">
                    <FaPlus size={12} className="mr-2" />
                    Tambah Jawaban
                  </div>
                </Button>
              </div>

              <div className="mb-3 text-red-600 italic">Ceklis untuk menentukan jawaban benar</div>

              {listJawaban.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {listJawaban.map((jawaban) => (
                    <li
                      key={jawaban.uuid}
                      className="p-2 px-4 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedJawabanBenar === jawaban.uuid}
                          onChange={() =>
                            handleSelectCorrectAnswer(jawaban.uuid)
                          }
                          className="mr-2 w-6 h-6 appearance-none border-2 border-gray-300 rounded-md checked:bg-purple-600 checked:border-purple-600 checked:ring-2 checked:ring-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <p className="text-gray-800">{jawaban.jawabanText}</p>
                        {jawaban.jawabanImg && (
                          <img
                            src={`/uploads/${jawaban.jawabanImg}`}
                            alt="Jawaban"
                            className="w-16 h-16 object-cover rounded-md ml-2"
                          />
                        )}
                      </div>

                      {/* Tombol Hapus */}
                      <button
                        onClick={() => handleConfirmDeleteJawaban(jawaban)}
                        className="bg-red-300 text-white px-2 py-1 text-xs rounded-md hover:bg-red-600 transition"
                      >
                        X
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 mt-2">Belum ada jawaban.</p>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center flex-col">
              <p className="text-gray-500 text-center">
                Silahkan pilih nomor soal terlebih dahulu.
              </p>
            </div>
          )}
        </div>

        {/* Grid Nomor Soal + Tombol */}
        <div className="flex flex-col justify-between">
          {/* Grid Nomor Soal */}
          <div className="grid grid-cols-5 gap-4 border border-gray-200 p-4 rounded-lg shadow-sm h-auto">
            {filteredSoalList.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center">
                Belum ada soal untuk kategori ini.
              </p>
            ) : (
              filteredSoalList.map((soal, index) => (
                <div
                  key={soal.uuid}
                  onClick={() => {
                    fetchDetailSoal(soal.uuid);
                    fetchListJawaban(soal.uuid);
                  }}
                  className="relative border border-gray-200 rounded-lg shadow-sm bg-gray-50 flex items-center justify-center text-lg font-bold text-gray-700 cursor-pointer hover:bg-purple-200 hover:border-purple-600 transition aspect-square"
                >
                  {/* Tombol Hapus di Pojok Kanan Atas */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Agar tidak memicu klik detail
                      handleConfirmDelete(soal);
                    }}
                    className="absolute -top-2 -right-2 bg-red-300 hover:bg-red-600 text-white px-2 py-1 text-xs rounded-md transition"
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
            <Button onClick={handleSave} className="w-full" variant="success">
              Simpan
            </Button>
            <Button
              onClick={() => console.log("Simpan data semua")}
              className="w-full"
              variant="primary"
            >
              Selesai
            </Button>
          </div>
        </div>
      </div>

      {/* Modal Tambah Jawaban */}
      <Modal
        isOpen={showAddJawabanModal}
        title="Tambah Jawaban"
        onConfirm={handleAddJawaban}
        onCancel={() => {
          setShowAddJawabanModal(false);
          setLoading(false);
        }}
        confirmText="Tambah"
        cancelText="Batal"
        variant="primary"
      >
        <Input
          label="Jawaban Text"
          type="text"
          placeholder="Masukkan jawaban"
          value={jawabanText}
          onChange={(e) => setJawabanText(e.target.value)}
          className="mb-3"
        />

        <Input
          label="Jawaban Gambar"
          type="file"
          placeholder="Upload gambar jawaban"
          onChange={handleJawabanImgChange}
          accept="image/*"
          className="mb-3"
        />

        {jawabanPreview && (
          <img
            src={jawabanPreview}
            alt="Preview"
            className="w-full rounded-md mb-3"
          />
        )}
      </Modal>

      {/* Modal Konfirmasi Hapus */}
      <Modal
        isOpen={showConfirm}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus soal nomor ${
          filteredSoalList.findIndex(
            (soal) => soal.uuid === selectedSoal?.uuid
          ) + 1
        }? Pastikan kembali data ujian tidak masuk masa "proses ujian"`}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        confirmText="Hapus"
        cancelText="Batal"
      />

      {/* Modal Konfirmasi Hapus Jawaban */}
      <Modal
        isOpen={showConfirmDeleteJawaban}
        title="Konfirmasi Hapus Jawaban"
        message={`Apakah Anda yakin ingin menghapus jawaban ini?`}
        onConfirm={handleDeleteJawabanConfirmed}
        onCancel={() => setShowConfirmDeleteJawaban(false)}
        confirmText="Hapus"
        cancelText="Batal"
      />
    </div>
  );
};

export default SoalList;
