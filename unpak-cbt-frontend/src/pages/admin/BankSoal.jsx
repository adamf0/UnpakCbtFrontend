import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiCalendarDate, CiViewList } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import Modal from "../../components/Modal";

const BankSoal = () => {
  const [data, setData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUUID, setSelectedUUID] = useState(null);
  const dropdownRefs = useRef({}); // Gunakan objek untuk referensi banyak dropdown
  const [selectedTitle, setSelectedTitle] = useState("");

  useEffect(() => {
    axios
      .get("/api/BankSoal")
      .then((response) => {
        setData(response.data);
        console.log("Data fetched:", response.data);
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

  const handleConfirmDelete = (uuid, judul, event) => {
    event.stopPropagation(); // Mencegah klik bocor
    setSelectedUUID(uuid);
    setSelectedTitle(judul);
    setShowConfirm(true);
    setDropdownOpen(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/BankSoal/${selectedUUID}`);
      setData((prevData) =>
        prevData.filter((item) => item.uuid !== selectedUUID)
      );
      alert("Data berhasil dihapus!");
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
        <span className="text-gray-500">Bank Soal</span>
      </nav>

      {/* Header */}
      <div className="flex justify-end items-center mb-4">
        <Link to="/admin/bank-soal/tambah">
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
          let parsedRule = {};

          try {
            parsedRule = JSON.parse(item.rule.replace(/'/g, '"'));
          } catch (error) {
            console.error("Error parsing rule:", error);
          }

          return (
            <div
              key={item.uuid}
              className={`relative bg-white shadow-md rounded-lg p-4 border-l-4 ${
                item.status === "active" ? "border-green-500" : "border-red-500"
              }`}
            >
              {/* Judul Bank Soal */}
              <h3 className="text-lg font-semibold break-words mb-3">
                {item.judul}
              </h3>

              {/* Tanggal & Jadwal */}
              <div className="flex items-center text-purple-400">
                <CiCalendarDate size={16} className="mr-2" />
                <span className="text-sm">01 Jan 2025</span>
              </div>
              <div className="flex items-center text-purple-400 mb-4">
                <CiViewList size={16} className="mr-2" />
                <span className="text-sm">
                  {item.jadwalTerhubung} Jadwal Terhubung
                </span>
              </div>

              {/* Fakultas */}
              <p className="text-sm text-gray-600 break-words">
                <strong>Fakultas:</strong>{" "}
                {parsedRule.fakultas && parsedRule.fakultas.length > 0
                  ? parsedRule.fakultas.map((f) => f.label).join(", ")
                  : "-"}
              </p>

              {/* Prodi */}
              <p className="text-sm text-gray-600 break-words">
                <strong>Prodi:</strong>{" "}
                {parsedRule.prodi && parsedRule.prodi.length > 0
                  ? parsedRule.prodi.map((p) => p.label).join(", ")
                  : "-"}
              </p>

              {/* Jenjang */}
              <p className="text-sm text-gray-600 break-words">
                <strong>Jenjang:</strong>{" "}
                {parsedRule.jenjang && parsedRule.jenjang.length > 0
                  ? parsedRule.jenjang.map((j) => j.label).join(", ")
                  : "-"}
              </p>

              {/* Badge Status */}
              <span
                className={`absolute bottom-3 right-3 inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                  item.status === "active"
                    ? "text-green-600 bg-green-100"
                    : "text-red-600 bg-red-100"
                }`}
              >
                {item.status === "active" ? "Aktif" : "Non-aktif"}
              </span>

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
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Non-Aktif
                      </li>
                      <Link to={`/admin/bank-soal/template/${item.uuid}`}>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={(event) => event.stopPropagation()}
                        >
                          Template Soal
                        </li>
                      </Link>
                      <Link to={`/admin/bank-soal/edit/${item.uuid}`}>
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
                          handleConfirmDelete(item.uuid, item.judul, event)
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
        message={`Apakah Anda yakin ingin menghapus data "${selectedTitle}" ? pastikan kembali jadwal yang terhubung dengan bank soal ini.`}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        confirmText="Hapus"
        cancelText="Batal"
      />
    </>
  );
};

export default BankSoal;
