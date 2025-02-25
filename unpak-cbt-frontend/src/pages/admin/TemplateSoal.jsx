import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import SoalForm from "./SoalForm";
import SoalList from "./SoalList";

const TemplateSoal = () => {
  const location = useLocation();
  const uuid = location.state?.uuid;
  const [soalList, setSoalList] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("UUID dari state:", uuid);

  const fetchSoalList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/TemplatePertanyaan/BankSoal/${uuid}`);
      setSoalList(response.data);
    } catch (error) {
      console.error("Error fetching template soal:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoalList();
  }, [uuid]);

  return (
    <>
      {/* Breadcrumb */}
      <nav className="text-gray-600 text-sm mb-4">
        <Link
          to="/admin/bank-soal"
          className="font-bold text-purple-700 hover:underline"
        >
          Bank Soal
        </Link>{" "}
        /<span className="text-gray-500"> Template Soal</span>
      </nav>

      <div className="grid grid-cols-1 gap-6">
        {/* Form Tambah Soal */}
        <SoalForm uuid={uuid} fetchSoalList={fetchSoalList} />

        {/* List Soal dari API */}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <SoalList soalList={soalList} setSoalList={setSoalList} uuid={uuid} />
        )}
      </div>
    </>
  );
};

export default TemplateSoal;
