import { useEffect, useCallback } from "react";
import * as Y from "yjs";
import { yCollab } from "y-codemirror.next";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import YPartyKitProvider from "y-partykit/provider";
import { env } from "../../../env";
import type { UserInfo } from "../types";

const getLanguageExtension = (language: string) => {
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
};

export function useEditor(
  element: HTMLElement | undefined,
  roomName: string,
  userInfo: UserInfo,
  language: string
) {
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
        getLanguageExtension(language),
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
  }, [element, roomName, userInfo, language]);
}
