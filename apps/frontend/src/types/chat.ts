export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface User {
  id: string;
  name: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface ChatRoom {
  id: string;
  participants: User[];
  messages: Message[];
  createdAt: Date;
}

export type WebSocketMessage = 
  | { type: 'message'; payload: Message }
  | { type: 'typing'; payload: { userId: string; isTyping: boolean } }
  | { type: 'user_joined'; payload: User }
  | { type: 'user_left'; payload: { userId: string } }
  | { type: 'history'; payload: Message[] };
