import { useMemo } from 'react';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { EmptyState } from './EmptyState';
import { useWebSocket } from '@/hooks/useWebSocket';
import { User } from '@/types/chat';
import { Contact } from './ContactList';

interface ChatRoomProps {
  currentUser: User;
  participants: User[];
  messages: ReturnType<typeof useWebSocket>['messages'];
  typingUsers: Map<string, string>;
  isConnected: boolean;
  onSendMessage: (content: string) => void;
  onTyping: (isTyping: boolean) => void;
  selectedContact: Contact | null;
}

export function ChatRoom({
  currentUser,
  participants,
  messages,
  typingUsers,
  isConnected,
  onSendMessage,
  onTyping,
  selectedContact,
}: ChatRoomProps) {
  const otherParticipant = useMemo(() => 
    selectedContact ? { id: selectedContact.id, name: selectedContact.name, isOnline: selectedContact.isOnline } : null,
    [selectedContact]
  );

  const typingUserName = useMemo(() => {
    for (const [userId, name] of typingUsers) {
      if (userId !== currentUser.id) {
        return name;
      }
    }
    return null;
  }, [typingUsers, currentUser.id]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col flex-1 h-screen bg-background">
      <ChatHeader 
        participant={otherParticipant} 
        isConnected={isConnected} 
      />
      
      {hasMessages ? (
        <MessageList
          messages={messages}
          currentUserId={currentUser.id}
          typingUser={typingUserName}
        />
      ) : (
        <EmptyState />
      )}
      
      <ChatInput
        onSendMessage={onSendMessage}
        onTyping={onTyping}
        disabled={!isConnected}
      />
    </div>
  );
}
