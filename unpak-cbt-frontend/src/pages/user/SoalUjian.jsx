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

      <div className="container mx-auto p-4">
        <div className="text-right text-lg font-semibold">
          {status === "finished"
            ? "Waktu Habis"
            : `Sisa waktu: ${timeLeft ? formatTime(timeLeft) : "Loading..."}`}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {/* Pertanyaan dan Jawaban */}
          <div className="md:col-span-2">
            {pertanyaan.length > 0 && currentIndex !== null && (
              <div>
                <h1 className="text-xl font-bold mb-4">
                  {currentIndex + 1}.{" "}
                  {pertanyaan[currentIndex].gambar && (
                    <img
                      src={`/uploads/${pertanyaan[currentIndex].gambar}`}
                      alt="Pertanyaan"
                      className="max-w-[300px] mb-2"
                    />
                  )}
                  {pertanyaan[currentIndex].pertanyaan ||
                    "Pertanyaan tanpa teks"}
                </h1>
              </div>
            )}

            <div className="mt-4 space-y-4">
              {jawabanForCurrentPertanyaan.map((jwb) => (
                <div key={jwb.uuid} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`jawaban-${currentPertanyaan.uuid}`}
                    checked={
                      selectedJawaban[currentPertanyaan.uuid] === jwb.uuid
                    }
                    onChange={() =>
                      setSelectedJawaban((prev) => ({
                        ...prev,
                        [currentPertanyaan.uuid]: jwb.uuid,
                      }))
                    }
                    className="size-6"
                  />
                  {jwb.jawabanImg && (
                    <img
                      src={`/uploads/${jwb.jawabanImg}`}
                      alt="jawaban"
                      className="h-12 w-auto object-cover"
                    />
                  )}
                  <span>{jwb.jawabanText}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nomor Soal dan tombol selesai */}
          <div className="flex flex-col items-center gap-4">
            <div className="grid grid-cols-5 gap-2 border p-4 rounded-lg shadow">
              {pertanyaan.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`border cursor-pointer flex items-center justify-center size-10 rounded ${
                    idx === currentIndex ? "bg-purple-300" : "bg-white"
                  }`}
                >
                  {idx + 1}
                </div>
              ))}
            </div>

            <Button variant="primary" onClick={() => alert("Ujian selesai")}>
              Selesai
            </Button>
          </div>
        </div>

        <div className="text-center mt-8 py-2 bg-gray-100 rounded-md shadow">
          tidak ada sinyal
        </div>
      </div>
    </>
  );
};

export default SoalUjian;
