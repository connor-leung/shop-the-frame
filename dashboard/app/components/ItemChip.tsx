interface ItemChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function ItemChip({ label, active = false, onClick }: ItemChipProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all
        ${active
          ? 'bg-white text-black'
          : 'bg-[#272727] text-[#f1f1f1] hover:bg-[#3f3f3f]'
        }
      `}
    >
      {label}
    </button>
  );
}
