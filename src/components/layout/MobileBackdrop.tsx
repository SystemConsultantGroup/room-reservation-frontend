interface MobileBackdropProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileBackdrop({ isOpen, onClose }: MobileBackdropProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 z-40 md:hidden cursor-pointer backdrop-blur-sm"
      aria-label="메뉴 닫기"
    />
  );
}
