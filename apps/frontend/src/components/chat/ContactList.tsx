import { User } from '@/types/chat';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export interface Contact {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
  isOnline: boolean;
  unreadCount?: number;
  avatar?: string;
}

interface ContactListProps {
  contacts: Contact[];
  selectedContactId?: string;
  onSelectContact: (contact: Contact) => void;
  currentUser: User | null;
}

export function ContactList({ contacts, selectedContactId, onSelectContact, currentUser }: ContactListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 h-full bg-chat-sidebar border-r border-border flex flex-col">
      {/* Header with user avatar */}
      <div className="p-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-primary/30">
              <AvatarFallback className="bg-secondary text-foreground font-semibold">
                {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-chat-sidebar bg-online pulse-online" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-none text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Contacts list */}
      <div className="flex-1 overflow-y-auto chat-scrollbar">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => onSelectContact(contact)}
            className={cn(
              "flex items-center gap-3 p-3 cursor-pointer contact-hover",
              selectedContactId === contact.id && "bg-secondary"
            )}
          >
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-muted text-foreground font-medium">
                  {contact.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {contact.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-chat-sidebar bg-online" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground truncate">{contact.name}</h3>
                {contact.lastMessageTime && (
                  <span className="text-xs text-muted-foreground">{contact.lastMessageTime}</span>
                )}
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <p className="text-sm text-muted-foreground truncate">
                  {contact.lastMessage || 'No messages yet'}
                </p>
                {contact.unreadCount && contact.unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                    {contact.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
