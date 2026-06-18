import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, User, Compass, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { motion } from 'framer-motion';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const { isAuthenticated, login, register, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const getErrorMessage = (error: any, fallback: string): string => {
    if (error.response?.data?.message) {
      const msg = error.response.data.message;
      return Array.isArray(msg) ? msg.join(', ') : msg;
    }
    if (error.code === 'ERR_NETWORK' || !error.response) {
      return 'Cannot connect to the server. Please make sure the backend is running.';
    }
    if (error.response?.status === 500) {
      return 'Server error. Please check the backend configuration and database connection.';
    }
    return fallback;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(email, password, fullName);
      toast({
        title: 'Success',
        description: 'Account created successfully! Welcome to Lotus Heaven.',
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Sign Up Failed',
        description: getErrorMessage(error, 'Could not create account. Please try again.'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Sign In Failed',
        description: getErrorMessage(error, 'Invalid credentials. Please try again.'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-subtle particles-bg p-4 overflow-hidden">
      {/* Decorative Glow Spots */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link to="/">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground gap-2 rounded-xl">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass-card border-2 border-primary/20 shadow-glow rounded-3xl overflow-hidden p-6 md:p-8">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.05 }}
                transition={{ duration: 0.6 }}
                className="h-14 w-14 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-glow"
              >
                <Compass className="h-8 w-8 text-primary-foreground" />
              </motion.div>
            </div>
            <CardTitle className="text-3xl font-bold luxury-text mb-2">Lotus Heaven</CardTitle>
            <CardDescription className="text-muted-foreground/80 font-light text-sm">
              Sign in to your luxury portal or create a membership
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 p-1 glass border border-primary/15 rounded-xl mb-6">
                <TabsTrigger 
                  value="signin" 
                  className="data-[state=active]:bg-gradient-gold data-[state=active]:text-primary-foreground font-semibold rounded-lg py-2.5 transition-all"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="data-[state=active]:bg-gradient-gold data-[state=active]:text-primary-foreground font-semibold rounded-lg py-2.5 transition-all"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        className="pl-10 bg-background/30 border-primary/15 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        className="pl-10 bg-background/30 border-primary/15 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 rounded-xl"
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold py-6 rounded-xl shadow-glow transition-all duration-300" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        disabled={loading}
                        className="pl-10 bg-background/30 border-primary/15 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        className="pl-10 bg-background/30 border-primary/15 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        disabled={loading}
                        className="pl-10 bg-background/30 border-primary/15 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 rounded-xl"
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold py-6 rounded-xl shadow-glow transition-all duration-300" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Sign Up'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
