import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { apiProduction } from "@src/Constant";
import * as signalR from "@microsoft/signalr";
import { FiFileText, FiCalendar, FiClock, FiUsers } from "react-icons/fi";

const UjianAdminDetail = () => {
  const { uuid } = useParams();
  const [dataUjian, setDataUjian] = useState([]);
  const [detailUjian, setDetailUjian] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionState, setConnectionState] = useState("Disconnected");

  const getStatusBadge = (status) => {
    let base = "px-2 py-1 rounded text-xs font-semibold";
    switch (status) {
      case "done":
        return `${base} bg-green-100 text-green-700`;
      case "active":
        return `${base} bg-yellow-100 text-yellow-700`;
      case "start":
        return `${base} bg-blue-100 text-blue-700`;
      default:
        return `${base} bg-red-100 text-red-700`;
    }
  };

  // Fetch data ujian
  const fetchUjianList = useCallback(async () => {
    if (!uuid) return;
    try {
      setLoading(true);
      const response = await apiProduction.get(`/api/Ujian/${uuid}/List`);
      console.log("Fetched Data:", response.data);
      setDataUjian(response.data);
    } catch (error) {
      console.error("Gagal memuat data ujian:", error);
    } finally {
      setLoading(false);
    }
  }, [uuid]);

  // Panggil fetch saat uuid berubah
  useEffect(() => {
    fetchUjianList();
  }, [fetchUjianList]);

  const fetchDetailUjian = useCallback(async () => {
    if (!uuid) return;
    try {
      const response = await apiProduction.get(`/api/JadwalUjian/${uuid}`);
      setDetailUjian(response.data);
    } catch (error) {
      console.error("Gagal memuat detail ujian:", error);
    }
  }, [uuid]);

  useEffect(() => {
    fetchDetailUjian();
  }, [fetchDetailUjian]);

  // Setup SignalR hanya sekali
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://seb.unpak.ac.id/api/JadwalUjianHub")
      .withAutomaticReconnect()
      .build();

    // Event listener
    connection.onreconnecting(() => setConnectionState("Reconnecting..."));
    connection.onreconnected(() => setConnectionState("Connected"));
    connection.onclose(() => setConnectionState("Disconnected"));

    // Start connection
    connection
      .start()
      .then(() => {
        setConnectionState("Connected");
        console.log("SignalR connected.");
      })
      .catch((err) => {
        setConnectionState("Disconnected");
        console.error("SignalR Connection Error:", err);
      });

    // Saat ada update dari server
    connection.on("ReceiveJadwalUjianUpdate", (message) => {
      console.log("SignalR Update:", message);
      fetchUjianList();
    });

    // Clean up saat unmount
    return () => {
      connection.stop();
      setConnectionState("Disconnected");
      console.log("SignalR disconnected.");
    };
  }, [fetchUjianList]);

  return (
    <>
      <nav className="text-gray-600 text-sm mb-4">
        <Link
          to="/admin/ujian"
          className="font-bold text-purple-700 hover:underline"
        >
          Jadwal Ujian
        </Link>{" "}
        / <span className="text-gray-500">Detail</span>
      </nav>

      {detailUjian && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex items-start gap-3">
            <FiFileText className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Deskripsi</p>
              <p className="font-medium text-gray-800 text-sm">
                {detailUjian.deskripsi}
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex items-start gap-3">
            <FiCalendar className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Tanggal</p>
              <p className="font-medium text-gray-800 text-sm">
                {new Date(detailUjian.tanggal).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex items-start gap-3">
            <FiClock className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Jam Ujian</p>
              <p className="font-medium text-gray-800 text-sm">
                {detailUjian.jamMulai} - {detailUjian.jamAkhir}
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex items-start gap-3">
            <FiUsers className="w-5 h-5 text-purple-500 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Kuota</p>
              <p className="font-medium text-gray-800 text-sm">
                {detailUjian.kouta} peserta
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 text-xs flex items-center gap-2">
        <span className="text-gray-500">Status koneksi:</span>
        <span
          className={`px-2 py-1 rounded-full font-medium ${
            connectionState === "Connected"
              ? "bg-green-100 text-green-700"
              : connectionState === "Reconnecting..."
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {connectionState}
        </span>
      </div>

      {!loading && (
        <>
          {dataUjian.length > 0 ? (
            <table className="w-full border border-gray-300 rounded-lg overflow-hidden shadow-md text-sm">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-2 text-center ">No</th>
                  <th className="p-2 text-left ">No. Reg</th>
                  <th className="p-2 text-left ">Nama</th>
                  <th className="p-2 text-left ">Foto</th>
                  <th className="p-2 text-center ">Status</th>
                  <th className="p-2 text-center ">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dataUjian.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="p-2  text-center">{index + 1}</td>
                    <td className="p-2 ">{item.noReg}</td>
                    <td className="p-2 ">-</td>
                    <td className="p-2 ">-</td>
                    <td className="p-2  text-center">
                      <span className={getStatusBadge(item.status)}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-2  text-center">
                      {item.status === "done" || item.status === "active" ? (
                        <button
                          disabled
                          className="px-3 py-1 bg-gray-300 text-gray-600 text-xs rounded cursor-not-allowed"
                        >
                          Lihat
                        </button>
                      ) : (
                        <a
                          href={`/maba/${item.uuid}/${item.noReg}`}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          Lihat
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="mt-6 text-center text-gray-500 text-sm">
              Belum ada data ujian tersedia.
            </div>
          )}
        </>
      )}
    </>
  );
};

export default UjianAdminDetail;
