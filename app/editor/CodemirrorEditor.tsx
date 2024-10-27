"use client";

import { useCallback, useRef, useState } from "react";
import { useMouseAwareness, useEditor, usePortal } from "./hooks";
import { Cursor } from "./components/Cursor";
import { MouseHandler } from "./components/MouseHandler";
import type { EditorProps } from "./types";

export default function CodemirrorEditor({
  roomName,
  language,
  userInfo,
  portalId,
}: EditorProps) {
  const [element, setElement] = useState<HTMLElement>();
  const editorRef = useRef<HTMLDivElement>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    setElement(node);
  }, []);

  const { remoteClients, mouseProvider } = useMouseAwareness(
    roomName,
    userInfo,
    editorRef
  );
  useEditor(element, roomName, userInfo, language);
  usePortal(element, portalId);

  return (
    <MouseHandler
      mouseProvider={mouseProvider}
      portalId={portalId}
      editorRef={editorRef}
    >
      <div
        ref={ref}
        className="w-full h-full border-black border-[1px] rounded-lg"
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 50 }}
      >
        {remoteClients.map(({ clientId, user, position }) => {
          if (!position) return null;

          return (
            <Cursor
              key={clientId}
              variant="name"
              color={user.color}
              name={user.name}
              x={position.x}
              y={position.y}
            />
          );
        })}
      </div>
    </MouseHandler>
  );
}
