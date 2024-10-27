import { useState, useEffect } from "react";
import * as Y from "yjs";
import YPartyKitProvider from "y-partykit/provider";
import { env } from "../../../env";
import type { UserInfo, MousePointerState, RemoteClient } from "../types";

export function useMouseAwareness(
  roomName: string,
  userInfo: UserInfo,
  editorRef: React.RefObject<HTMLDivElement>
) {
  const [remoteClients, setRemoteClients] = useState<RemoteClient[]>([]);
  const [mouseProvider, setMouseProvider] = useState<YPartyKitProvider | null>(
    null
  );

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

  return { remoteClients, mouseProvider };
}
