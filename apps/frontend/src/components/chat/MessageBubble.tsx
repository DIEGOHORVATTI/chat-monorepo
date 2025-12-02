import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const statusIcon = () => {
    switch (message.status) {
      case 'sending':
        return <Check className="w-3 h-3 opacity-50" />;
      case 'sent':
        return <Check className="w-3 h-3" />;
      case 'delivered':
      case 'read':
        return <CheckCheck className={cn("w-3 h-3", message.status === 'read' && "text-primary")} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex message-enter",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[70%] px-4 py-2.5 rounded-2xl shadow-message",
          isOwn
            ? "bg-chat-bubble-sent text-chat-bubble-sent-foreground rounded-br-md"
            : "bg-chat-bubble-received text-chat-bubble-received-foreground rounded-bl-md"
        )}
      >
        {!isOwn && (
          <p className="text-xs font-medium text-primary mb-1">
            {message.senderName}
          </p>
        )}
        <p className="text-sm leading-relaxed break-words">{message.content}</p>
        <div className={cn(
          "flex items-center gap-1 mt-1",
          isOwn ? "justify-end" : "justify-start"
        )}>
          <span className="text-[10px] opacity-60">
            {format(new Date(message.timestamp), 'HH:mm')}
          </span>
          {isOwn && statusIcon()}
        </div>
      </div>
    </div>
  );
}
