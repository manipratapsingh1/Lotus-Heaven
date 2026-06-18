import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Compass, HelpCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-subtle particles-bg p-4 overflow-hidden">
      {/* Decorative Glow Spots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-md relative z-10 p-8 glass-card border-2 border-primary/20 shadow-glow rounded-3xl"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="h-20 w-20 rounded-3xl bg-gradient-gold flex items-center justify-center shadow-glow"
          >
            <HelpCircle className="h-10 w-10 text-primary-foreground" />
          </motion.div>
        </div>

        <h1 className="text-8xl md:text-9xl font-bold luxury-text mb-4 leading-none select-none">404</h1>
        
        <h2 className="text-2xl font-bold text-foreground mb-4">Lost in Paradise?</h2>
        
        <p className="text-muted-foreground/80 mb-8 font-light text-sm leading-relaxed">
          The sanctuary page you are trying to access does not exist or has been relocated to another wing of the resort.
        </p>

        <Link to="/">
          <Button className="bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold px-8 py-6 rounded-xl shadow-glow gap-2 transition-all duration-300">
            <ArrowLeft className="h-4 w-4" />
            Return to Sanctuary
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
