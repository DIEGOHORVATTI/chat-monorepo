import { useState, useRef, useEffect } from 'react';
import { Smile, Paperclip, Globe } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onTyping: (isTyping: boolean) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, onTyping, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    onTyping(true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 1000);
  };

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      onTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="px-6 py-4 border-t border-border bg-card/30">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        >
          <Smile className="w-5 h-5" />
        </button>
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            disabled={disabled}
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none py-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </button>
          <button
            type="button"
            className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <Globe className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
