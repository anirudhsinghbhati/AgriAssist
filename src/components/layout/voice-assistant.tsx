'use client';

import { useState } from 'react';
import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { voiceAssistedNavigation } from '@/ai/flows/voice-assisted-app-navigation';
import { Loader2 } from 'lucide-react';

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  const handleInteraction = async () => {
    if (!userInput) return;
    setIsLoading(true);
    setAiResponse('');
    try {
      const result = await voiceAssistedNavigation({ voiceInput: userInput });
      setAiResponse(result.navigationInstructions);
    } catch (error) {
      console.error('Error with voice assistant:', error);
      setAiResponse('Sorry, I am having trouble understanding. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50"
        onClick={() => setIsOpen(true)}
      >
        <Mic className="h-8 w-8" />
        <span className="sr-only">Open Voice Assistant</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Voice Assistant</DialogTitle>
            <DialogDescription>
              Ask me anything about the app or your farm.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="voice-input"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="e.g., 'Show me crop recommendations'"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    handleInteraction();
                }
              }}
            />
            {isLoading && (
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                </div>
            )}
            {aiResponse && (
              <div className="mt-2 rounded-md border bg-muted/50 p-3 text-sm">{aiResponse}</div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleInteraction} disabled={isLoading || !userInput}>
              {isLoading ? 'Processing...' : 'Ask'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
