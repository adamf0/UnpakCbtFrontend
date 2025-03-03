import React from "react";

const Button = ({
  children,
  onClick,
  className = "",
  type = "button",
  loading = false,
  variant = "primary",
}) => {
  const variants = {
    primary: "bg-purple-500 hover:bg-purple-600 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
  };

  return (
    <button
      type={type}
      className={`px-4 py-2 rounded-md transition ${
        variants[variant] || variants.primary
      } ${loading ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? "Memproses..." : children}
    </button>
  );
};

export default Button;
