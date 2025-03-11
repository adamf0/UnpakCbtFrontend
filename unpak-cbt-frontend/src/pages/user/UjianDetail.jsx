import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavbarMaba from "../../components/NavbarMaba";
import Button from "../../components/Button";
import axios from "axios";

const UjianMabaDetail = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [jadwalUjian, setJadwalUjian] = useState(null);
  const [groupedPertanyaan, setGroupedPertanyaan] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [status, setStatus] = useState("");

  const tipeUrutan = ["TPA", "BI", "MTK"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil data ujian
        const ujianResponse = await axios.get(`/api/Ujian/${uuid}`);

        // Ambil jadwal ujian
        const jadwalResponse = await axios.get(
          `/api/JadwalUjian/${ujianResponse.data.uuidJadwalUjian}`
        );
        setJadwalUjian(jadwalResponse.data);

        // Ambil pertanyaan dan langsung kelompokkan berdasarkan tipe
        const pertanyaanResponse = await axios.get(
          `/api/TemplatePertanyaan/BankSoal/${jadwalResponse.data.uuidBankSoal}?IdBankSoal=${jadwalResponse.data.uuidBankSoal}`
        );

        const grouped = pertanyaanResponse.data.reduce((acc, item) => {
          acc[item.tipe] = [...(acc[item.tipe] || []), item];
          return acc;
        }, {});
        setGroupedPertanyaan(grouped);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [uuid]);

  // Logic Timer
  useEffect(() => {
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
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [jadwalUjian]);

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
            : `Sisa waktu: ${
                timeLeft !== null ? formatTime(timeLeft) : "Loading..."
              }`}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          {tipeUrutan
            .filter((tipe) => groupedPertanyaan[tipe]) // hanya tampilkan jika ada datanya
            .map((tipe) => (
              <div
                key={tipe}
                onClick={() => navigate(`/maba/ujian/${uuid}/tipe/${tipe}`)}
                className="border rounded shadow p-6 cursor-pointer hover:bg-gray-100 flex items-center justify-center text-center font-semibold text-xl"
              >
                {tipe === "BI" ? "Bahasa Inggris" : tipe}
              </div>
            ))}
        </div>

        {status === "finished" && (
          <div className="mt-8 text-center text-red-500 font-semibold">
            Ujian telah berakhir.
          </div>
        )}
      </div>
    </>
  );
};

export default UjianMabaDetail;
