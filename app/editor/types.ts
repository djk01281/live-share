export interface UserInfo {
  name: string;
  color: [string, string];
}

export interface CursorBaseProps {
  variant?: "basic" | "name" | "avatar";
  x: number;
  y: number;
  color: [string, string];
}

export interface BasicCursorProps extends CursorBaseProps {
  variant?: "basic";
  name?: never;
  avatar?: never;
  size?: never;
}

export interface NameCursorProps extends CursorBaseProps {
  variant: "name";
  name: string;
  avatar?: never;
  size?: never;
}

export interface AvatarCursorProps extends CursorBaseProps {
  variant: "avatar";
  avatar: string;
  name?: never;
  size?: number;
}

export type CursorProps =
  | BasicCursorProps
  | NameCursorProps
  | AvatarCursorProps;

export interface EditorProps {
  roomName: string;
  language: "javascript" | "typescript" | "python" | "html" | "css";
  userInfo: UserInfo;
  portalId?: string;
}

export interface MousePointerState {
  user: UserInfo;
  position: { x: number; y: number } | null;
}

export interface RemoteClient {
  user: UserInfo;
  position: { x: number; y: number } | null;
  clientId: number;
}

export interface FileInfo {
  id: string;
  name: string;
  language: "javascript" | "typescript" | "python" | "html" | "css";
}
