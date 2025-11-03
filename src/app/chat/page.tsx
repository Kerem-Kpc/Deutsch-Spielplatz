'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, BookMarked } from 'lucide-react';
import { germanTutor } from '@/ai/flows/german-tutor-flow';
import type { ChatMessage } from '@/lib/types';
import { ChatMessageComponent } from '@/components/chat/chat-message';

const initialMessage: ChatMessage = {
  role: 'model',
  content: 'Hallo! Wie geht es dir?',
};

const EXPLAIN_COMMAND = 'Erkläre deine letzte Antwort.';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleResponse = async (history: ChatMessage[]) => {
    setIsLoading(true);
    try {
      const assistantMessage = await germanTutor({ history });
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error getting response from AI:', error);
      const errorMessage: ChatMessage = {
        role: 'model',
        content:
          'Entschuldigung, ein Fehler ist aufgetreten. Bitte versuche es später noch einmal.',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    
    await handleResponse(newHistory);
  };

  const handleExplain = async () => {
    if (isLoading) return;

    const explainMessage: ChatMessage = {
      role: 'user',
      content: EXPLAIN_COMMAND,
    };
    const newHistory = [...messages, explainMessage];
    // We don't show the command in the chat history for a cleaner UI
    
    await handleResponse(newHistory);
  };
  
  const lastMessage = messages[messages.length - 1];

  return (
    <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-2xl mx-auto shadow-2xl bg-card flex flex-col h-full">
        <CardHeader className="flex flex-row items-center justify-center p-4 border-b">
          <CardTitle className="text-2xl md:text-3xl font-headline">
            Deutsch Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 p-0 min-h-0">
          <div
            ref={chatContainerRef}
            className="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto"
          >
            {messages.map((msg, index) => (
              <ChatMessageComponent key={index} message={msg} />
            ))}
            {isLoading && (
              <ChatMessageComponent
                message={{ role: 'model', content: '' }}
                isLoading={true}
              />
            )}
          </div>

          {lastMessage.role === 'model' && !isLoading && (
            <div className="flex justify-end px-4 pb-2">
              <Button variant="ghost" size="sm" onClick={handleExplain} title="Erklärung anfordern">
                <BookMarked className="h-4 w-4 mr-2" />
                Erklärung anfordern
              </Button>
            </div>
          )}

          <div className="p-4 border-t bg-background">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Schreibe etwas auf Deutsch..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-grow"
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Senden</span>
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
