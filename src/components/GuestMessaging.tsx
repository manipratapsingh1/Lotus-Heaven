import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  sender: 'guest' | 'staff';
  createdAt: string;
}

const STAFF_RESPONSES: Record<string, string> = {
  'check-in': 'Check-in time is at 2:00 PM. Early check-in may be available upon request, subject to availability.',
  'check-out': 'Check-out time is at 11:00 AM. Late check-out can be arranged for an additional fee.',
  'wifi': 'Complimentary high-speed WiFi is available throughout the property. Connect to "LotusHeaven-Guest" using your room number as the password.',
  'breakfast': 'Breakfast is served daily from 7:00 AM to 10:30 AM in the main restaurant on the ground floor.',
  'pool': 'The pool is open from 7:00 AM to 10:00 PM daily. Towels are provided poolside.',
  'room service': 'Room service is available 24/7. You can find the menu in your room or request it through this chat.',
  'parking': 'Complimentary valet parking is available for all guests. Simply hand your keys to our doorman.',
  'spa': 'Our spa is open from 9:00 AM to 9:00 PM. We recommend booking treatments in advance.',
};

function getStaffResponse(message: string): string {
  const lower = message.toLowerCase();
  for (const [key, response] of Object.entries(STAFF_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return 'Hello! Welcome to Lotus Heaven. How can I assist you today?';
  }
  if (lower.includes('thank')) {
    return 'You\'re welcome! Is there anything else I can help you with?';
  }
  if (lower.includes('help')) {
    return 'I\'d be happy to help! You can ask me about check-in/out times, WiFi, breakfast, pool, room service, parking, or spa services.';
  }
  return 'Thank you for your message. Our team will get back to you shortly. In the meantime, you can ask about check-in, breakfast, WiFi, pool, room service, or spa.';
}

export const GuestMessaging = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content: 'Welcome to Lotus Heaven! I\'m your hotel concierge. How can I assist you today?',
      sender: 'staff',
      createdAt: new Date().toISOString(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const guestMsg: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      sender: 'guest',
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, guestMsg]);
    const text = newMessage;
    setNewMessage('');
    setIsTyping(true);

    // Simulate staff typing delay
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));

    const staffMsg: Message = {
      id: `msg-${Date.now()}-reply`,
      content: getStaffResponse(text),
      sender: 'staff',
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, staffMsg]);
    setIsTyping(false);
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Guest Messaging
          <Badge variant="secondary" className="ml-auto text-xs bg-green-500/10 text-green-400 border-green-500/30">
            Online
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 overflow-y-auto mb-4 space-y-3 pr-2">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 ${msg.sender === 'guest' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.sender === 'staff' ? 'bg-primary/10' : 'bg-gradient-gold'
                }`}>
                  {msg.sender === 'staff' ? (
                    <Bot className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <User className="h-3.5 w-3.5 text-primary-foreground" />
                  )}
                </div>
                <div className={`max-w-[75%] p-3 rounded-xl text-sm ${
                  msg.sender === 'guest'
                    ? 'bg-primary/10 text-foreground rounded-tr-none'
                    : 'bg-muted/50 text-foreground rounded-tl-none'
                }`}>
                  <p>{msg.content}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="bg-muted/50 px-4 py-2 rounded-xl rounded-tl-none">
                <motion.div className="flex gap-1" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                  <span className="text-xs text-muted-foreground">typing</span>
                  <span className="text-muted-foreground">...</span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask about check-in, WiFi, breakfast..."
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
          />
          <Button onClick={handleSend} size="icon" className="bg-gradient-gold hover:opacity-90" disabled={isTyping || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
