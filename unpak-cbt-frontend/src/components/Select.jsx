import React, { useState, useRef, useEffect } from "react";

const Select = ({
  label,
  options = [],
  value,
  onChange,
  className = "",
  required = false,
  multiple = false,
  placeholder = "Pilih opsi",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const selectRef = useRef(null); // Referensi untuk elemen Select

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Tutup dropdown jika klik di luar area select
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Pilih nilai dari dropdown
  const handleSelect = (selectedValue) => {
    if (multiple) {
      const selectedValues = value.includes(selectedValue)
        ? value.filter((val) => val !== selectedValue)
        : [...value, selectedValue];

      onChange(selectedValues);
    } else {
      onChange(selectedValue);
      setIsOpen(false);
    }

    // Hapus pesan error setelah user memilih data pertama kali
    if (required) {
      setError("");
    }
  };

  // Validasi saat blur
  const handleBlur = () => {
    setIsFocused(false);
    if (required && (!value || (Array.isArray(value) && value.length === 0))) {
      setError(`${label || "Field"} tidak boleh kosong`);
    }
  };

  return (
    <div className="w-full relative" ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {label}
        </label>
      )}

      {/* Button for Select */}
      <button
        type="button"
        className={`grid w-full cursor-default grid-cols-1 rounded-md px-4 py-2 border border-gray-300 rounded-md bg-gray-100
          ${
            !disabled? `focus:outline-none focus:ring-2 focus:ring-purple-500` : ``
          }
          ${
            isFocused || value.length > 0 ? "bg-white" : "bg-gray-100"
          } ${className}`}
        onClick={toggleDropdown}
        // onBlur={handleBlur} // Validasi hanya dijalankan saat blur
        onFocus={() => setIsFocused(true)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span
          className={`col-start-1 row-start-1 flex items-center gap-3 pr-6 ${
            !value || (Array.isArray(value) && value.length === 0)
              ? "text-gray-400"
              : "text-gray-900"
          }`}
        >
          <span className="block truncate">
            {multiple
              ? value.length > 0
                ? value
                    .map(
                      (val) => options.find((opt) => opt.value === val)?.label
                    )
                    .join(", ")
                : placeholder // Gunakan placeholder jika multiple kosong
              : options.find((opt) => opt.value === value)?.label || placeholder}
          </span>
        </span>
        {/* Chevron Icon */}
        <svg
          className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4 transform transition-transform duration-200"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          data-slot="icon"
          style={{ transform: (isOpen && !disabled) ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path
            fillRule="evenodd"
            d="M12 15.5a1 1 0 0 1-.707-.293l-5-5a1 1 0 1 1 1.414-1.414L12 13.086l4.293-4.293a1 1 0 0 1 1.414 1.414l-5 5A1 1 0 0 1 12 15.5Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown List */}
      {(isOpen && !disabled) && (
        <ul
          className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden sm:text-sm"
          role="listbox"
        >
          {options.map((option, index) => {
            const isSelected = multiple
              ? value.includes(option.value)
              : value === option.value;

            return (
              <li
                key={index}
                className="relative cursor-pointer py-2 pr-9 pl-3 select-none text-gray-900 hover:bg-purple-100 hover:text-purple-900"
                onClick={() => handleSelect(option.value)}
                role="option"
              >
                <span className="block truncate">{option.label}</span>
                {isSelected && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-green-500">
                    <svg
                      className="size-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Select;
