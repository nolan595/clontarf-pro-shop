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
  widthClassName?: string; // optional convenience
};

export default function Select({
  value,
  onChange,
  options,
  placeholder,
  className = "",
  widthClassName = "w-48",
}: SelectProps) {
  return (
    <div className={`relative ${widthClassName} ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full appearance-none rounded-xl px-4 py-2 text-sm
          border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)]
          outline-none transition
          focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent-green)_35%,transparent)]
        "
      >
        {placeholder && (
          <option value="" disabled className="bg-[var(--background)]">
            {placeholder}
          </option>
        )}

        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[var(--background)]">
            {opt.label}
          </option>
        ))}
      </select>

      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
        ▾
      </span>
    </div>
  );
}
