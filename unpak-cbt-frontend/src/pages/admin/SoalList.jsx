import { useEffect, useState } from "react";
import { apiProduction, baseUrl } from "@src/Constant";
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
  const [loadingRemoveImage, setLoadingRemoveImage] = useState(false);

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
    .sort((a, b) => a.id - b.id);

  // Fetch detail soal
  const fetchDetailSoal = async (id) => {
    try {
      const response = await apiProduction.get(`/api/TemplatePertanyaan/${id}`);
      setDetailSoal(response.data);
      console.log("Detail soal:", response.data);

      // Set input berdasarkan data yang didapat
      setPertanyaanInput(response.data.pertanyaan || "");
      setBobotInput(response.data.bobot || "");
      setGambarPreview(
        response.data.gambar
          ? `${baseUrl}/api/uploads/${response.data.gambar}`
          : null
      );
      setGambarInput(null);
    } catch (error) {
      console.error("Error fetching detail soal:", error);
      setDetailSoal(null);
    }
  };

  const handlerRemoveImage = async (id) => {
    setLoadingRemoveImage(false);

    try {
      const response = await apiProduction.get(`/api/TemplatePertanyaan/${id}/RemoveImage`);
      console.log("remove image template soal",response.status,response.data)

      if(response.status==200){
        setDetailSoal((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            gambar: null,
          };
        });
      } else{
        alert("gagal hapus gambar soal")
      }
    } catch (error) {
      console.error("Error remove image soal:", error);
      setDetailSoal(null);
    } finally {
      setLoadingRemoveImage(false);
    }
  };

  // Fetch daftar jawaban
  const fetchListJawaban = async (id) => {
    try {
      const response = await apiProduction.get("/api/TemplateJawaban");

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
      await apiProduction.delete(
        `/api/TemplateJawaban/${selectedJawaban.uuid}`
      );
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

      await apiProduction.post("/api/TemplateJawaban", formData, {
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
      await apiProduction.delete(
        `/api/TemplatePertanyaan/${selectedSoal.uuid}`
      );

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

      await apiProduction.put("/api/TemplatePertanyaan", formData, {
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
    if (detailSoal?.uuid) {
      fetchListJawaban(detailSoal.uuid);
    }
  }, [detailSoal]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Daftar Soal</h2>

      {/* Tabs */}
      <div className="flex mb-4 border-b-2 border-gray-200 overflow-x-auto no-scrollbar">
        {uniqueTypes.map((type) => (
          <button
            key={type}
            onClick={() => {
              setActiveTab(type);
              setSelectedSoal(null);
              setDetailSoal(null);
              setListJawaban([]);
              setPertanyaanInput("");
              setBobotInput("");
              setGambarPreview(null);
              setSelectedJawabanBenar(null);
            }}
            className={`py-3 px-5 text-sm font-semibold transition-all rounded-t-md ${
              activeTab === type
                ? "border-b-4 border-purple-500 text-purple-600 bg-purple-100"
                : "border-transparent border-b-4 text-gray-500 hover:text-purple-600 hover:bg-gray-100"
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
                <div class="flex flex-col justify-center gap-3">
                  <p>Preview Gambar</p>
                  <div class="relative w-full md:w-1/2 lg:w-1/3">
                    <img
                      alt="Preview"
                      class="w-full rounded-md"
                      src={gambarPreview}
                    />
                    <button
                      disabled={loadingRemoveImage}
                      onClick={()=> handlerRemoveImage(detailSoal.uuid)}
                      class="absolute -top-2 -right-2 
                            ms-auto bg-red-300 text-white px-2 py-1 text-xs rounded-md hover:bg-red-600 transition
                            flex items-center justify-center transition"
                      type="button"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

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

              <div className="mb-3 text-red-600 italic">
                Ceklis untuk menentukan jawaban benar
              </div>

              {listJawaban.length > 0 ? (
                <div className="mt-2 space-y-2">
                  {listJawaban.map((jawaban) => (
                    <label
                      key={jawaban.uuid}
                      className={`flex items-center gap-3 cursor-pointer border p-3 rounded-lg hover:bg-gray-50 ${
                        selectedJawabanBenar === jawaban.uuid
                          ? "border-purple-400 bg-purple-50"
                          : "border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        className="form-radio text-purple-500"
                        checked={selectedJawabanBenar === jawaban.uuid}
                        onChange={() => handleSelectCorrectAnswer(jawaban.uuid)}
                      />

                      <p className="text-gray-800">{jawaban.jawabanText}</p>
                      {jawaban.jawabanImg && (
                        <img
                          src={`${baseUrl}/api/uploads/${jawaban.jawabanImg}`}
                          alt="Jawaban"
                          className="w-16 h-16 object-cover rounded-md ml-2"
                        />
                      )}

                      <button
                        onClick={() => handleConfirmDeleteJawaban(jawaban)}
                        className="ms-auto bg-red-300 text-white px-2 py-1 text-xs rounded-md hover:bg-red-600 transition"
                      >
                        X
                      </button>
                    </label>
                  ))}
                </div>
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
                    setSelectedSoal(soal);
                  }}
                  className={`relative border border-gray-200 rounded-lg shadow-sm bg-gray-50 flex items-center justify-center text-lg font-bold text-gray-700 cursor-pointer hover:bg-purple-200 hover:border-purple-600 transition aspect-square ${
                    selectedSoal?.uuid === soal.uuid
                      ? "bg-purple-200 border-purple-600"
                      : soal.uuidJawabanBenar
                      ? "bg-green-100 border-green-500"
                      : "bg-gray-50 border-gray-200 hover:bg-purple-200 hover:border-purple-600"
                  }`}
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

          {/* Keterangan Warna */}
          <div className="flex flex-col gap-2 mb-auto mt-3 px-3 text-sm">
            <p className="font-medium text-gray-600">Keterangan:</p>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded border border-purple-600 bg-purple-200"></div>
                <span>Soal Aktif</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded border border-green-500 bg-green-100"></div>
                <span>Sudah Ada Jawaban</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded border border-gray-300 bg-white"></div>
                <span>Belum Ada Jawaban</span>
              </div>
            </div>
          </div>

          {/* Tombol Simpan & Simpan Permanen */}
          <div className="mt-4 flex space-x-2">
            <Button onClick={handleSave} className="w-full" variant="primary">
              Update & Simpan
            </Button>
            {/* <Button
              onClick={() => console.log("Simpan data semua")}
              className="w-full"
              variant="primary"
            >
              Selesai
            </Button> */}
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
