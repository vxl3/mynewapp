"use client";

import { io, type Socket } from "socket.io-client";

/**
 * Client-side Socket.IO singleton (infrastructure only).
 * Connected lazily in Phase 2 when realtime features go live; the API is
 * already stable so UI components can depend on it without changes.
 */

let socket: Socket | null = null;

export function getSocket(): Socket | null {
  if (typeof window === "undefined") return null;
  if (socket) return socket;

  const url = process.env.NEXT_PUBLIC_SOCKET_URL ?? window.location.origin;
  socket = io(url, {
    autoConnect: false,
    withCredentials: true,
  });

  return socket;
}
