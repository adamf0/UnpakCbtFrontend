import axios from "axios";

const SoalList = ({ soalList, setSoalList, uuid }) => {
  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus soal ini?")) {
      axios
        .delete(`/api/TemplatePertanyaan/${uuid}`)
        .then(() => {
          setSoalList((prev) => prev.filter((soal) => soal.id !== id));
        })
        .catch((error) => {
          console.error("Error deleting soal:", error);
        });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Daftar Soal</h2>
      {soalList.length === 0 ? (
        <p className="text-gray-500">Belum ada soal ditambahkan.</p>
      ) : (
        <ul>
          {soalList.map((soal) => (
            <li
              key={soal.id}
              className="border-b py-2 flex justify-between items-center"
            >
              <span>{soal.pertanyaan}</span>
              <button
                onClick={() => handleDelete(soal.id)}
                className="bg-red-600 text-white px-2 py-1 text-sm rounded-md"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SoalList;
