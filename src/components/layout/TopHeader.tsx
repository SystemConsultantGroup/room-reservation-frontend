interface TopHeaderProps {
  title: string;
  rightElement?: React.ReactNode;
}

export function TopHeader({ title, rightElement }: TopHeaderProps) {
  return (
    <header className="hidden md:flex bg-white px-10 h-[73px] items-center justify-between border-b border-gray-200 shrink-0 z-10 w-full">
      <h1 className="font-extrabold text-black text-2xl tracking-tight">{title}</h1>
      {rightElement && <div className="flex items-center">{rightElement}</div>}
    </header>
  );
}
