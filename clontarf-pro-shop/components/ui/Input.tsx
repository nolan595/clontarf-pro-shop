import * as React from "react";
import clsx from "clsx";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={clsx(
        "w-full border border-gray-200 bg-white px-4 py-3 text-base text-[#2d2d2d]",
        "rounded-xl outline-none transition focus:ring-2 focus:ring-[#c9a962]/40",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}
