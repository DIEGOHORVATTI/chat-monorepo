import { MessageCircle } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background">
      <div className="relative empty-state-float">
        {/* Decorative elements */}
        <div className="absolute -top-8 -left-8 w-2 h-2 rounded-full bg-primary/60" />
        <div className="absolute -top-4 right-0 w-1.5 h-1.5 rounded-full bg-destructive/60" />
        <div className="absolute top-0 -right-6 text-muted-foreground/40 text-xs">×</div>
        <div className="absolute bottom-4 -left-6 w-1 h-1 rounded-full bg-primary/40" />
        <div className="absolute -bottom-2 right-4 w-1.5 h-1.5 rounded-full bg-cyan-400/60" />
        <div className="absolute top-1/2 -right-10 text-muted-foreground/30 text-xs">○</div>
        <div className="absolute bottom-0 -left-10 text-cyan-400/40 text-xs">◇</div>
        
        {/* Main chat bubble */}
        <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-glow">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground/90" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground/90" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground/90" />
          </div>
        </div>
      </div>
      
      <h2 className="mt-8 text-2xl font-semibold text-primary">Good morning!</h2>
      <p className="mt-2 text-muted-foreground">Write something awesome...</p>
    </div>
  );
}
