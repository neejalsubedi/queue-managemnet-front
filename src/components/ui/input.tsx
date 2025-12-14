import React, { forwardRef, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { cn } from "../../lib/utils";

type OptionType = {
  label: string;
  value: string | number;
};

type InputProps = {
  label?: string;
  name: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "datetime-local"
    | "time"
    | "url"
    | "tel"
    | "search"
    | "color"
    | "month"
    | "week"
    | "file"
    | "checkbox"
    | "radio"
    | "select"; // ✅ Added support for dropdown
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  min?: number | string;
  max?: number | string;
  step?: number;
  minLength?: number;
  maxLength?: number;
  options?: OptionType[];
  value?: any; // ✅ Fix: allows RHF “unknown” type
  onChange?: (...event: any[]) => void;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement>,
  "type" | "value" | "onChange"
>;

const Input = forwardRef<HTMLInputElement | HTMLSelectElement, InputProps>(
  (
    {
      label,
      name,
      type = "text",
      placeholder = "",
      error,
      required = false,
      disabled = false,
      className = "",
      labelClassName = "block mb-1 font-medium text-sm",
      min,
      max,
      step,
      minLength,
      maxLength,
      options = [],
      value,
      onChange,
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="mb-4 relative">
        {label && (
          <label htmlFor={name} className={labelClassName}>
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        {required && !label && (
          <span className="absolute -top-6 right-0 text-red-500 text-md">
            *
          </span>
        )}

        <div className="relative">
          {type === "select" ? (
            <select
              id={name}
              name={name}
              ref={ref as React.Ref<HTMLSelectElement>}
              disabled={disabled}
              value={value}
              onChange={onChange}
              aria-invalid={!!error}
              className={cn(
                "border-input flex h-9 md:h-11 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                "bg-white ",
                error ? "border-red-500" : "border-gray-300",
                className
              )}
              {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
            >
              <option value="" className={cn(className)}>
                Select an option
              </option>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <>
              <input
                id={name}
                name={name}
                ref={ref as React.Ref<HTMLInputElement>}
                type={inputType}
                placeholder={placeholder}
                disabled={disabled}
                min={min}
                max={max}
                step={step}
                minLength={minLength}
                maxLength={maxLength}
                value={value}
                onChange={onChange}
                aria-invalid={!!error}
                className={cn(
                  "file:text-foreground selection:bg-primary selection:text-primary-foreground border-input flex h-9 md:h-11 w-full min-w-0 rounded-md border px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                  "bg-white placeholder-[#ACA9A9]",
                  error ? "border-red-500" : "border-gray-300",
                  isPassword ? "pr-10" : "",
                  className
                )}
                {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
              />

              {isPassword && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              )}
            </>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
