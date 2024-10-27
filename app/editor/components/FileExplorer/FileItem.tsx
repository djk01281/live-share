"use client";

import { Code2Icon, FileIcon } from "lucide-react";
import { FileInfo, RemoteClient } from "@/app/editor/types";

interface FileItemProps {
  file: FileInfo;
  isActive: boolean;
  onSelect: () => void;
  remoteUsers: RemoteClient[];
}

export default function FileItem({
  file,
  isActive,
  onSelect,
  remoteUsers,
}: FileItemProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full rounded-md px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition-colors ${
        isActive ? "bg-[#e5f4ff]" : "text-gray-700"
      }`}
    >
      {file.language === "typescript" || file.language === "javascript" ? (
        <Code2Icon className="w-4 h-4 flex-shrink-0" />
      ) : (
        <FileIcon className="w-4 h-4 flex-shrink-0" />
      )}

      <span className="text-[13px] font-medium flex-1 text-left">
        {file.name}
      </span>

      {remoteUsers.length > 0 && (
        <div className="flex -space-x-2">
          {remoteUsers.map((user) => (
            <div
              key={user.clientId}
              className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs text-white"
              style={{
                backgroundImage: `linear-gradient(to bottom right, ${user.user.color[0]}, ${user.user.color[1]})`,
              }}
              title={user.user.name}
            >
              {user.user.name[0]}
            </div>
          ))}
        </div>
      )}
    </button>
  );
}
