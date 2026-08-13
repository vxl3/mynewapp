/**
 * Socket.IO — realtime infrastructure (Phase 1: prepared, not yet mounted).
 *
 * احجزلي will use websockets for live booking updates, messaging and
 * notifications. This module exposes a fully-typed socket server factory
 * that a custom Node.js server (Phase 2) mounts alongside Next.js.
 *
 * Run standalone for development:
 *   npm run socket
 */
import { createServer } from "node:http";
import { Server as SocketServer } from "socket.io";

export interface ServerToClientEvents {
  "notification:new": (payload: { id: string; title: string; body?: string }) => void;
  "booking:updated": (payload: { reference: string; status: string }) => void;
  "message:new": (payload: { conversationId: string; body: string }) => void;
}

export interface ClientToServerEvents {
  "room:join": (room: string) => void;
  "room:leave": (room: string) => void;
}

export function createSocketServer(port = Number(process.env.SOCKET_PORT ?? 4000)) {
  const httpServer = createServer();
  const io = new SocketServer<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: { origin: process.env.NEXT_PUBLIC_APP_URL ?? "*" },
  });

  io.on("connection", (socket) => {
    socket.on("room:join", (room) => {
      void socket.join(room);
    });

    socket.on("room:leave", (room) => {
      void socket.leave(room);
    });

    socket.on("disconnect", () => {
      // Phase 2: presence tracking per business/employee channel.
    });
  });

  httpServer.listen(port, () => {
    console.log(`[socket] realtime server listening on :${port}`);
  });

  return io;
}

// Allow running this file directly for infrastructure smoke-testing.
if (import.meta.url === `file://${process.argv[1]}`) {
  createSocketServer();
}
