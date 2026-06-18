import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/components/ui/button';
import { Compass, Menu, LogOut, Heart, MapPin, DollarSign, Camera, Sparkles, CalendarDays, X } from 'lucide-react';
import { VoiceCommandButton } from './VoiceCommandButton';
import { WeatherWidget } from './WeatherWidget';
import { LanguageSelector } from './LanguageSelector';
import { NotificationCenter } from './NotificationCenter';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/lib/stores/languageStore';
import { useWishlistStore } from '@/lib/stores/wishlistStore';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguageStore();
  const { favorites } = useWishlistStore();
  const { user, isAuthenticated, logout: authLogout, checkAuth } = useAuthStore();

  const isLoggedIn = isAuthenticated;
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = async () => {
    await authLogout();
    navigate('/');
  };

  const travelLinks = [
    { to: '/discover', label: 'Discover', icon: Compass, desc: 'Find your perfect destination', color: 'from-blue-500 to-cyan-500' },
    { to: '/trip-planner', label: 'Trip Planner', icon: CalendarDays, desc: 'Plan & collaborate on trips', color: 'from-purple-500 to-pink-500' },
    { to: '/expenses', label: 'Expenses', icon: DollarSign, desc: 'Track spending & budget', color: 'from-amber-500 to-orange-500' },
    { to: '/experiences', label: 'Experiences', icon: Sparkles, desc: 'Local tours & activities', color: 'from-green-500 to-emerald-500' },
    { to: '/memories', label: 'Memories', icon: Camera, desc: 'Travel journal & badges', color: 'from-rose-500 to-pink-500' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20 }}
      className="glass-card sticky top-0 z-40 border-b border-primary/10 backdrop-blur-2xl"
    >
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="h-11 w-11 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-glow relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Compass className="h-6 w-6 text-primary-foreground relative z-10" />
            </motion.div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold luxury-text block leading-tight">Lotus Heaven</span>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-primary/60">Travel Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <Link to="/">
              <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary font-medium transition-all px-4 rounded-xl text-sm">
                Home
              </Button>
            </Link>
            
            {/* Travel Mega Menu Trigger */}
            <div className="relative" onMouseEnter={() => setIsMegaOpen(true)} onMouseLeave={() => setIsMegaOpen(false)}>
              <Button variant="ghost" className={`hover:bg-primary/10 hover:text-primary font-medium transition-all px-4 rounded-xl text-sm gap-1.5 ${isMegaOpen ? 'bg-primary/10 text-primary' : ''}`}>
                <Compass className="h-4 w-4" />
                Travel
                <motion.span animate={{ rotate: isMegaOpen ? 180 : 0 }} className="text-xs">▾</motion.span>
              </Button>
              
              <AnimatePresence>
                {isMegaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[480px] glass-card rounded-2xl border border-primary/15 shadow-2xl p-4"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {travelLinks.map((link) => (
                        <Link key={link.to} to={link.to} onClick={() => setIsMegaOpen(false)}>
                          <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary/5 transition-all group cursor-pointer">
                            <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                              <link.icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{link.label}</p>
                              <p className="text-xs text-muted-foreground">{link.desc}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/rooms">
              <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary font-medium transition-all px-4 rounded-xl text-sm">
                Suites
              </Button>
            </Link>

            {isLoggedIn && (
              <Link to="/dashboard">
                <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary font-medium transition-all px-4 rounded-xl text-sm">
                  Dashboard
                </Button>
              </Link>
            )}
            
            <Link to="/wishlist">
              <Button variant="ghost" className="hover:bg-destructive/10 hover:text-destructive font-medium transition-all px-3 rounded-xl relative">
                <Heart className="h-4 w-4" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Button>
            </Link>
            
            {isAdmin && (
              <Link to="/admin">
                <Button variant="ghost" className="hover:bg-accent/10 hover:text-accent font-medium transition-all px-4 rounded-xl text-sm">
                  Admin
                </Button>
              </Link>
            )}
            
            <div className="w-px h-5 bg-border/40 mx-1" />
            
            <LanguageSelector />
            <VoiceCommandButton />
            {isLoggedIn && <NotificationCenter />}
            
            {isLoggedIn ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary font-medium transition-all px-4 rounded-xl text-sm">
                    Profile
                  </Button>
                </Link>
                <Button 
                  onClick={handleLogout}
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-destructive/10 hover:text-destructive transition-all rounded-xl h-9 w-9"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button className="bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold shadow-glow hover:shadow-glow-accent transition-all duration-300 px-6 rounded-xl text-sm">
                    Sign In
                  </Button>
                </motion.div>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden gap-2">
            <VoiceCommandButton />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 space-y-1 pb-4 overflow-hidden"
            >
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-sm">Home</Button>
              </Link>
              
              {/* Travel Links in Mobile */}
              <div className="px-2 py-2">
                <p className="text-xs font-semibold text-primary mb-2 px-2">TRAVEL</p>
                {travelLinks.map((link) => (
                  <Link key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-sm gap-2">
                      <link.icon className="h-4 w-4 text-primary" />
                      {link.label}
                    </Button>
                  </Link>
                ))}
              </div>

              <Link to="/rooms" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-sm">Suites</Button>
              </Link>
              <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist {favorites.length > 0 && `(${favorites.length})`}
                </Button>
              </Link>
              {isLoggedIn && (
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-sm">Dashboard</Button>
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-sm">Admin</Button>
                </Link>
              )}
              {isLoggedIn ? (
                <>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-sm">Profile</Button>
                  </Link>
                  <Button 
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    variant="ghost" 
                    className="w-full justify-start hover:bg-destructive/10 hover:text-destructive text-sm"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-gradient-gold text-primary-foreground font-semibold text-sm">
                    Sign In
                  </Button>
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
