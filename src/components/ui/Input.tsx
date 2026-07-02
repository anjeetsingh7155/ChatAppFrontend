import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  helperText?: string;
  helperIcon?: React.ComponentType<{ className?: string }>;
  error?: string;
}

export default function Input({
  label,
  icon: Icon,
  type = "text",
  helperText,
  helperIcon: HelperIcon,
  error,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";
  const inputType = isPasswordType ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      <label className="text-xs font-medium text-slate-400">
        {label}
      </label>
      
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-500 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        
        <input
          {...props}
          type={inputType}
          className={`w-full bg-[#12131a]/40 border rounded-xl text-slate-200 text-sm outline-none transition-all placeholder:text-slate-700
            ${Icon ? "pl-10" : "px-4"}
            ${isPasswordType ? "pr-10" : "pr-4"}
            py-3
            ${error ? "border-rose-500/50 focus:border-rose-500" : "border-[#1c1d27] bg-[#0b0c11] focus:border-[#5f69f8]/40"}
          `}
        />

        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-slate-500 hover:text-slate-300 focus:outline-none transition-all cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {helperText && !error && (
        <div className="flex items-center gap-1.5 text-[10px] text-[#4ade80] font-medium px-1">
          {HelperIcon && <HelperIcon className="w-3.5 h-3.5 text-[#4ade80]" />}
          <span>{helperText}</span>
        </div>
      )}

      {error && (
        <span className="text-[10px] text-rose-500 font-medium px-1">
          {error}
        </span>
      )}
    </div>
  );
}
