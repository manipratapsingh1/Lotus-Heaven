import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageIcon, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Curated luxury hotel room images from Unsplash mapped to style keywords
const STYLE_IMAGES: Record<string, string[]> = {
  modern: [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
  ],
  classic: [
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80',
  ],
  luxury: [
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
    'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
  ],
  minimal: [
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
  ],
  tropical: [
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
  ],
};

function getMatchingImages(prompt: string): string[] {
  const lower = prompt.toLowerCase();
  for (const [style, images] of Object.entries(STYLE_IMAGES)) {
    if (style !== 'default' && lower.includes(style)) {
      return images;
    }
  }
  // Check for related keywords
  if (lower.includes('beach') || lower.includes('ocean') || lower.includes('island') || lower.includes('resort')) {
    return STYLE_IMAGES.tropical;
  }
  if (lower.includes('elegant') || lower.includes('grand') || lower.includes('premium') || lower.includes('suite') || lower.includes('penthouse')) {
    return STYLE_IMAGES.luxury;
  }
  if (lower.includes('simple') || lower.includes('clean') || lower.includes('white') || lower.includes('scandinavian')) {
    return STYLE_IMAGES.minimal;
  }
  if (lower.includes('traditional') || lower.includes('vintage') || lower.includes('royal')) {
    return STYLE_IMAGES.classic;
  }
  if (lower.includes('contemporary') || lower.includes('sleek') || lower.includes('futuristic')) {
    return STYLE_IMAGES.modern;
  }
  return STYLE_IMAGES.default;
}

const STYLE_SUGGESTIONS = [
  'Modern luxury suite',
  'Tropical resort room',
  'Classic elegant bedroom',
  'Minimal Scandinavian room',
  'Premium penthouse suite',
];

export const AIImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [styleName, setStyleName] = useState('');

  const handleGenerate = async (text?: string) => {
    const searchText = text || prompt;
    if (!searchText.trim()) return;
    
    setIsLoading(true);
    setGeneratedImage(null);
    if (text) setPrompt(text);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

    const images = getMatchingImages(searchText);
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setGeneratedImage(randomImage);
    setStyleName(searchText);
    setIsLoading(false);
  };

  const handleRegenerate = () => {
    if (prompt.trim()) {
      handleGenerate();
    }
  };

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Room Visualizer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe your dream room style..."
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            disabled={isLoading}
            className="bg-background/50"
          />
          <Button 
            onClick={() => handleGenerate()} 
            disabled={isLoading || !prompt.trim()} 
            className="bg-gradient-gold hover:opacity-90 min-w-[110px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Visualize
              </>
            )}
          </Button>
        </div>

        {/* Style suggestion chips */}
        <div className="flex flex-wrap gap-2">
          {STYLE_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleGenerate(suggestion)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-muted-foreground hover:text-primary hover:border-primary/60 transition-all duration-200 disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-64 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border border-border/30"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                >
                  <Sparkles className="h-10 w-10 text-primary mx-auto mb-3" />
                </motion.div>
                <p className="text-sm text-muted-foreground">AI is creating your room visualization...</p>
              </div>
            </motion.div>
          ) : generatedImage ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="relative group"
            >
              <img
                src={generatedImage}
                alt={`AI generated: ${styleName}`}
                className="w-full h-64 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <p className="text-white text-sm font-medium truncate">{styleName}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRegenerate}
                    className="border-white/30 text-white hover:bg-white/20 text-xs"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Regenerate
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-64 rounded-xl border-2 border-dashed border-border/50 flex items-center justify-center"
            >
              <div className="text-center text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium">Describe your dream room</p>
                <p className="text-xs mt-1 opacity-70">Try "modern luxury suite" or "tropical resort"</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
