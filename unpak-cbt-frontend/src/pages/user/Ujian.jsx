import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../../components/Button";
import { PulseLoader } from "react-spinners";
import NavbarMaba from "../../components/NavbarMaba";

const UjianMaba = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { npm } = location.state || {};

  const color = "oklch(0.71 0.19 306.6)";

  const [loading, setLoading] = useState(true);
  const [dataUjian, setDataUjian] = useState(null);
  const [jadwal, setJadwal] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchDataUjian = async () => {
      try {
        const response = await axios.get("/api/Ujian");
        const data = response.data;

        const matchedData = data.find((item) => item.noReg === npm);
        setDataUjian(matchedData || null);

        if (matchedData) {
          const jadwalResponse = await axios.get(
            `/api/JadwalUjian/${matchedData.uuidJadwalUjian}`
          );
          setJadwal(jadwalResponse.data);
          console.log("Jadwal Ujian:", jadwalResponse.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data ujian:", error);
        setDataUjian(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDataUjian();
  }, [npm]);

  useEffect(() => {
    let timer;
    if (jadwal) {
      timer = setInterval(() => {
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
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [jadwal]);

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

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="mb-8">
          <PulseLoader
            color={color}
            loading={loading}
            size={24}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
        <p className="text-gray-600">Sedang memuat data ujian...</p>
      </div>
    );
  }

  return (
    <>
      {/* Navbar */}
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

      {/* Main Content */}
      <div className="flex bg-purple-400 flex-col items-center justify-center min-h-[calc(100vh-72px)] px-4 py-8">
        <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-8">
          {dataUjian && jadwal ? (
            <>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-600 mb-6 text-center border-b border-gray-200 pb-4">
                Jadwal Ujian Anda
              </h1>

              <div className="space-y-3 text-left">
                <div className="flex justify-between py-2">
                  <span className="font-medium text-gray-600">
                    No Registrasi
                  </span>
                  <span className="font-semibold">{dataUjian.noReg}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium text-gray-600">Deskripsi</span>
                  <span className="font-semibold">{jadwal.deskripsi}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium text-gray-600">Tanggal</span>
                  <span className="font-semibold">{jadwal.tanggal}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium text-gray-600">Jam Mulai</span>
                  <span className="font-semibold">{jadwal.jamMulai}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium text-gray-600">Jam Akhir</span>
                  <span className="font-semibold">{jadwal.jamAkhir}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium text-gray-600">Kuota</span>
                  <span className="font-semibold">{jadwal.kouta}</span>
                </div>
              </div>

              <div className="mt-6 py-4 px-5 bg-purple-100 rounded-lg text-center shadow-sm">
                {status === "waiting" && (
                  <p className="text-blue-500 font-semibold">
                    Ujian akan dimulai dalam: {formatTime(timeLeft)}
                  </p>
                )}
                {status === "ongoing" && (
                  <p className="text-green-500 font-semibold">
                    Ujian sedang berlangsung, sisa waktu: {formatTime(timeLeft)}
                  </p>
                )}
                {status === "finished" && (
                  <p className="text-red-500 font-semibold">
                    Ujian telah berakhir.
                  </p>
                )}
              </div>

              {status === "ongoing" && (
                <div className="mt-8">
                  <Button
                    variant="primary"
                    className="w-full py-3 text-lg"
                    onClick={() => navigate(`/maba/ujian/${dataUjian.uuid}`)}
                  >
                    Mulai Ujian
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="size-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-xl">
                Data ujian tidak ditemukan untuk NPM:{" "}
                <span className="font-semibold">{npm}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UjianMaba;
