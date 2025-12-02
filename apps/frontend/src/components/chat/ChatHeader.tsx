import { User } from '@/types/chat';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  participant: User | null;
  isConnected: boolean;
}

export function ChatHeader({ participant, isConnected }: ChatHeaderProps) {
  return (
    <div className="h-16 px-6 flex items-center gap-4 border-b border-border bg-card/50">
      <span className="text-muted-foreground font-medium">To:</span>
      <div className="flex-1">
        {participant ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg max-w-xs">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-muted text-foreground text-xs font-medium">
                {participant.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-foreground text-sm">{participant.name}</span>
          </div>
        ) : (
          <div className="px-4 py-2 bg-secondary rounded-lg border border-border max-w-sm">
            <span className="text-muted-foreground text-sm">+ Recipients</span>
          </div>
        )}
      </div>
      <div className={cn(
        "w-2 h-2 rounded-full",
        isConnected ? "bg-online" : "bg-destructive"
      )} />
    </div>
  );
}
