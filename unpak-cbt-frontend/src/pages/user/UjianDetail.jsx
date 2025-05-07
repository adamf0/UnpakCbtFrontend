import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import NavbarMaba from "../../components/NavbarMaba";
import Button from "../../components/Button";
import { apiProduction, apiSelectProduction } from "@src/Constant";
import {
  FaBrain,
  FaSquareRootAlt,
  FaLanguage,
  FaTimesCircle,
} from "react-icons/fa";
import LoadingScreen from "../../components/LoadingScreen";
import logo from "@assets/images/logo-unpak.png";
import process from "process";

const styleMap = {
  TPA: {
    bg: "bg-purple-100",
    hover: "hover:bg-purple-50",
    iconColor: "text-purple-600",
  },
  MTK: {
    bg: "bg-green-100",
    hover: "hover:bg-green-50",
    iconColor: "text-green-600",
  },
  BI: {
    bg: "bg-blue-100",
    hover: "hover:bg-blue-50",
    iconColor: "text-blue-600",
  },
};

const UjianMabaDetail = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);

  const [jadwalUjian, setJadwalUjian] = useState(null);
  const [groupedPertanyaan, setGroupedPertanyaan] = useState({});
  const [answeredCount, setAnsweredCount] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [status, setStatus] = useState("");

  const tipeUrutan = ["TPA", "BI", "MTK"];

  const [examData, setExamData] = useState(() => {
    return location.state || JSON.parse(sessionStorage.getItem("examData"));
  });

  const isTrial = examData?.isTrial || false;
  const version = import.meta.env.MODE; //process.env.VITE_NODE_ENV;
  const isProduction = version == "production";

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
    if (location.state) {
      sessionStorage.setItem("examData", JSON.stringify(location.state));
    } else {
      const data = sessionStorage.getItem("examData");
      if (data) {
        setExamData(JSON.parse(data));
      }
    }
  }, [location.state]);

  useEffect(() => {
    console.log("noReg:", examData?.noReg);
    console.log("idUjian:", examData?.idUjian);
    console.log("idJadwalUjian:", examData?.idJadwalUjian);
  }, [examData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil jadwal ujian
        const jadwalResponse = await apiProduction.get(
          `/api/JadwalUjian/${examData?.idJadwalUjian}`
        );
        setJadwalUjian(jadwalResponse.data);

        // Ambil pertanyaan dan langsung kelompokkan berdasarkan tipe
        const bankSoalId = isTrial
          ? jadwalResponse.data.uuidBankSoalTrial
          : jadwalResponse.data.uuidBankSoal;
        const pertanyaanResponse = await apiProduction.get(
          `/api/TemplatePertanyaan/BankSoal/${bankSoalId}`
        );

        // const pertanyaanResponse = await apiProduction.get(
        //   `/api/TemplatePertanyaan/BankSoal/${jadwalResponse.data.uuidBankSoal}`
        // );

        const grouped = pertanyaanResponse.data.reduce((acc, item) => {
          acc[item.tipe] = [...(acc[item.tipe] || []), item];
          return acc;
        }, {});
        setGroupedPertanyaan(grouped);

        const jawabanResponse = await apiProduction.get(
          `/api/Ujian/Cbt/${examData.idUjian}`
        );

        // Hitung jumlah soal yang telah dijawab berdasarkan tipe
        const countedAnswers = jawabanResponse.data.reduce((acc, item) => {
          if (item.uuidTemplatePilihan && item.trial==(isTrial? "True":"False")) {
            acc[item.tipe] = (acc[item.tipe] || 0) + 1;
          }
          return acc;
        }, {});

        setAnsweredCount(countedAnswers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [uuid]);

  // Logic Timer
  useEffect(() => {
    if (isTrial) {
      setLoading(false); // kalau trial, tidak perlu timer
      return;
    }

    let timer;
    if (jadwalUjian) {
      timer = setInterval(() => {
        const now = new Date();
        const start = new Date(
          `${jadwalUjian.tanggal}T${jadwalUjian.jamMulai}:00`
        );
        const end = new Date(
          `${jadwalUjian.tanggal}T${jadwalUjian.jamAkhir}:00`
        );

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
    }

    return () => clearInterval(timer);
  }, [jadwalUjian, isTrial]);

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

  const handleSelesaiUjian = async () => {
    if (!examData) {
      alert("Data ujian tidak tersedia.");
      return;
    }

    try {
      const payload = {
        id: examData.idUjian,
        noReg: examData.noReg,
      };

      if (isTrial) {
        payload.mode = "trial";
      }

      await apiProduction.put(`/api/Ujian/Done`, payload);

      alert(isTrial? "Uji coba ujian telah selesai!":"Ujian telah selesai!");
      navigate(`/maba/${examData.idUjian}/${examData.noReg}`);
    } catch (error) {
      console.error("Gagal menyelesaikan ujian:", error);
      alert("Terjadi kesalahan, coba lagi.");
    }
  };

  useEffect(() => {
    console.log(`version: ${version}`)

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

      <div className="container mx-auto p-4">
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

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tipeUrutan
            .filter((tipe) => groupedPertanyaan[tipe])
            .map((tipe) => (
              <div
                key={tipe}
                onClick={() => navigate(`/maba/ujian/${uuid}/tipe/${tipe}`)}
                className={`relative border border-gray-200 rounded-xl shadow p-6 cursor-pointer flex flex-col items-center justify-center text-center font-semibold text-base ${styleMap[tipe].hover}`}
              >
                <div
                  className={`p-4 rounded-full mb-3 ${styleMap[tipe].bg} ${styleMap[tipe].iconColor}`}
                >
                  {tipe === "TPA" && <FaBrain className="text-4xl" />}
                  {tipe === "MTK" && <FaSquareRootAlt className="text-4xl" />}
                  {tipe === "BI" && <FaLanguage className="text-4xl" />}
                </div>
                <span>
                  {tipe === "BI"
                    ? "Bahasa Inggris"
                    : tipe === "MTK"
                    ? "Matematika"
                    : "Tes Potensi Akademik"}
                </span>
                <span className="mt-2 text-sm text-gray-600">
                  {answeredCount[tipe] || 0} / {groupedPertanyaan[tipe].length}{" "}
                  soal terjawab
                </span>
              </div>
            ))}
        </div>

        {status === "finished" && (
          <div className="mt-8 flex items-center justify-center text-red-500 font-semibold bg-red-100 text-red-700 p-4 rounded-lg">
            <FaTimesCircle className="text-2xl mr-2" /> Ujian telah berakhir.
          </div>
        )}

        {(status === "ongoing" || isTrial) && (
          <div className="mt-6 text-center">
            <Button variant="primary" size="lg" onClick={handleSelesaiUjian}>
              Selesai Mengerjakan Seluruh Ujian
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default UjianMabaDetail;
