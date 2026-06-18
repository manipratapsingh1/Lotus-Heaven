import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './use-toast';

interface VoiceCommand {
  pattern: RegExp;
  action: () => void;
  description: string;
}

export const useVoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const commands: VoiceCommand[] = [
    {
      pattern: /show (me )?(deluxe|suite|executive) rooms?/i,
      action: () => navigate('/rooms'),
      description: 'Show deluxe rooms',
    },
    {
      pattern: /open admin( dashboard)?/i,
      action: () => navigate('/admin'),
      description: 'Open admin dashboard',
    },
    {
      pattern: /go (to )?home/i,
      action: () => navigate('/'),
      description: 'Go to home',
    },
    {
      pattern: /check availability/i,
      action: () => {
        navigate('/rooms');
        toast({ title: 'Showing available rooms' });
      },
      description: 'Check room availability',
    },
    {
      pattern: /search rooms?/i,
      action: () => navigate('/rooms'),
      description: 'Search rooms',
    },
  ];

  const processCommand = (text: string) => {
    const command = commands.find((cmd) => cmd.pattern.test(text));
    
    if (command) {
      command.action();
      toast({
        title: 'Voice Command Executed',
        description: text,
      });
    } else {
      toast({
        title: 'Command not recognized',
        description: 'Try: "Show deluxe rooms", "Open admin", "Go home"',
        variant: 'destructive',
      });
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: 'Not supported',
        description: 'Voice commands are not supported in this browser',
        variant: 'destructive',
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast({ title: 'Listening...', description: 'Speak your command' });
    };

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      processCommand(text);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast({
        title: 'Error',
        description: 'Could not process voice command',
        variant: 'destructive',
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return {
    isListening,
    transcript,
    startListening,
    commands: commands.map((cmd) => cmd.description),
  };
};
