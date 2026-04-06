interface TimeColumnProps {
  HOURS: string[];
  slotHeight: number;
}

export function TimeColumn({ HOURS, slotHeight }: TimeColumnProps) {
  return (
    <div className="w-12 lg:w-16 flex-shrink-0 bg-white sticky left-0 z-30">
      <div className="h-14 border-b border-r border-gray-200 flex items-center justify-center text-xs lg:text-xxs text-gray-400 font-bold tracking-wider bg-white">
        TIME
      </div>
      {HOURS.map((hour) => (
        <div
          key={hour}
          className="border-b border-gray-100 border-r border-gray-200 flex items-start justify-center pt-2 text-xs lg:text-xxs text-cal-time font-bold bg-white"
          style={{ height: `${slotHeight}px` }}
        >
          {hour}
        </div>
      ))}
    </div>
  );
}