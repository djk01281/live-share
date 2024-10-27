import type { BasicCursorProps } from "@/app/editor/types";

export function BasicCursor({ color }: Pick<BasicCursorProps, "color">) {
  return (
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
      <path
        d="M19.294 12.063a1 1 0 0 0 .072-1.887l-13-5.107a1 1 0 0 0-1.297 1.297l5.107 13a1 1 0 0 0 1.887-.072l1.701-5.53z"
        fill={color[0]}
      ></path>
    </svg>
  );
}
