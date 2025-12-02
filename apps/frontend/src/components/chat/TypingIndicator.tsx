interface TypingIndicatorProps {
  userName: string;
}

export function TypingIndicator({ userName }: TypingIndicatorProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="bg-chat-bubble-received rounded-2xl rounded-bl-md px-4 py-3 shadow-message">
        <div className="flex items-center gap-2">
          <div className="typing-indicator flex gap-1">
            <span className="w-2 h-2 bg-muted-foreground rounded-full" />
            <span className="w-2 h-2 bg-muted-foreground rounded-full" />
            <span className="w-2 h-2 bg-muted-foreground rounded-full" />
          </div>
          <span className="text-xs text-muted-foreground">{userName} is typing...</span>
        </div>
      </div>
    </div>
  );
}
