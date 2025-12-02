import { useState, useCallback } from 'react';
import { UserSetup } from '@/components/chat/UserSetup';
import { ChatRoom } from '@/components/chat/ChatRoom';
import { ContactList, Contact } from '@/components/chat/ContactList';
import { useWebSocket } from '@/hooks/useWebSocket';
import logo from '@/assets/logo.png';

// Mock contacts for demo
const mockContacts: Contact[] = [
  { id: '1', name: 'Lucian Obrien', lastMessage: 'You: The waves c...', lastMessageTime: 'a few seconds', isOnline: true },
  { id: '2', name: 'Deja Brady', lastMessage: 'You: The scent of bloo...', lastMessageTime: 'an hour', isOnline: true },
  { id: '3', name: 'Harrison Stein', lastMessage: 'Sent a photo', lastMessageTime: '2 hours', isOnline: false },
  { id: '4', name: 'Reece Chung', lastMessage: 'She gazed up at the...', lastMessageTime: '5 minutes', isOnline: false, unreadCount: 1 },
  { id: '5', name: 'Lainey Davidson', lastMessage: 'Hey there!', lastMessageTime: 'a few seconds', isOnline: false },
];

const Index = () => {
  const [hasJoined, setHasJoined] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  const {
    isConnected,
    messages,
    participants,
    typingUsers,
    sendMessage,
    sendTyping,
    currentUser,
    connect,
  } = useWebSocket();

  const handleJoin = useCallback((name: string) => {
    connect(name);
    setHasJoined(true);
  }, [connect]);

  if (!hasJoined || !currentUser) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <img src={logo} alt="Beerpass" className="w-32 h-32 mb-8 object-contain" />
        <UserSetup onJoin={handleJoin} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <ContactList
        contacts={mockContacts}
        selectedContactId={selectedContact?.id}
        onSelectContact={setSelectedContact}
        currentUser={currentUser}
      />
      <ChatRoom
        currentUser={currentUser}
        participants={participants}
        messages={messages}
        typingUsers={typingUsers}
        isConnected={isConnected}
        onSendMessage={sendMessage}
        onTyping={sendTyping}
        selectedContact={selectedContact}
      />
    </div>
  );
};

export default Index;
