import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import NavbarMaba from "../../components/NavbarMaba";
import Button from "../../components/Button";

const SoalUjian = () => {
  const { uuid, tipe } = useParams();
  const navigate = useNavigate();

  const [pertanyaan, setPertanyaan] = useState([]);
  const [jawaban, setJawaban] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedJawaban, setSelectedJawaban] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [status, setStatus] = useState("");

  const [examData, setExamData] = useState(() => {
    const storedData = sessionStorage.getItem("examData");
    return storedData ? JSON.parse(storedData) : null;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ujian = (await axios.get(`/api/Ujian/${uuid}`)).data;
        const jadwal = (
          await axios.get(`/api/JadwalUjian/${ujian.uuidJadwalUjian}`)
        ).data;

        const soalResponse = (
          await axios.get(
            `/api/TemplatePertanyaan/BankSoal/${jadwal.uuidBankSoal}?IdBankSoal=${jadwal.uuidBankSoal}`
          )
        ).data;

        const filtered = soalResponse
          .filter((item) => item.tipe === tipe)
          .sort((a, b) => a.uuid.localeCompare(b.uuid));

        setPertanyaan(filtered);

        console.log("Soal:", filtered);

        const jawabanRes = await axios.get(
          `/api/TemplateJawaban/BankSoal/${jadwal.uuidBankSoal}`
        );
        setJawaban(jawabanRes.data);

        // Timer
        const end = new Date(`${jadwal.tanggal}T${jadwal.jamAkhir}`).getTime();
        const timer = setInterval(() => {
          const now = Date.now();
          if (now <= end) {
            setTimeLeft(Math.floor((end - now) / 1000));
            setStatus("ongoing");
          } else {
            setStatus("finished");
            setTimeLeft(0);
          }
        }, 1000);
        return () => clearInterval(timer);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [uuid, tipe]);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const currentPertanyaan = pertanyaan[currentIndex];
  const jawabanForCurrentPertanyaan = jawaban.filter(
    (jwb) => jwb.uuidTemplateSoal === currentPertanyaan?.uuid
  );

  const kirimJawaban = async (uuidTemplateSoal, uuidJawabanBenar) => {
    if (!examData) {
      alert("Data ujian tidak tersedia.");
      return;
    }

    const payload = {
      uuidUjian: examData.idUjian,
      noReg: examData.npm,
      uuidTemplateSoal: uuidTemplateSoal,
      uuidJawabanBenar: uuidJawabanBenar,
    };

    try {
      const response = await axios.put("/api/Ujian/Cbt", payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Jawaban berhasil dikirim:", response.data);
    } catch (error) {
      if (error.response) {
        console.error("Gagal mengirim jawaban:", error.response.data);
        alert(
          `Error: ${
            error.response.data?.message || "Terjadi kesalahan pada server."
          }`
        );
      } else if (error.request) {
        console.error("Tidak ada respons dari server:", error.request);
        alert(
          "Gagal menghubungi server. Pastikan koneksi internet Anda stabil."
        );
      } else {
        console.error("Kesalahan tak terduga:", error.message);
        alert("Terjadi kesalahan tak terduga. Coba lagi nanti.");
      }
    }
  };

  return (
    <>
      <NavbarMaba>
        <Button variant="outline" onClick={() => navigate(-1)}>
          ← Kembali
        </Button>
        <img
          src="/src/assets/images/logo-unpak.png"
          alt="Logo"
          className="h-10 w-auto"
        />
      </NavbarMaba>

      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto p-4">
          {/* Pesan Tidak Ada Sinyal */}
          {/* <div className="my-4 bg-red-100 text-red-600 rounded-xl px-4 py-3 text-center">
            Tidak ada sinyal
          </div> */}
          <div className="text-right mt-4">
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                status === "finished"
                  ? "bg-red-100 text-red-700"
                  : status === "ongoing"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {status === "finished"
                ? "Waktu Habis"
                : `Sisa waktu: ${
                    timeLeft ? formatTime(timeLeft) : "Loading..."
                  }`}
            </span>
          </div>
          <div className="mt-6 flex flex-col lg:flex-row gap-6">
            {/* Bagian Soal & Jawaban */}
            <div className="flex-1 bg-white shadow-lg rounded-xl p-6">
              {pertanyaan.length > 0 && currentIndex !== null && (
                <>
                  <div className="flex items-start gap-3 my-4">
                    <span className="text-xl font-bold">
                      {currentIndex + 1}.
                    </span>
                    <div>
                      <h1 className="text-lg md:text-xl font-semibold mb-3">
                        {pertanyaan[currentIndex].pertanyaan}
                      </h1>
                      {pertanyaan[currentIndex].gambar && (
                        <img
                          src={`/uploads/${pertanyaan[currentIndex].gambar}`}
                          alt="soal"
                          className="rounded-lg max-h-64 object-cover"
                        />
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 mt-4">
                    {jawabanForCurrentPertanyaan.map((jwb) => (
                      <label
                        key={jwb.uuid}
                        className={`flex items-center gap-3 cursor-pointer border p-3 rounded-lg hover:bg-gray-50 ${
                          selectedJawaban[currentPertanyaan.uuid] === jwb.uuid
                            ? "border-purple-400 bg-purple-50"
                            : "border-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          className="form-radio text-purple-500"
                          checked={
                            selectedJawaban[currentPertanyaan.uuid] === jwb.uuid
                          }
                          onChange={() => {
                            setSelectedJawaban({
                              ...selectedJawaban,
                              [currentPertanyaan.uuid]: jwb.uuid,
                            });

                            kirimJawaban(currentPertanyaan.uuid, jwb.uuid);
                          }}
                        />

                        {jwb.jawabanImg && (
                          <img
                            src={`/uploads/${jwb.jawabanImg}`}
                            alt="Jawaban"
                            className="h-12 w-auto object-cover"
                          />
                        )}
                        <span>{jwb.jawabanText}</span>
                      </label>
                    ))}
                  </div>

                  {/* Tombol Navigasi */}
                  <div className="flex justify-between mt-8">
                    <Button
                      variant="secondary"
                      disabled={currentIndex === 0}
                      onClick={() => setCurrentIndex(currentIndex - 1)}
                    >
                      ← Sebelumnya
                    </Button>
                    <Button
                      variant="primary"
                      disabled={currentIndex === pertanyaan.length - 1}
                      onClick={() => setCurrentIndex(currentIndex + 1)}
                    >
                      Selanjutnya →
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Nomor Soal */}
            <div className="w-full lg:w-72 bg-white shadow-lg rounded-xl p-4 lg:p-5 h-fit sticky top-4 overflow-hidden">
              <div className="text-center font-semibold mb-4">Daftar Soal</div>
              <div className="grid grid-cols-5 gap-2 max-h-[50vh] overflow-y-auto">
                {pertanyaan.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`aspect-square flex items-center justify-center rounded cursor-pointer transition-colors duration-200 ${
                      idx === currentIndex
                        ? "bg-purple-500 text-white"
                        : selectedJawaban[pertanyaan[idx].uuid]
                        ? "bg-green-200"
                        : "bg-gray-100"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tombol Selesai (hanya muncul jika ujian berlangsung) */}
          {status === "ongoing" && (
            <div className="text-center mt-6">
              <Button variant="primary" size="lg" onClick={() => {}}>
                Selesai & Kirim Jawaban
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SoalUjian;
