export default function ProgressBar({ progress }: { progress: number | null }) {
  return (
    <div>
      <div
        style={{
          width: `${progress}%`,
          background: "var(--foreground)",
          height: "1.5px",
          transition: "width 0.3s ease-in-out",
          borderRadius: "2rem",
        }}
      />
    </div>
  );
}

