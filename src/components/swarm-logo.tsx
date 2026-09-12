const NODES = [
  { x: 56, y: 40, s: 24, o: 1 },
  { x: 34, y: 54, s: 17, o: 0.88 },
  { x: 68, y: 16, s: 15, o: 0.82 },
  { x: 16, y: 36, s: 12, o: 0.68 },
  { x: 46, y: 74, s: 11, o: 0.6 },
  { x: 78, y: 54, s: 9, o: 0.5 },
  { x: 10, y: 60, s: 8, o: 0.4 },
  { x: 60, y: 4, s: 7, o: 0.32 },
];

export function SwarmLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {NODES.map((n) => (
        <rect key={`${n.x}-${n.y}`} x={n.x} y={n.y} width={n.s} height={n.s} opacity={n.o} />
      ))}
    </svg>
  );
}
