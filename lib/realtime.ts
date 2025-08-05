import { io, Socket } from 'socket.io-client';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  color: string;
}

export interface Cursor {
  userId: string;
  x: number;
  y: number;
  timestamp: number;
}

export interface LiveEdit {
  cardId: string;
  userId: string;
  field: 'title' | 'description';
  content: string;
  timestamp: number;
}

export interface BoardActivity {
  type: 'card_moved' | 'card_created' | 'card_updated' | 'list_created' | 'user_joined' | 'user_left';
  userId: string;
  data: any;
  timestamp: number;
}

class RealtimeService {
  private socket: Socket | null = null;
  private boardId: string | null = null;
  private currentUser: User | null = null;
  private onlineUsers: Map<string, User> = new Map();
  private cursors: Map<string, Cursor> = new Map();
  
  // Event listeners
  private listeners: {
    onUserJoined?: (user: User) => void;
    onUserLeft?: (userId: string) => void;
    onCursorMove?: (cursor: Cursor) => void;
    onLiveEdit?: (edit: LiveEdit) => void;
    onBoardActivity?: (activity: BoardActivity) => void;
    onConnectionChange?: (connected: boolean) => void;
  } = {};

  connect(boardId: string, user: User) {
    if (this.socket?.connected && this.boardId === boardId) {
      return;
    }

    this.boardId = boardId;
    this.currentUser = user;

    // In a real app, this would connect to your WebSocket server
    // For demo purposes, we'll simulate real-time events
    this.simulateRealTimeEvents();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.boardId = null;
    this.currentUser = null;
    this.onlineUsers.clear();
    this.cursors.clear();
  }

  // Simulate real-time events for demo
  private simulateRealTimeEvents() {
    // Simulate users joining
    setTimeout(() => {
      const mockUsers = [
        { id: 'user1', name: 'Alice Johnson', color: '#3B82F6' },
        { id: 'user2', name: 'Bob Smith', color: '#10B981' },
        { id: 'user3', name: 'Carol Brown', color: '#F59E0B' }
      ];

      mockUsers.forEach((user, index) => {
        setTimeout(() => {
          this.onlineUsers.set(user.id, user);
          this.listeners.onUserJoined?.(user);
          
          // Simulate cursor movements
          this.simulateCursorMovements(user.id);
        }, index * 1000);
      });
    }, 2000);

    // Simulate board activities
    setTimeout(() => {
      const activities: BoardActivity[] = [
        {
          type: 'card_created',
          userId: 'user1',
          data: { cardTitle: 'Review API documentation', listId: 'list1' },
          timestamp: Date.now()
        },
        {
          type: 'card_moved',
          userId: 'user2',
          data: { cardId: 'card1', fromList: 'To Do', toList: 'In Progress' },
          timestamp: Date.now() + 5000
        }
      ];

      activities.forEach((activity, index) => {
        setTimeout(() => {
          this.listeners.onBoardActivity?.(activity);
        }, index * 3000);
      });
    }, 3000);
  }

  private simulateCursorMovements(userId: string) {
    const moveCursor = () => {
      if (!this.onlineUsers.has(userId)) return;

      const cursor: Cursor = {
        userId,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        timestamp: Date.now()
      };

      this.cursors.set(userId, cursor);
      this.listeners.onCursorMove?.(cursor);

      // Continue moving cursor
      setTimeout(moveCursor, 2000 + Math.random() * 3000);
    };

    moveCursor();
  }

  // Public methods for real-time features
  broadcastCursorMove(x: number, y: number) {
    if (!this.currentUser || !this.boardId) return;

    const cursor: Cursor = {
      userId: this.currentUser.id,
      x,
      y,
      timestamp: Date.now()
    };

    // In real app, emit to socket
    // this.socket?.emit('cursor_move', { boardId: this.boardId, cursor });
  }

  broadcastLiveEdit(cardId: string, field: 'title' | 'description', content: string) {
    if (!this.currentUser || !this.boardId) return;

    const edit: LiveEdit = {
      cardId,
      userId: this.currentUser.id,
      field,
      content,
      timestamp: Date.now()
    };

    // In real app, emit to socket
    // this.socket?.emit('live_edit', { boardId: this.boardId, edit });
    
    // Simulate receiving the edit
    setTimeout(() => {
      this.listeners.onLiveEdit?.(edit);
    }, 100);
  }

  broadcastActivity(activity: Omit<BoardActivity, 'userId' | 'timestamp'>) {
    if (!this.currentUser || !this.boardId) return;

    const fullActivity: BoardActivity = {
      ...activity,
      userId: this.currentUser.id,
      timestamp: Date.now()
    };

    // In real app, emit to socket
    // this.socket?.emit('board_activity', { boardId: this.boardId, activity: fullActivity });
  }

  // Event listener setters
  onUserJoined(callback: (user: User) => void) {
    this.listeners.onUserJoined = callback;
  }

  onUserLeft(callback: (userId: string) => void) {
    this.listeners.onUserLeft = callback;
  }

  onCursorMove(callback: (cursor: Cursor) => void) {
    this.listeners.onCursorMove = callback;
  }

  onLiveEdit(callback: (edit: LiveEdit) => void) {
    this.listeners.onLiveEdit = callback;
  }

  onBoardActivity(callback: (activity: BoardActivity) => void) {
    this.listeners.onBoardActivity = callback;
  }

  onConnectionChange(callback: (connected: boolean) => void) {
    this.listeners.onConnectionChange = callback;
  }

  // Getters
  getOnlineUsers(): User[] {
    return Array.from(this.onlineUsers.values());
  }

  getCursors(): Cursor[] {
    return Array.from(this.cursors.values());
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const realtimeService = new RealtimeService();