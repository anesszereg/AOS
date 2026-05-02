import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

export class WebSocketServer {
  private static instance: WebSocketServer;
  private io: SocketIOServer | null = null;
  private userSockets: Map<string, Set<string>> = new Map();

  private constructor() {}

  public static getInstance(): WebSocketServer {
    if (!WebSocketServer.instance) {
      WebSocketServer.instance = new WebSocketServer();
    }
    return WebSocketServer.instance;
  }

  public initialize(httpServer: HTTPServer): void {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.io.use(this.authenticateSocket.bind(this));

    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log('[WebSocket] Client connected:', socket.id);

      if (socket.userId) {
        this.registerUserSocket(socket.userId, socket.id);
      }

      socket.on('disconnect', () => {
        console.log('[WebSocket] Client disconnected:', socket.id);
        if (socket.userId) {
          this.unregisterUserSocket(socket.userId, socket.id);
        }
      });

      // Order tracking
      socket.on('track-order', (orderId: string) => {
        socket.join(`order:${orderId}`);
        console.log(`[WebSocket] User ${socket.userId} tracking order ${orderId}`);
      });

      // Driver location updates
      socket.on('driver-location', (data: { lat: number; lng: number }) => {
        if (socket.userRole === 'driver') {
          socket.broadcast.emit('driver-location-update', {
            driverId: socket.userId,
            location: data,
          });
        }
      });
    });

    console.log('[WebSocket] Server initialized');
  }

  private async authenticateSocket(
    socket: AuthenticatedSocket,
    next: (err?: Error) => void
  ): Promise<void> {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization;

      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;

      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  }

  private registerUserSocket(userId: string, socketId: string): void {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(socketId);
    console.log(`[WebSocket] Registered socket ${socketId} for user ${userId}`);
  }

  private unregisterUserSocket(userId: string, socketId: string): void {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.delete(socketId);
      if (sockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }
  }

  // Emit to specific user
  public emitToUser(userId: string, event: string, data: any): void {
    const sockets = this.userSockets.get(userId);
    if (sockets && this.io) {
      sockets.forEach((socketId) => {
        this.io!.to(socketId).emit(event, data);
      });
      console.log(`[WebSocket] Emitted ${event} to user ${userId}`);
    }
  }

  // Emit to order room
  public emitToOrder(orderId: string, event: string, data: any): void {
    if (this.io) {
      this.io.to(`order:${orderId}`).emit(event, data);
      console.log(`[WebSocket] Emitted ${event} to order ${orderId}`);
    }
  }

  // Broadcast to all
  public broadcast(event: string, data: any): void {
    if (this.io) {
      this.io.emit(event, data);
      console.log(`[WebSocket] Broadcasted ${event}`);
    }
  }

  public getIO(): SocketIOServer | null {
    return this.io;
  }
}

export const websocketServer = WebSocketServer.getInstance();
