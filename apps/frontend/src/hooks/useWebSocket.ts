import { useState, useEffect, useRef, useCallback } from 'react';
import { Message, User, WebSocketMessage } from '@/types/chat';

const WS_URL = 'wss://aodlnwdmfcpqcxlvvbuu.supabase.co/functions/v1/chat-websocket';

interface UseWebSocketReturn {
  isConnected: boolean;
  messages: Message[];
  participants: User[];
  typingUsers: Map<string, string>;
  sendMessage: (content: string) => void;
  sendTyping: (isTyping: boolean) => void;
  currentUser: User | null;
  connect: (userName: string) => void;
  disconnect: () => void;
}

export function useWebSocket(): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<User[]>([]);
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback((userName: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const userId = crypto.randomUUID();
    const user: User = {
      id: userId,
      name: userName,
      isOnline: true,
    };
    
    setCurrentUser(user);

    const ws = new WebSocket(`${WS_URL}?userId=${userId}&userName=${encodeURIComponent(userName)}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        
        switch (data.type) {
          case 'message':
            setMessages((prev) => [...prev, data.payload]);
            break;
            
          case 'typing':
            setTypingUsers((prev) => {
              const newMap = new Map(prev);
              if (data.payload.isTyping) {
                const participant = participants.find(p => p.id === data.payload.userId);
                if (participant) {
                  newMap.set(data.payload.userId, participant.name);
                }
              } else {
                newMap.delete(data.payload.userId);
              }
              return newMap;
            });
            break;
            
          case 'user_joined':
            setParticipants((prev) => {
              if (prev.find(p => p.id === data.payload.id)) {
                return prev.map(p => p.id === data.payload.id ? { ...p, isOnline: true } : p);
              }
              return [...prev, data.payload];
            });
            break;
            
          case 'user_left':
            setParticipants((prev) =>
              prev.map(p => p.id === data.payload.userId ? { ...p, isOnline: false } : p)
            );
            setTypingUsers((prev) => {
              const newMap = new Map(prev);
              newMap.delete(data.payload.userId);
              return newMap;
            });
            break;
            
          case 'history':
            setMessages(data.payload);
            break;
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      
      // Attempt to reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        if (currentUser) {
          connect(currentUser.name);
        }
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, [participants, currentUser]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsConnected(false);
    setCurrentUser(null);
  }, []);

  const sendMessage = useCallback((content: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || !currentUser) {
      return;
    }

    const message: Message = {
      id: crypto.randomUUID(),
      content,
      senderId: currentUser.id,
      senderName: currentUser.name,
      timestamp: new Date(),
      status: 'sending',
    };

    wsRef.current.send(JSON.stringify({
      type: 'message',
      payload: message,
    }));

    // Optimistic update
    setMessages((prev) => [...prev, message]);
  }, [currentUser]);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || !currentUser) {
      return;
    }

    wsRef.current.send(JSON.stringify({
      type: 'typing',
      payload: { userId: currentUser.id, isTyping },
    }));
  }, [currentUser]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    messages,
    participants,
    typingUsers,
    sendMessage,
    sendTyping,
    currentUser,
    connect,
    disconnect,
  };
}
