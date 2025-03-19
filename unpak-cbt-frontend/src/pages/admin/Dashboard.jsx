import { useState, useEffect } from "react";
import axios from "axios";
import {
  HiOutlineCalendar,
  HiOutlineExclamationCircle,
  HiOutlineClock,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { FaCheckCircle, FaTimesCircle, FaCommentDots } from "react-icons/fa";
import Select from "../../components/Select";
import Input from "../../components/Input";

const AdminDashboard = () => {
  const [jadwalUjian, setJadwalUjian] = useState([]);
  const [ujianAktif, setUjianAktif] = useState([]);
  const [laporan, setLaporan] = useState(null);
  const [isEmptyData, setIsEmptyData] = useState(false); // Flag untuk data kosong
  const [filterData, setFilterData] = useState({
    type: "total", // Default value "total"
    uuidJadwalUjian: "",
    tanggalMulai: "",
    tanggalAkhir: "",
  });

  // Fetch jadwal ujian dari API saat pertama kali render
  useEffect(() => {
    const fetchJadwalUjian = async () => {
      try {
        const response = await axios.get("/api/JadwalUjian");
        const jadwal = response.data;

        setJadwalUjian(
          jadwal.map((item) => ({
            label: `${item.deskripsi} - ${item.tanggal} (${item.jamMulai} - ${item.jamAkhir})`,
            value: item.uuid,
          }))
        );
      } catch (error) {
        console.error("Error fetching jadwal ujian:", error);
      }
    };

    const fetchUjianAktif = async () => {
      try {
        const response = await axios.get("/api/JadwalUjian/active");
        console.log("Ujian Aktif:", response.data);

        if (response.data && typeof response.data === "object") {
          // Jika hanya ada satu ujian aktif, langsung simpan ke state
          setUjianAktif(response.data);
        } else {
          // Jika tidak ada data atau format tidak sesuai, reset state
          setUjianAktif(null);
        }
      } catch (error) {
        console.error("Error fetching ujian aktif:", error);

        // Jika API mengembalikan status 400, berarti tidak ada ujian aktif
        if (error.response && error.response.status === 400) {
          setUjianAktif(null);
        } else {
          setUjianAktif(null);
        }
      }
    };

    fetchJadwalUjian();
    fetchUjianAktif();
  }, []);

  // Fetch laporan saat pertama kali halaman dimuat (mengirim hanya "type")
  useEffect(() => {
    fetchLaporan({ type: filterData.type });
  }, [filterData.type]);

  // Function untuk menangani perubahan filter
  const handleFilterChange = (key, value) => {
    setFilterData((prev) => {
      const newFilterData = { ...prev, [key]: value };
      fetchLaporan(newFilterData);
      return newFilterData;
    });
  };

  // Fetch laporan ujian setiap kali filter berubah
  const fetchLaporan = async (filters) => {
    try {
      const response = await axios.post("/api/Laporan/lulus", filters);
      if (response.status === 200) {
        setLaporan(response.data);
        setIsEmptyData(false);
      } else {
        setLaporan(null);
        setIsEmptyData(true);
      }
    } catch (error) {
      console.error("Error fetching laporan ujian:", error);
      if (error.response && error.response.status === 404) {
        setIsEmptyData(true);
      } else {
        setIsEmptyData(false);
      }
      setLaporan(null);
    }
  };

  // Menentukan warna status ujian
  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return "bg-green-100 text-green-700";
      case "upcoming":
        return "bg-yellow-100 text-yellow-700";
      case "finished":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tipe Data (Hanya Muncul di Mobile) */}
        <div className="bg-white shadow-md rounded-lg p-6 block lg:hidden">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Tipe Data
          </h2>
          <Select
            label="Pilih Tipe Data"
            options={[
              { label: "Total", value: "total" },
              { label: "List", value: "list" },
            ]}
            value={filterData.type}
            onChange={(value) => handleFilterChange("type", value)}
          />
        </div>

        {/* Laporan Ujian - Lebih besar, menempati 2 kolom di desktop */}
        <div className="lg:col-span-2 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Laporan</h2>

          {/* Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <Select
              label="Pilih Jadwal Ujian"
              options={jadwalUjian}
              value={filterData.uuidJadwalUjian}
              onChange={(value) => handleFilterChange("uuidJadwalUjian", value)}
            />
            <Input
              label="Tanggal Mulai"
              type="date"
              value={filterData.tanggalMulai}
              onChange={(e) =>
                handleFilterChange("tanggalMulai", e.target.value)
              }
            />
            <Input
              label="Tanggal Akhir"
              type="date"
              value={filterData.tanggalAkhir}
              onChange={(e) =>
                handleFilterChange("tanggalAkhir", e.target.value)
              }
            />
          </div>

          {/* Empty State Jika Tidak Ada Data */}
          {filterData.type === "list" && isEmptyData && (
            <div className="text-center p-6 flex flex-col items-center">
              <HiOutlineExclamationCircle className="text-gray-400 text-7xl mb-4" />
              <p className="text-gray-600 text-lg font-semibold">
                Data tidak ditemukan.
              </p>
            </div>
          )}

          {/* Tampilkan Kartu Jika Type == 'total' */}
          {filterData.type === "total" &&
            laporan &&
            typeof laporan === "object" && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Tidak Lulus */}
                <div className="relative border border-gray-200 rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center text-center font-semibold text-base bg-red-50 hover:bg-red-100 transition">
                  <div className="p-4 rounded-full mb-3 bg-red-200 text-red-700">
                    <FaTimesCircle className="text-4xl" />
                  </div>
                  <span className="text-sm font-semibold">
                    Total Tidak Lulus
                  </span>
                  <p className="text-4xl font-bold text-red-800 mt-2">
                    {laporan.totalTidakLulus}
                  </p>
                </div>

                {/* Total Lulus */}
                <div className="relative border border-gray-200 rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center text-center font-semibold text-base bg-green-50 hover:bg-green-100 transition">
                  <div className="p-4 rounded-full mb-3 bg-green-200 text-green-700">
                    <FaCheckCircle className="text-4xl" />
                  </div>
                  <span className="text-sm font-semibold">Total Lulus</span>
                  <p className="text-4xl font-bold text-green-800 mt-2">
                    {laporan.totalLulus}
                  </p>
                </div>

                {/* Total Lulus Dengan Respon */}
                <div className="relative border border-gray-200 rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center text-center font-semibold text-base bg-purple-50 hover:bg-purple-100 transition">
                  <div className="p-4 rounded-full mb-3 bg-purple-200 text-purple-700">
                    <FaCommentDots className="text-4xl" />
                  </div>
                  <span className="text-sm font-semibold">
                    Total Lulus Dengan Respon
                  </span>
                  <p className="text-4xl font-bold text-purple-800 mt-2">
                    {laporan.totalLulusDenganRespon}
                  </p>
                </div>
              </div>
            )}

          {/* Tampilkan Tabel Jika Type == 'list' */}
          {filterData.type === "list" &&
            Array.isArray(laporan) &&
            laporan.length > 0 &&
            !isEmptyData && (
              <div className="overflow-x-auto overflow-y-auto max-h-[400px] mt-6 p-2">
                <table className="w-full border border-gray-300 rounded-lg overflow-hidden shadow-md text-sm">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="p-2 text-left border">No. Reg</th>
                      <th className="p-2 text-left border">Deskripsi</th>
                      <th className="p-2 text-left border">Tanggal</th>
                      <th className="p-2 text-left border">Jam Mulai</th>
                      <th className="p-2 text-left border">Jam Akhir</th>
                      <th className="p-2 text-left border">Keputusan</th>
                      <th className="p-2 text-left border">Tanggal Respon</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {laporan.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="p-2 border">{item.noReg}</td>
                        <td className="p-2 border">{item.deskripsi}</td>
                        <td className="p-2 border">{item.tanggal}</td>
                        <td className="p-2 border">{item.jamMulai}</td>
                        <td className="p-2 border">{item.jamAkhir}</td>
                        <td className="p-2 border">{item.keputusan ?? "-"}</td>
                        <td className="p-2 border">
                          {item.tanggalRespon ?? "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>

        {/* Sidebar: Tipe Data (Hanya Muncul di Desktop) dan Ujian Aktif */}
        <div className="flex flex-col gap-6">
          {/* Tipe Data (Hanya Muncul di Desktop) */}
          <div className="bg-white shadow-md rounded-lg p-6 hidden lg:block">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Tampilan Data
            </h2>
            <Select
              label="Pilih Tamplan Data"
              options={[
                { label: "Total", value: "total" },
                { label: "List", value: "list" },
              ]}
              value={filterData.type}
              onChange={(value) => handleFilterChange("type", value)}
            />
          </div>

          {/* Ujian Aktif */}
          <div className="bg-white shadow-md rounded-lg p-6">
          
            {ujianAktif ? (
              <div>
                {/* Nama Ujian */}
                <h3 className="text-lg font-bold text-purple-600 mb-2">
                  {ujianAktif.deskripsi}
                </h3>

                {/* Detail Ujian */}
                <div className="text-gray-700 text-sm space-y-2">
                  <p className="flex items-center gap-2">
                    <HiOutlineCalendar className="text-lg text-gray-500" />
                    <span className="font-medium">Tanggal:</span>{" "}
                    {ujianAktif.tanggal}
                  </p>
                  <p className="flex items-center gap-2">
                    <HiOutlineClock className="text-lg text-gray-500" />
                    <span className="font-medium">Waktu:</span>{" "}
                    {ujianAktif.jamMulai} - {ujianAktif.jamAkhir}
                  </p>
                  <p className="flex items-center gap-2">
                    <HiOutlineUserGroup className="text-lg text-gray-500" />
                    <span className="font-medium">Peserta:</span>{" "}
                    {ujianAktif.totalJoin}
                  </p>
                </div>
                <hr className="mt-4 border-gray-200" />
                {/* Badge Status */}
                <div className="flex items-center justify-center mt-4">
                  <span
                    className={`flex items-center gap-2 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                      ujianAktif.statusUjian === "ongoing"
                        ? "bg-green-200 text-green-800"
                        : ujianAktif.statusUjian === "upcoming"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {ujianAktif.statusUjian === "ongoing" ? (
                      <>
                        <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                        Sedang Berlangsung
                      </>
                    ) : ujianAktif.statusUjian === "upcoming" ? (
                      <>
                        <span className="w-2 h-2 bg-yellow-600 rounded-full animate-pulse"></span>
                        Akan Datang
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                        Selesai
                      </>
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 flex flex-col items-center">
                <HiOutlineCalendar className="text-gray-400 text-7xl mb-4" />
                <p className="text-gray-600 text-lg font-semibold">
                  Tidak ada ujian aktif saat ini.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
