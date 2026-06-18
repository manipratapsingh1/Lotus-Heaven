import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';

export const VoiceCommandButton = () => {
  const { isListening, startListening } = useVoiceCommands();

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        onClick={startListening}
        variant={isListening ? 'default' : 'outline'}
        size="icon"
        className={`relative ${
          isListening 
            ? 'bg-destructive text-destructive-foreground animate-glow-pulse' 
            : 'glass'
        }`}
        disabled={isListening}
      >
        {isListening ? (
          <MicOff className="h-5 w-5 animate-pulse" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
        
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full bg-destructive/30"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </Button>
    </motion.div>
  );
};
