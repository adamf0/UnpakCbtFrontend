import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { apiProduction, apiSelectProduction } from "@src/Constant"
import SoalForm from "./SoalForm";
import SoalList from "./SoalList";

const TemplateSoal = () => {
  const location = useLocation();
  const uuid = location.state?.uuid;
  const judul = location.state?.judul;
  const [soalList, setSoalList] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("UUID dari state:", uuid);

  const fetchSoalList = async () => {
    setLoading(true);
    try {
      const response = await apiProduction.get(`/api/TemplatePertanyaan/BankSoal/${uuid}?IdBankSoal=${uuid}`);
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
        /<span className="text-gray-500"> Template Soal ({judul})</span>
      </nav>

      <div className="grid grid-cols-1 gap-2">
        {/* Form Tambah Soal */}
        <SoalForm uuid={uuid} fetchSoalList={fetchSoalList} />

        {/* List Soal dari API */}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <SoalList soalList={soalList} fetchSoalList={fetchSoalList} uuid={uuid} />
        )}
      </div>
    </>
  );
};

export default TemplateSoal;
