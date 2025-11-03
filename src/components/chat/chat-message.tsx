'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/lib/types';

interface ChatMessageProps {
  message: ChatMessage;
  isLoading?: boolean;
}

export function ChatMessageComponent({
  message,
  isLoading = false,
}: ChatMessageProps) {
  const isModel = message.role === 'model';
  return (
    <div
      className={cn(
        'flex items-start gap-3',
        isModel ? 'justify-start' : 'justify-end'
      )}
    >
      {isModel && (
        <Avatar className="h-8 w-8 border">
          <AvatarImage src="/german-tutor.png" alt="Lehrer Alex" />
          <AvatarFallback>LA</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'rounded-lg px-4 py-2 max-w-[80%] break-words shadow-sm',
          isModel
            ? 'bg-muted text-muted-foreground'
            : 'bg-primary text-primary-foreground'
        )}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-1.5 py-1">
            <span className="h-2 w-2 animate-pulse rounded-full bg-current delay-0" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-current delay-200" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-current delay-400" />
          </div>
        ) : (
          <div
            className="prose prose-sm max-w-none text-current prose-p:my-2 prose-headings:my-3 prose-blockquote:my-2"
            dangerouslySetInnerHTML={{ __html: message.content }}
          />
        )}
      </div>
      {!isModel && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>Du</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
