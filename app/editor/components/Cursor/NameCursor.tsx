import type { NameCursorProps } from "@/app/editor/types";

export function NameCursor({
  color,
  name,
}: Pick<NameCursorProps, "color" | "name">) {
  return (
    <div style={{ position: "relative" }}>
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <path
          d="M19.294 12.063a1 1 0 0 0 .072-1.887l-13-5.107a1 1 0 0 0-1.297 1.297l5.107 13a1 1 0 0 0 1.887-.072l1.701-5.53z"
          fill={color[0]}
        ></path>
      </svg>

      <div
        style={{
          position: "absolute",
          top: "1.5rem",
          left: "1.5rem",
          padding: "0.25rem 0.5rem ",
          fontSize: "14px",
          lineHeight: "1.25rem",
          fontWeight: 600,
          whiteSpace: "nowrap",
          borderRadius: "0.4rem",
          backgroundColor: `${color[0]}`,
          color: "#fff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          minWidth: "max-content",
          zIndex: 50,
        }}
      >
        {name}
      </div>
    </div>
  );
}
