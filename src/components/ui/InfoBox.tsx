import { Info, LucideIcon } from 'lucide-react';

interface InfoBoxProps {
  items: string[];
  icon?: LucideIcon;
  className?: string;
}

export function InfoBox({ items, icon: Icon = Info, className = '' }: InfoBoxProps) {
  return (
    <div className={`w-full p-6 text-xs text-gray-400 leading-relaxed font-medium bg-white/50 rounded-xl border border-dashed border-ui-border ${className}`}>
      {items.map((item, index) => (
        <div
          key={index}
          className={`flex items-start gap-2 text-gray-400 ${index !== items.length - 1 ? 'mb-2' : ''}`}
        >
          <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <p>{item}</p>
        </div>
      ))}
    </div>
  );
}
