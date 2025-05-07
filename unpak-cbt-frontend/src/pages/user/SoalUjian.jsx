import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiProduction, baseUrl } from "@src/Constant";
import NavbarMaba from "../../components/NavbarMaba";
import Button from "../../components/Button";
import LoadingScreen from "../../components/LoadingScreen";
import logo from "@assets/images/logo-unpak.png";
import process from "process";

const SoalUjian = () => {
  const { uuid, tipe } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [pertanyaan, setPertanyaan] = useState([]);
  const [jawaban, setJawaban] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedJawaban, setSelectedJawaban] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [status, setStatus] = useState("");
  const [answeredQuestions, setAnsweredQuestions] = useState(new Map());

  const [examData] = useState(() => {
    const storedData = sessionStorage.getItem("examData");
    return storedData ? JSON.parse(storedData) : null;
  });

  const isTrial = examData?.isTrial || false;

  const version = process.env.VITE_NODE_ENV;
  const isProduction = version == "production";
  console.log(`version: ${version}`)
  console.log("Environment:", import.meta.env);

  useEffect(() => {
    if (isTrial) return;

    const validateExamStatus = async () => {
      if (!examData?.idUjian || !examData?.noReg) return;

      try {
        const statusResponse = await apiProduction.get(
          `/api/Ujian/${examData.idUjian}/${examData.noReg}`
        );

        if (statusResponse.data.status == "active") {
          alert("Ujian tidak dapat diakses karena status belum mulai ujian.");
          navigate(`/maba/${examData.idUjian}/${examData.noReg}`);
        }
        if (statusResponse.data.status == "done") {
          alert("Ujian tidak dapat diakses karena status sudah selesai.");
          navigate(`/maba/${examData.idUjian}/${examData.noReg}`);
        }
      } catch (error) {
        console.error("Gagal memvalidasi status ujian:", error);
        alert("Terjadi kesalahan saat memverifikasi status ujian.");
        navigate(`/maba/${examData.idUjian}/${examData.noReg}`);
      }
    };

    validateExamStatus();
  }, [examData?.idUjian, examData?.noReg, isTrial]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jadwal = (
          await apiProduction.get(`/api/JadwalUjian/${examData?.idJadwalUjian}`)
        ).data;

        const bankSoalId = isTrial
          ? jadwal.uuidBankSoalTrial
          : jadwal.uuidBankSoal;

        const soalResponse = (
          await apiProduction.get(
            `/api/TemplatePertanyaan/BankSoalV2/${bankSoalId}`
          )
        ).data;

        const filtered = soalResponse
          .filter((item) => item.tipe === tipe)
          .sort((a, b) => a.uuid.localeCompare(b.uuid));

        setPertanyaan(filtered);

        console.log("Soal:", filtered);

        const jawabanRes = await apiProduction.get(
          `/api/TemplateJawaban/BankSoalV2/${bankSoalId}`
        );        
        setJawaban(jawabanRes.data);

        // Timer
        const timer = setInterval(() => {
          const now = new Date();
          const start = new Date(`${jadwal.tanggal}T${jadwal.jamMulai}:00`);
          const end = new Date(`${jadwal.tanggal}T${jadwal.jamAkhir}:00`);

          if (now < start) {
            setStatus("waiting");
            setTimeLeft(Math.floor((start - now) / 1000));
          } else if (now >= start && now <= end) {
            setStatus("ongoing");
            setTimeLeft(Math.floor((end - now) / 1000));
          } else {
            setStatus("finished");
            setTimeLeft(0);
          }
          setLoading(false);
        }, 1000);
        return () => clearInterval(timer);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [uuid, tipe]);

  useEffect(() => {
    if (examData) {
      fetchAnsweredQuestions();
    }
  }, [examData]);

  const fetchAnsweredQuestions = async () => {
    try {
      const response = await apiProduction.get(
        `/api/Ujian/Cbt/${examData.idUjian}`
      );
      const answeredMap = new Map();

      response.data.forEach((item) => {
        if (item.uuidTemplatePilihan) {
          answeredMap.set(
            item.uuidTemplatePertanyaan,
            item.uuidTemplatePilihan
          );
        }
      });

      setAnsweredQuestions(answeredMap);
    } catch (error) {
      console.error("Error fetching answered questions:", error);
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
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
      noReg: examData.noReg,
      uuidTemplateSoal: uuidTemplateSoal,
      uuidJawabanBenar: uuidJawabanBenar,
    };

    if (isTrial) {
      payload.mode = "trial";
    }

    try {
      await apiProduction.put("/api/Ujian/Cbt", payload, {
        headers: { "Content-Type": "application/json" },
      });

      setAnsweredQuestions(
        (prev) => new Map([...prev, [uuidTemplateSoal, uuidJawabanBenar]])
      );
    } catch (error) {
      console.error("Gagal mengirim jawaban:", error);
      alert("Terjadi kesalahan, coba lagi.");
    }
  };

  useEffect(() => {
    // Cegah klik kanan
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // Cegah beberapa shortcut keyboard untuk inspect element
    const handleKeyDown = (e) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault();
      }
      // Ctrl+Shift+I
      if (isProduction && e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
      }
      // Ctrl+Shift+J
      if (isProduction && e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
      }
      // Ctrl+U (biasanya untuk melihat source code)
      if (isProduction && e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (loading) {
    return <LoadingScreen message="Sedang memuat data ujian..." />;
  }

  return (
    <>
      <NavbarMaba>
        <Button variant="outline" onClick={() => navigate(-1)}>
          ← Kembali
        </Button>
        <img src={logo} alt="Logo" className="h-10 w-auto" />
      </NavbarMaba>

      <div style={{ userSelect: "none" }} className="bg-gray-100 min-h-screen">
        <div className="container mx-auto p-4">
          {/* Pesan Tidak Ada Sinyal */}
          {/* <div className="my-4 bg-red-100 text-red-600 rounded-xl px-4 py-3 text-center">
            Tidak ada sinyal
          </div> */}
          {!isTrial && (
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
                : status === "waiting"
                ? `Menunggu Dimulai (${
                    timeLeft ? formatTime(timeLeft) : "Loading..."
                  })`
                : `Sisa waktu: ${
                    timeLeft ? formatTime(timeLeft) : "Loading..."
                  }`}
            </span>
          </div>
          )}
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
                          src={`${baseUrl}/api/uploads/${pertanyaan[currentIndex].gambar}`}
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
                            answeredQuestions.get(currentPertanyaan.uuid) ===
                            jwb.uuid
                          }
                          disabled={status === "finished"}
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
                            src={`${baseUrl}/api/uploads/${jwb.jawabanImg}`}
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
                      onClick={() => {
                        const now = (currentIndex - 1)
                        if(now>=0){
                          setCurrentIndex(now)
                        }
                      }}
                    >
                      ← Sebelumnya
                    </Button>
                    <Button
                      variant="primary"
                      disabled={currentIndex === pertanyaan.length - 1}
                      onClick={() => {
                        const index = (currentIndex+1)
                        if(index<=pertanyaan.length - 1){
                          setCurrentIndex(index)
                        }                        
                      }}
                    >
                      Selanjutnya →
                    </Button>
                  </div>
                </>
              )}
            </div>
            <div>
              {/* Nomor Soal */}
              <div className="w-full lg:w-72 bg-white shadow-lg rounded-xl p-4 lg:p-5 h-fit sticky top-4 overflow-hidden">
                <div className="text-center font-semibold mb-4">
                  Daftar Soal
                </div>
                <div className="grid grid-cols-5 gap-2 max-h-[50vh] overflow-y-auto">
                  {pertanyaan.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`aspect-square flex items-center justify-center rounded cursor-pointer transition-colors ${
                        idx === currentIndex
                          ? "bg-purple-500 text-white"
                          : answeredQuestions.has(item.uuid)
                          ? "bg-green-200"
                          : "bg-gray-100"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
              {/* Tombol Selesai (hanya muncul jika ujian berlangsung) */}
              {status === "ongoing" && (
                <div className="text-center mt-6">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      navigate(-1);
                    }}
                  >
                    Selesai Mengerjakan {tipe ? `(${tipe})` : ""}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SoalUjian;
