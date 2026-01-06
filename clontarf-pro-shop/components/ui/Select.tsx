// components/ui/Select.tsx
import * as React from "react";

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
};

export default function Select({
  value,
  onChange,
  options,
  placeholder,
  className = "",
}: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-48 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900
        focus:outline-none focus:ring-2 focus:ring-[#1a4d2e]/30
        ${className}`}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}

      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
