import React, { useState } from "react";

const Textarea = ({
  label,
  placeholder,
  value,
  onChange,
  className = "",
  required = false,
}) => {
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleBlur = () => {
    setIsFocused(false);
    if (required && !value.trim()) {
      setError(`${label || "Field"} tidak boleh kosong`);
    } else {
      setError("");
    }
  };

  return (
    <div className="w-full relative">
      {label && <label className="block text-gray-700 mb-2">{label}</label>}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${
          isFocused || value.trim() ? "bg-white" : "bg-gray-100"
        } ${className}`}
        rows="4"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Textarea;
