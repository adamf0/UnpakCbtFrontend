import PulseLoader from "react-spinners/PulseLoader";

const LoadingScreen = ({
  color = "#6366F1",
  message = "Sedang memuat data...",
}) => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="flex justify-center mb-4">
        <img
          src="/src/assets/images/logo-unpak.png"
          alt="Logo"
          className="h-24"
        />
      </div>
      <div className="mb-8">
        <PulseLoader
          color={color}
          loading={true}
          size={24}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingScreen;
