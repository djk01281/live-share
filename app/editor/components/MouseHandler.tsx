// components/MouseHandler.tsx
import { useCallback } from "react";
import type YPartyKitProvider from "y-partykit/provider";
import type { MousePointerState } from "../types";

interface MouseHandlerProps {
  mouseProvider: YPartyKitProvider | null;
  portalId: string | undefined;
  editorRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}

export function MouseHandler({
  mouseProvider,
  portalId,
  editorRef,
  children,
}: MouseHandlerProps) {
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      if (!mouseProvider || !portalId || !editorRef.current) return;

      const x = e.pageX;
      const y = e.pageY;
      const rect = editorRef.current.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      const position = {
        x: x - (rect.left + scrollX),
        y: y - (rect.top + scrollY),
      };

      const currentState =
        mouseProvider.awareness.getLocalState() as MousePointerState;
      mouseProvider.awareness.setLocalState({
        ...currentState,
        position,
      });
    },
    [mouseProvider, portalId, editorRef]
  );

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      if (!mouseProvider) return;

      const currentState =
        mouseProvider.awareness.getLocalState() as MousePointerState;
      mouseProvider.awareness.setLocalState({
        ...currentState,
        position: null,
      });
    },
    [mouseProvider]
  );

  return (
    <div
      ref={editorRef}
      className="relative w-full h-full min-h-[300px] bg-white"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </div>
  );
}
