"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import CodemirrorEditor from "../../CodemirrorEditor";

interface PortalEditorsProps {
  files: Array<{
    id: string;
    name: string;
    language: "javascript" | "typescript" | "python" | "html" | "css";
  }>;
  activeFileId: string | null;
  userInfo: {
    name: string;
    color: [string, string];
  };
}

export default function PortalEditors({
  files,
  activeFileId,
  userInfo,
}: PortalEditorsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div className="w-full h-full">
        {activeFileId && (
          <div
            id={`editor-${activeFileId}`}
            className="w-full h-full relative"
          />
        )}
      </div>

      {createPortal(
        <div
          id="editor-portals"
          style={{
            position: "fixed",
            left: "-9999px",
            visibility: "hidden",
          }}
        >
          {files.map(
            (file) =>
              file.id !== activeFileId && (
                <div key={file.id} id={`editor-${file.id}`}>
                  <CodemirrorEditor
                    roomName={`file-${file.id}`}
                    language={file.language}
                    userInfo={userInfo}
                    portalId={`editor-${file.id}`}
                  />
                </div>
              )
          )}
        </div>,
        document.body
      )}

      {activeFileId && (
        <CodemirrorEditor
          roomName={`file-${activeFileId}`}
          language={
            files.find((f) => f.id === activeFileId)?.language || "typescript"
          }
          userInfo={userInfo}
          portalId={`editor-${activeFileId}`}
        />
      )}
    </>
  );
}
