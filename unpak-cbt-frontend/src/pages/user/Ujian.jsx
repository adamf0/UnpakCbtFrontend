import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiProduction, formatDate } from "@src/Constant";
import LoadingScreen from "../../components/LoadingScreen";
// import logo from "@assets/images/logo-unpak.png";
const Logo = lazy(() =>
  import("@assets/images/logo-unpak.png").then((mod) => ({
    default: () => <img src={mod.default} alt="Logo" className="h-16" />,
  }))
);

const UjianMaba = () => {
  const { uuid, noReg } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTime, setLoadingTime] = useState(true);
  const [dataUjian, setDataUjian] = useState(null);
  const [jadwal, setJadwal] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [status, setStatus] = useState("");

  const version = import.meta.env.MODE; //process.env.VITE_NODE_ENV;
  const isProduction = version == "production";

  useEffect(() => {
    const fetchDataUjian = async () => {
      if (!uuid || !noReg) return;

      try {
        const response = await apiProduction.get(`/api/Ujian/${uuid}/${noReg}`);
        setDataUjian(response.data);
        console.log("Data Ujian:", response.data);

        if (response.data.uuidJadwalUjian) {
          const jadwalResponse = await apiProduction.get(
            `/api/JadwalUjian/${response.data.uuidJadwalUjian}`
          );
          console.log("Data Jadwal Ujian:", jadwalResponse.data);
          setJadwal(jadwalResponse.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data ujian:", error);
        setDataUjian(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDataUjian();
  }, [uuid, noReg]);

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

        setLoadingTime(false);
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

  const handleStartExam = async () => {
    try {
      setIsLoading(true); // Aktifkan loading saat tombol ditekan

      // Jika status sudah "start", langsung navigasi tanpa API PUT
      if (dataUjian.status === "start") {
        navigate(`/maba/ujian/${dataUjian.uuid}`, {
          state: {
            noReg: dataUjian.noReg,
            idUjian: dataUjian.uuid,
            idJadwalUjian: dataUjian.uuidJadwalUjian,
          },
        });
        return;
      }

      // Jika status masih "active", jalankan API untuk memulai ujian
      if (dataUjian.status === "active") {
        const payload = {
          id: dataUjian.uuid,
          noReg: dataUjian.noReg,
        };

        await apiProduction.put(`/api/Ujian/Start`, payload, {
          headers: { "Content-Type": "application/json" },
        });

        // Update sessionStorage untuk menyimpan status ujian
        localStorage.setItem(
          "examData",
          JSON.stringify({
            noReg: dataUjian.noReg,
            idUjian: dataUjian.uuid,
            idJadwalUjian: dataUjian.uuidJadwalUjian,
          })
        );
      }

      // Navigasi ke halaman ujian setelah API berhasil dijalankan
      navigate(`/maba/ujian/${dataUjian.uuid}`, {
        state: {
          noReg: dataUjian.noReg,
          idUjian: dataUjian.uuid,
          idJadwalUjian: dataUjian.uuidJadwalUjian,
        },
      });
    } catch (error) {
      console.error("Gagal memulai ujian:", error);
      alert("Terjadi kesalahan saat memulai ujian. Silakan coba lagi.");
    } finally {
      setIsLoading(false); // Nonaktifkan loading setelah selesai
    }
  };

  const handleTrialExam = () => {
    try {
      setIsLoading(true);
  
      // Simpan data ujian trial ke sessionStorage
      localStorage.setItem(
        "examData",
        JSON.stringify({
          noReg: dataUjian.noReg,
          idUjian: dataUjian.uuid,
          idJadwalUjian: dataUjian.uuidJadwalUjian,
          idBankSoal: jadwal.uuidBankSoalTrial, // <-- bedakan pakai soal trial
          isTrial: true, // <-- tambahan flag supaya tahu ini ujian trial
        })
      );
  
      // Navigasi ke halaman ujian
      navigate(`/maba/ujian/${dataUjian.uuid}`, {
        state: {
          noReg: dataUjian.noReg,
          idUjian: dataUjian.uuid,
          idJadwalUjian: dataUjian.uuidJadwalUjian,
          idBankSoal: jadwal.uuidBankSoalTrial, // <-- pakai soal trial
          isTrial: true,
        },
      });
    } catch (error) {
      console.error("Gagal memulai uji coba:", error);
      alert("Terjadi kesalahan saat memulai uji coba. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
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
    return <LoadingScreen message="Sedang memuat data..." />;
  }

  return (
    <>
      <div className="flex bg-purple-400 flex-col items-center justify-center min-h-[100vh] px-4 py-4">
        <div className="flex justify-center mb-4">
          <Suspense fallback={<div className="text-center py-10">Loading logo...</div>}>
            <Logo/>
          </Suspense>
        </div>
        <h2 className="text-2xl font-bold text-white text-center">
          Selamat Datang Calon Mahasiswa Baru!
        </h2>
        <p className="text-white mb-8">di Portal Computer Based Test (CBT).</p>

        <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden">
          {dataUjian && jadwal ? (
            <>
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-5 text-center">
                <h1 className="text-lg md:text-xl font-bold text-white">
                  No Registrasi : {dataUjian.noReg}
                </h1>
              </div>

              <div className="px-6 pt-8 pb-4 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Deskripsi</span>
                    <span className="font-semibold text-gray-800 text-lg">
                      {jadwal.deskripsi}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Tanggal Ujian</span>
                    <span className="font-semibold text-gray-800 text-lg">
                      {formatDate(jadwal.tanggal)}
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
                </div>

                {dataUjian.status === "cancel" && (
                  <div className="mt-4 px-4 py-3 bg-red-100 border border-red-400 text-red-600 rounded-lg text-center">
                    <div className="flex justify-center items-start gap-2">
                      <p className="text-sm font-medium">
                        Anda tidak dapat memulai ujian karena status ujian Anda
                        tidak aktif. Harap lapor ke admin PMB untuk mengaktifkan
                        kembali.
                      </p>
                    </div>
                  </div>
                )}

                {dataUjian.status === "done" && (
                  <div className="mt-4 px-4 py-3 bg-green-100 border border-green-400 text-green-600 rounded-lg text-center">
                    <div className="flex justify-center items-center gap-2">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <p className="text-sm font-medium">
                        Anda telah menyelesaikan Ujian CBT. Selamat!
                      </p>
                    </div>
                  </div>
                )}

                {status === "ongoing" &&
                  (dataUjian.status === "active" ||
                    dataUjian.status === "start") && (
                    <div className="mt-4">
                      <button
                        onClick={handleStartExam}
                        disabled={isLoading}
                        className="w-full font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-xl shadow-md 
                                  hover:from-purple-600 hover:to-indigo-600 hover:shadow-lg transition-all duration-300 ease-in-out"
                      >
                        {isLoading ? "Memulai..." : "Mulai Ujian"}
                      </button>
                    </div>
                  )}

                {status === "waiting" && dataUjian.status === "active" && (
                  <>
                    {dataUjian.freeTrial === 0 ? (
                      <div className="mt-4">
                        <button
                          onClick={handleTrialExam}
                          className="w-full font-bold bg-yellow-400 py-3 rounded-xl shadow-md 
                          hover:bg-yellow-500 hover:shadow-lg transition-all duration-300 ease-in-out"
                        >
                          Uji Coba Ujian
                        </button>
                      </div>
                    ) : (
                      <div className="mt-4 px-4 py-3 bg-green-100 border border-green-400 text-green-600 rounded-lg text-center">
                        <p className="text-sm font-medium">
                          Uji coba ujian telah dilakukan.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="text-center px-4 py-5 rounded-b-xl bg-indigo-50">
                {loadingTime && (
                  <p className="text-gray-500 font-semibold">
                    Memuat data ujian...
                  </p>
                )}

                {!loadingTime && status === "waiting" && (
                  <div>
                    <p className="text-gray-600 font-medium">
                      Ujian akan dimulai dalam:
                    </p>
                    <p className="text-indigo-600 text-2xl font-bold mt-1">
                      {formatTime(timeLeft)}
                    </p>
                  </div>
                )}

                {!loadingTime && status === "ongoing" && (
                  <div>
                    <p className="text-gray-600 font-medium">
                      Ujian sedang berlangsung, sisa waktu:
                    </p>
                    <p className="text-green-600 text-2xl font-bold mt-1">
                      {formatTime(timeLeft)}
                    </p>
                  </div>
                )}

                {!loadingTime && status === "finished" && (
                  <p className="text-red-600 font-semibold">
                    Ujian telah selesai.
                  </p>
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
                Data ujian tidak ditemukan untuk No Registrasi:{" "}
                <span className="font-semibold text-gray-800">{noReg}</span>
              </p>
            </div>
          )}
        </div>
        <div className="text-sm text-center text-white mt-5">
          © {new Date().getFullYear()} Universitas Pakuan. All Rights Reserved.
        </div>
      </div>
    </>
  );
};

export default UjianMaba;
