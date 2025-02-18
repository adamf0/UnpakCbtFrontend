import { useState, useEffect } from "react";
import axios from "axios";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

const BankSoal = () => {
  const [data, setData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUUID, setSelectedUUID] = useState(null);

  useEffect(() => {
    axios
      .get("/api/BankSoal")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const toggleDropdown = (uuid) => {
    setDropdownOpen(dropdownOpen === uuid ? null : uuid);
  };

  const handleConfirmDelete = (uuid) => {
    setSelectedUUID(uuid);   // simpan ID (UUID) yang ingin dihapus
    setShowConfirm(true);    // tampilkan modal konfirmasi
    setDropdownOpen(null);   // tutup dropdown
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/BankSoal/${selectedUUID}`);
      // Hapus item dari state agar tidak perlu reload
      setData((prevData) => prevData.filter((item) => item.uuid !== selectedUUID));

      alert("Data berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Terjadi kesalahan saat menghapus data.");
    } finally {
      // Tutup modal konfirmasi dan reset state
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
          <button className="flex items-center bg-purple-600 text-white text-sm px-4 py-2 rounded-md shadow-md hover:bg-purple-700 transition">
            <FaPlus size={14} className="mr-2" />
            Tambah Data
          </button>
        </Link>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((item) => (
          <div
            key={item.uuid}
            className="relative bg-white shadow-md rounded-lg p-4 border border-gray-200"
          >
            {/* Judul Bank Soal */}
            <h3 className="text-lg font-semibold">{item.judul}</h3>

            {/* Icon Three Dots untuk Dropdown */}
            <div className="absolute top-3 right-3">
              <button
                onClick={() => toggleDropdown(item.uuid)}
                className="p-2 rounded-full hover:bg-gray-200"
              >
                <BsThreeDotsVertical size={20} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen === item.uuid && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg border rounded-md overflow-hidden z-50">
                  <ul className="py-1">
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Non-Aktif
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Template Soal
                    </li>
                    <Link to={`/admin/bank-soal/edit/${item.uuid}`}>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Edit
                      </li>
                    </Link>
                    <li
                      className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
                      onClick={() => handleConfirmDelete(item.uuid)}
                    >
                      Hapus
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Konfirmasi Hapus */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-10">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Konfirmasi Hapus</h2>
            <p className="mb-4">Apakah Anda yakin ingin menghapus data ini?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BankSoal;
