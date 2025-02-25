import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import SoalForm from "./SoalForm";
import SoalList from "./SoalList";

const TemplateSoal = () => {
  const { uuid } = useParams(); // Ambil ID bank soal dari URL
  const [soalList, setSoalList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/TemplatePertanyaan/${uuid}`)
      .then((response) => {
        setSoalList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching template soal:", error);
        setLoading(false);
      });
  }, [uuid]);

  return (
    <>
      {/* Breadcrumb */}
      <nav className="text-gray-600 text-sm mb-4">
        <Link to="/admin/bank-soal" className="font-bold text-purple-700 hover:underline">
          Bank Soal
        </Link>{" "}
        /<span className="text-gray-500"> Template Soal</span>
      </nav>

      {/* Form Tambah Soal */}
      <SoalForm uuid={uuid} setSoalList={setSoalList} />

      {/* List Soal */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <SoalList soalList={soalList} setSoalList={setSoalList} uuid={uuid} />
      )}
    </>
  );
};

export default TemplateSoal;
