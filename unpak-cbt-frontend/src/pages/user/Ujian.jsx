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

  // Fungsi untuk memulai ujian
  const handleStartExam = async () => {
    try {
      // const payload = {
      //   id: dataUjian.uuid,
      //   noReg: dataUjian.noReg,
      // };

      // const response = await axios.put(
      //   `/api/Ujian/Start/${dataUjian.uuid}`,
      //   payload,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );

      // console.log("Ujian dimulai:", response);

      sessionStorage.setItem(
        "examData",
        JSON.stringify({
          npm: dataUjian.noReg,
          idUjian: dataUjian.uuid,
          idJadwalUjian: dataUjian.uuidJadwalUjian,
        })
      );

      // Redirect ke halaman ujian setelah berhasil
      navigate(`/maba/ujian/${dataUjian.uuid}`, {
        state: {
          npm: dataUjian.noReg,
          idUjian: dataUjian.uuid,
          idJadwalUjian: dataUjian.uuidJadwalUjian,
        },
      });

    } catch (error) {
      console.error("Gagal memulai ujian:", error);
      alert("Terjadi kesalahan saat memulai ujian. Silakan coba lagi.");
    }
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
        <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden">
          {dataUjian && jadwal ? (
            <>
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-5 text-center">
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  Jadwal Ujian Anda
                </h1>
              </div>

              <div className="px-6 py-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">No Registrasi</span>
                    <span className="font-semibold text-gray-800 text-lg">
                      {dataUjian.noReg}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Deskripsi</span>
                    <span className="font-semibold text-gray-800 text-lg">
                      {jadwal.deskripsi}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Tanggal Ujian</span>
                    <span className="font-semibold text-gray-800 text-lg">
                      {jadwal.tanggal}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Jam Mulai</span>
                    <span className="font-semibold text-gray-800 text-lg">
                      {jadwal.jamMulai}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Jam Berakhir</span>
                    <span className="font-semibold text-gray-800 text-lg">
                      {jadwal.jamAkhir}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Kuota Peserta</span>
                    <span className="font-semibold text-gray-800 text-lg">
                      {jadwal.kouta}
                    </span>
                  </div>
                </div>

                <div className="mt-8 text-center px-4 py-3 rounded-xl bg-indigo-50">
                  {status === "waiting" && (
                    <p className="text-indigo-600 font-semibold">
                      Ujian akan dimulai dalam: {formatTime(timeLeft)}
                    </p>
                  )}
                  {status === "ongoing" && (
                    <p className="text-green-600 font-semibold">
                      Ujian sedang berlangsung, sisa waktu:{" "}
                      {formatTime(timeLeft)}
                    </p>
                  )}
                  {status === "finished" && (
                    <p className="text-red-600 font-semibold">
                      Ujian telah berakhir.
                    </p>
                  )}
                  {!status && (
                    <p className="text-gray-500 font-semibold">Loading...</p>
                  )}
                </div>

                {status === "ongoing" && (
                  <div className="mt-8">
                    <button
                      onClick={handleStartExam}
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-xl shadow-md hover:shadow-lg hover:from-purple-600 hover:to-indigo-600 transition duration-200 text-lg font-semibold"
                    >
                      Mulai Ujian
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="py-12 px-6 text-center">
              <div className="mx-auto flex size-16 bg-red-100 items-center justify-center rounded-full mb-5">
                <svg
                  className="size-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-lg">
                Data ujian tidak ditemukan untuk NPM:{" "}
                <span className="font-semibold text-gray-800">{npm}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UjianMaba;
