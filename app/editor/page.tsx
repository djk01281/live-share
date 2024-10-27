"use client";

import { useState } from "react";
import FileExplorer from "./components/FileExplorer/FileExplorer";
import PortalEditors from "./components/PortalEditors";
import { COLORS, INITIAL_FILES } from "./constants";
import type { FileInfo, UserInfo } from "./types";

export default function EditorPage() {
  const [activeFileId, setActiveFileId] = useState<string | null>(
    INITIAL_FILES[0].id
  );
  const [files] = useState<FileInfo[]>(INITIAL_FILES);
  const [userInfo] = useState<UserInfo>(() => ({
    name: `User ${Math.floor(Math.random() * 1000)}`,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));

  return (
    <div className="flex h-screen p-8 gap-4 bg-gray-50">
      <FileExplorer
        files={files}
        activeFileId={activeFileId}
        onFileSelect={setActiveFileId}
        remoteClients={new Map()}
      />

      <div className="flex-1 overflow-hidden ">
        <PortalEditors
          files={files}
          activeFileId={activeFileId}
          userInfo={userInfo}
        />
      </div>
    </div>
  );
}
