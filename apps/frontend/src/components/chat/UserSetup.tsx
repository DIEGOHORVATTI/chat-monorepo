import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle } from 'lucide-react';

interface UserSetupProps {
  onJoin: (name: string) => void;
}

export function UserSetup({ onJoin }: UserSetupProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length >= 2) {
      onJoin(name.trim());
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to Chat</h1>
        <p className="text-muted-foreground">Enter your name to start chatting</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground h-12"
          autoFocus
          minLength={2}
          maxLength={20}
        />
        <Button
          type="submit"
          disabled={name.trim().length < 2}
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
        >
          Join Chat
        </Button>
      </form>
    </div>
  );
}
