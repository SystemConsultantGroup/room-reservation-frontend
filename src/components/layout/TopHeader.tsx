interface TopHeaderProps {
  title: string;
}

export function TopHeader({ title }: TopHeaderProps) {
  return (
    <header className="hidden md:flex bg-white px-10 py-5 items-center justify-between border-b border-gray-200 shrink-0 z-10 w-full">
      <h1 className="font-extrabold text-black text-2xl tracking-tight">{title}</h1>
    </header>
  );
}
