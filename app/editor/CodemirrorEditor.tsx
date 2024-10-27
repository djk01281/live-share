"use client";

import * as Y from "yjs";
import { yCollab } from "y-codemirror.next";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { useCallback, useEffect, useState, useRef } from "react";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import YPartyKitProvider from "y-partykit/provider";
import { env } from "../../env";
import { motion } from "framer-motion";
import styles from "./Cursor.module.css";
import { BasicCursor } from "./components/Cursor/BasicCursor";
import { NameCursor } from "./components/Cursor/NameCursor";

type AllProps = {
  variant?: "basic" | "name" | "avatar";
  x: number;
  y: number;
  color: [string, string];
};

type BasicCursorProps = AllProps & {
  variant?: "basic";
  name?: never;
  avatar?: never;
  size?: never;
};

type NameCursorProps = AllProps & {
  variant: "name";
  name: string;
  avatar?: never;
  size?: never;
};

type AvatarCursorProps = AllProps & {
  variant: "avatar";
  avatar: string;
  name?: never;
  size?: number;
};

type CursorProps = BasicCursorProps | NameCursorProps | AvatarCursorProps;

function Cursor({
  variant = "basic",
  x,
  y,
  color = ["", ""],
  name = "",
}: CursorProps) {
  return (
    <motion.div
      className={styles.cursor}
      initial={{ x, y }}
      animate={{ x, y }}
      transition={{
        type: "spring",
        bounce: 0.6,
        damping: 30,
        mass: 0.8,
        stiffness: 350,
        restSpeed: 0.01,
      }}
    >
      {variant === "basic" ? <BasicCursor color={color} /> : null}
      {variant === "name" ? <NameCursor color={color} name={name} /> : null}
    </motion.div>
  );
}

interface MousePointerState {
  user: {
    name: string;
    color: [string, string];
  };
  position: { x: number; y: number } | null;
}

interface RemoteClient {
  user: {
    name: string;
    color: [string, string];
  };
  position: { x: number; y: number } | null;
  clientId: number;
}

interface CodemirrorEditorProps {
  roomName: string;
  language: "javascript" | "typescript" | "python" | "html" | "css";
  userInfo: {
    name: string;
    color: [string, string];
  };
  portalId?: string;
}

export default function CodemirrorEditor({
  roomName,
  language,
  userInfo,
  portalId,
}: CodemirrorEditorProps) {
  const [element, setElement] = useState<HTMLElement>();
  const [remoteClients, setRemoteClients] = useState<RemoteClient[]>([]);
  const [mouseProvider, setMouseProvider] = useState<YPartyKitProvider | null>(
    null
  );
  const editorRef = useRef<HTMLDivElement>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    setElement(node);
  }, []);

  const getLanguageExtension = useCallback(() => {
    switch (language) {
      case "typescript":
      case "javascript":
        return javascript();
      case "python":
        return python();
      case "html":
        return html();
      case "css":
        return css();
      default:
        return javascript();
    }
  }, [language]);

  useEffect(() => {
    if (portalId && element) {
      const target = document.getElementById(portalId);
      if (target) {
        target.innerHTML = "";
        target.appendChild(element);
      }
    }

    return () => {
      if (portalId && element) {
        const target = document.getElementById(portalId);
        if (target && target.contains(element)) {
          target.removeChild(element);
        }
      }
    };
  }, [portalId, element]);

  useEffect(() => {
    if (!editorRef.current) return;

    const mouseDoc = new Y.Doc();
    const mouseAwarenessProvider = new YPartyKitProvider(
      env.NEXT_PUBLIC_PARTY_KIT_URL,
      `${roomName}-mouse`,
      mouseDoc
    );

    setMouseProvider(mouseAwarenessProvider);

    const mouseState: MousePointerState = {
      user: userInfo,
      position: null,
    };

    mouseAwarenessProvider.awareness.setLocalState(mouseState);

    const handleAwarenessUpdate = () => {
      const states = Array.from(
        mouseAwarenessProvider.awareness.getStates().entries()
      );
      const clients: RemoteClient[] = states
        .filter(
          ([clientId]) => clientId !== mouseAwarenessProvider.awareness.clientID
        )
        .map(([clientId, state]) => {
          const mouseState = state as MousePointerState;
          return {
            user: mouseState.user,
            position: mouseState.position,
            clientId,
          };
        });
      setRemoteClients(clients);
    };

    mouseAwarenessProvider.awareness.on("update", handleAwarenessUpdate);

    return () => {
      mouseAwarenessProvider.awareness.off("update", handleAwarenessUpdate);
      mouseAwarenessProvider.destroy();
      mouseDoc.destroy();
    };
  }, [roomName, userInfo]);

  useEffect(() => {
    if (!element) return;

    const yDoc = new Y.Doc();
    const provider = new YPartyKitProvider(
      env.NEXT_PUBLIC_PARTY_KIT_URL,
      `${roomName}-editor`,
      yDoc
    );

    const ytext = yDoc.getText("codemirror");
    const undoManager = new Y.UndoManager(ytext);

    provider.awareness.setLocalState({
      user: {
        name: userInfo.name,
        color: userInfo.color[0],
      },
    });

    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        basicSetup,
        getLanguageExtension(),
        EditorState.allowMultipleSelections.of(true),
        yCollab(ytext, provider.awareness, { undoManager }),
        EditorView.theme({
          "&": { height: "100%" },
          ".cm-content": { padding: "10px" },
          ".cm-line": { padding: "0 4px" },
          ".cm-ySelectionInfo": {
            position: "absolute",
            top: "-1.2em",
            left: "-1px",
            padding: "2px 6px",
            opacity: "1",
            color: "#fff",
            borderRadius: "4px",
            cursor: "default",
            fontFamily: "system-ui, sans-serif",
            fontSize: "12px",
            fontWeight: "500",
          },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: element,
    });

    return () => {
      view.destroy();
      provider.destroy();
      yDoc.destroy();
    };
  }, [element, roomName, userInfo, getLanguageExtension]);

  return (
    <div
      ref={editorRef}
      className="relative w-full h-full min-h-[300px] bg-white"
      onPointerMove={(e) => {
        e.stopPropagation();

        if (!mouseProvider || !portalId || !editorRef.current) {
          return;
        }

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
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        if (!mouseProvider) return;

        const currentState =
          mouseProvider.awareness.getLocalState() as MousePointerState;
        mouseProvider.awareness.setLocalState({
          ...currentState,
          position: null,
        });
      }}
    >
      <div
        ref={ref}
        className=" w-full h-full border-black border-[1px] rounded-lg"
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 50 }}
      >
        {remoteClients.map(({ clientId, user, position }) => {
          if (!position) {
            return null;
          }

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
    </div>
  );
}
