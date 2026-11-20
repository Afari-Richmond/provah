const colors = [
  "#6c4ce0",
  "#ff7a30",
  "#161221",
  "#9b80ec",
  "#ffb380",
];

export function TopDecor() {
  return (
    <div className="flex h-[7px] w-full">
      {colors.map((c, i) => (
        <span key={i} className="h-full flex-1" style={{ backgroundColor: c }} />
      ))}
    </div>
  );
}
