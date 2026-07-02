import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
  loading?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export default function Button({
  children,
  variant = "primary",
  loading,
  icon: Icon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle =
    "w-full py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg";

  const variants = {
    primary:
      "bg-gradient-to-r from-[#805af5] to-[#4f56f1] hover:from-[#7048eb] hover:to-[#3e45e0] text-white shadow-lg shadow-purple-950/15 hover:shadow-purple-500/10 disabled:opacity-50 disabled:cursor-not-allowed border-0",
    outline:
      "border border-slate-800 bg-[#12131a]/20 hover:bg-[#1f2833]/10 text-slate-300 hover:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
