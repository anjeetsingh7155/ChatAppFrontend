import React from "react";

interface FeatureItemProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export default function FeatureItem({ icon: Icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex items-center gap-4 text-left">
      <div className="w-11 h-11 rounded-xl bg-[#1f2833]/15 border border-slate-900/60 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-purple-400" />
      </div>
      <div>
        <h4 className="text-xs font-bold text-slate-200">{title}</h4>
        <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">{description}</p>
      </div>
    </div>
  );
}
