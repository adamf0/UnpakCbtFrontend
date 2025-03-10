import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import NavbarMaba from "../../components/NavbarMaba";
import Button from "../../components/Button";

const UjianMabaDetail = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("UUID Ujian:", uuid);
    // fetch detail ujian berdasarkan uuid
  }, [uuid]);

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
      <div>Detail Ujian dengan UUID: {uuid}</div>;
    </>
  );
};

export default UjianMabaDetail;
