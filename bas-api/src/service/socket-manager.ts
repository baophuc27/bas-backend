import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

interface EnhancedSocket extends Socket {
  isPaused?: boolean;
}

export class SocketManager {
  private sockets: Map<string, Set<EnhancedSocket>>;
  
  constructor() {
    this.sockets = new Map();
  }

  addSocket(room: string, socket: EnhancedSocket) {
    if (!this.sockets.has(room)) {
      this.sockets.set(room, new Set());
    }
    socket.isPaused = false;
    this.sockets.get(room)?.add(socket);
  }

  removeSocket(room: string, socket: EnhancedSocket) {
    this.sockets.get(room)?.delete(socket);
    if (this.sockets.get(room)?.size === 0) {
      this.sockets.delete(room);
    }
  }

  pauseSocket(room: string, socket: EnhancedSocket) {
    socket.isPaused = true;
  }

  resumeSocket(room: string, socket: EnhancedSocket) {
    socket.isPaused = false;
  }

  getActiveClients(room: string): EnhancedSocket[] {
    return Array.from(this.sockets.get(room) || []).filter(socket => !socket.isPaused);
  }

  sendToActiveClients(room: string, event: string, data: any) {
    const clients = this.getActiveClients(room);
    console.log(`[sendToActiveClients] room: ${room}, total active sockets: ${clients.length}`);
    clients.forEach(socket => {
      socket.emit(event, data);
    });
  }

  getRooms(): string[] {
    return Array.from(this.sockets.keys());
  }
}
