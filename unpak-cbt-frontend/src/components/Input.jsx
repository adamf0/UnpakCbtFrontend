import React, { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  required = false,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === "password" && isPasswordVisible ? "text" : type;

  const handleBlur = () => {
    setIsFocused(false);
    if (required && !value) {
      setError(`${label || "Field"} tidak boleh kosong`);
    } else {
      setError("");
    }
  };

  return (
    <div className="w-full relative">
      {label && <label className="block text-sm font-medium text-gray-900 mb-2">{label}</label>}
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-100 ${
            isFocused || value ? "bg-white" : "bg-gray-100"
          } ${className}`}
        />
        {type === "password" && (
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? <HiEye size={20} /> : <HiEyeOff size={20} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
