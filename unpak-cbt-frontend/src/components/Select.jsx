import React, { useState } from "react";

const Select = ({ label, options = [], value, onChange, className = "", required = false }) => {
  const [error, setError] = useState("");

  const handleBlur = () => {
    if (required && !value) {
      setError(`${label || "Field"} tidak boleh kosong`);
    } else {
      setError("");
    }
  };

  return (
    <div className="w-full">
      {label && <label className="block text-gray-700 mb-2">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-100 ${className}`}
      >
        <option value="">Pilih {label}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Select;
