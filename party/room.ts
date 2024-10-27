import type * as Party from "partykit/server";

export default class CollaborativeEditor implements Party.Server {
  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection) {
    console.log("Connected:", conn.id);
  }

  onMessage(message: string, sender: Party.Connection) {
    this.room.broadcast(message);
  }
}
