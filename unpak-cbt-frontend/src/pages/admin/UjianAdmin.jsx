import { useState, useEffect, useRef } from "react";
import { apiProduction, formatDate } from "@src/Constant";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { CiTimer, CiCalendarDate, CiDesktop } from "react-icons/ci";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import Modal from "../../components/Modal";

const UjianAdmin = () => {
  const [data, setData] = useState([]);
  const [bankSoal, setBankSoal] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRefs = useRef({});
  const [selectedUUID, setSelectedUUID] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // Fetch jadwal ujian
    apiProduction
      .get("/api/JadwalUjian")
      .then(async (response) => {
        const jadwal = response.data;
        console.log("Data fetched:", jadwal);
        setData(jadwal);

        // Filter hanya yang memiliki uuidBankSoal
        const bankSoalIds = jadwal
          .map((item) => item.uuidBankSoal)
          .filter((id) => id !== null);

        // Fetch semua judul bank soal secara paralel
        const bankSoalPromises = bankSoalIds.map((id) =>
          apiProduction.get(`/api/BankSoal/${id}`).then((res) => ({
            id,
            judul: res.data.judul, // Sesuaikan dengan struktur response API
          }))
        );

        // Tunggu semua request selesai
        const results = await Promise.all(bankSoalPromises);

        // Simpan hasilnya dalam objek { id: judul }
        const bankSoalMap = results.reduce((acc, item) => {
          acc[item.id] = item.judul;
          return acc;
        }, {});

        setBankSoal(bankSoalMap);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Fungsi untuk menutup dropdown jika klik terjadi di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownOpen !== null &&
        dropdownRefs.current[dropdownOpen] &&
        !dropdownRefs.current[dropdownOpen].contains(event.target)
      ) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside, true); // Pakai capture phase
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [dropdownOpen]);

  const toggleDropdown = (uuid) => {
    setDropdownOpen(dropdownOpen === uuid ? null : uuid);
  };

  const handleConfirmDelete = (uuid, tanggal, event) => {
    event.stopPropagation();
    setSelectedUUID(uuid);
    setSelectedTitle(formatDate(tanggal));
    setShowConfirm(true);
    setDropdownOpen(null);
  };

  const handleDelete = async () => {
    try {
      await apiProduction.delete(`/api/JadwalUjian/${selectedUUID}`);
      setData((prevData) =>
        prevData.filter((item) => item.uuid !== selectedUUID)
      );
      // alert("Data berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Terjadi kesalahan saat menghapus data.");
    } finally {
      setShowConfirm(false);
      setSelectedUUID(null);
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <nav className="text-gray-600 text-sm mb-4">
        <span className="text-gray-500">Jadwal Ujian</span>
      </nav>

      {/* Header */}
      <div className="flex justify-end items-center mb-4">
        <Link to="/admin/ujian/tambah">
          <Button>
            <div className="flex items-center">
              <FaPlus size={14} className="mr-2" />
              Tambah Data
            </div>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((item) => {
          return (
            <div
              key={item.uuid}
              className="relative bg-white shadow-md rounded-lg p-4 border-l-4 border-green-500"
            >
              {/* Tanggal Ujian */}

              <div className="flex items-center mb-3">
                <CiCalendarDate size={24} className="mr-2" />
                <span className="text-lg font-semibold break-words">
                  {formatDate(item.tanggal)}
                </span>
              </div>

              {/* Deskripsi Ujian */}
              <p className="text-sm break-words mb-3">{item.deskripsi}</p>

              {/* Jam & Kuota */}
              <div className="flex items-center text-purple-400">
                <CiDesktop size={16} className="mr-2" />
                <span className="text-sm">Kuota {item.kouta}</span>
              </div>
              <div className="flex items-center text-purple-400">
                <CiDesktop size={16} className="mr-2" />
                <span className="text-sm">Sisa Kuota {item.sisaKuota}</span>
              </div>
              <div className="flex items-center text-purple-400 mb-4">
                <CiTimer size={16} className="mr-2" />
                <span className="text-sm">
                  Jam {item.jamMulai} - {item.jamAkhir}
                </span>
              </div>

              {/* Deskripsi Ujian */}
              <p className="text-sm break-words">
                {item.uuidBankSoal
                  ? bankSoal[item.uuidBankSoal] || "Loading..."
                  : "-"}
              </p>

              {/* Dropdown */}
              <div
                className="absolute top-3 right-3"
                ref={(el) => (dropdownRefs.current[item.uuid] = el)}
              >
                <button
                  onClick={() => toggleDropdown(item.uuid)}
                  className="p-2 rounded-full hover:bg-gray-200"
                >
                  <BsThreeDotsVertical size={20} />
                </button>

                {dropdownOpen === item.uuid && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg border border-gray-200 rounded-md overflow-hidden z-50">
                    <ul className="py-1">
                      <Link to={`/admin/ujian/${item.uuid}`}>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={(event) => {
                            event.stopPropagation();
                          }}
                        >
                          Detail
                        </li>
                      </Link>
                      <Link to={`/admin/ujian/edit/${item.uuid}`}>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={(event) => event.stopPropagation()}
                        >
                          Edit
                        </li>
                      </Link>
                      <li
                        className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
                        onClick={(event) =>
                          handleConfirmDelete(item.uuid, item.tanggal, event)
                        }
                      >
                        Hapus
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={showConfirm}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus jadwal ujian "${selectedTitle}" ?`}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        confirmText="Hapus"
        cancelText="Batal"
      />
    </>
  );
};

export default UjianAdmin;
