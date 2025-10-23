import React from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectTypeProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  colorMap?: Record<string, string>;
}

const defaultColors = [
  "bg-green-100 text-green-800",
  "bg-red-100 text-red-800",
  "bg-blue-100 text-blue-800",
  "bg-gray-100 text-gray-800",
  "bg-orange-100 text-orange-800",
  "bg-yellow-100 text-yellow-800",
  "bg-teal-100 text-teal-800",
  "bg-purple-100 text-purple-800",
];

const SelectType: React.FC<SelectTypeProps> = ({ value, options, onChange, colorMap }) => {
  const selectedIndex = options.findIndex((opt) => opt.value === value);

  const baseColor =
    colorMap?.[value] ||
    defaultColors[selectedIndex % defaultColors.length] ||
    "bg-gray-100 text-gray-800";


  return (
    <select
      className={`w-32 px-2 py-1 rounded text-sm font-medium border-0 cursor-pointer transition-colors duration-300 ${baseColor}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt, idx) => {
        const optColor =
          colorMap?.[opt.value] ||
          defaultColors[idx % defaultColors.length] ||
          "bg-gray-100 text-gray-800";
        return (
          <option
            key={opt.value}
            value={opt.value}
            className={`px-2 py-1 ${optColor}`}
          >
            {opt.label}
          </option>
        );
      })}
    </select>
  );
};

export default SelectType;
