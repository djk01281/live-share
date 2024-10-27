"use client";

import FileItem from "./FileItem";
import { FileInfo, RemoteClient } from "@/app/editor/types";

interface FileExplorerProps {
  files: FileInfo[];
  activeFileId: string | null;
  onFileSelect: (fileId: string) => void;
  remoteClients: Map<string, RemoteClient[]>;
}

export default function FileExplorer({
  files,
  activeFileId,
  onFileSelect,
  remoteClients,
}: FileExplorerProps) {
  return (
    <div className="w-64 rounded-lg bg-white border-[1px] border-black flex flex-col">
      <div className="p-4">
        <h2 className="text-sm font-bold text-gray-700">Files</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {files.map((file) => (
          <div key={file.id} className="px-2 py-0.5">
            <FileItem
              file={file}
              isActive={file.id === activeFileId}
              onSelect={() => onFileSelect(file.id)}
              remoteUsers={remoteClients.get(file.id) || []}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
