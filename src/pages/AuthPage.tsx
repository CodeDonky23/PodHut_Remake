import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) throw error;
        toast.success("Account created! You're now signed in.");
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success("Welcome back!");
      }
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: isSignUp ? 20 : -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }
    },
    exit: { 
      opacity: 0, 
      x: isSignUp ? -20 : 20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2],
              x: [0, 30, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1.3, 1, 1.3],
              opacity: [0.15, 0.4, 0.15],
              x: [0, -40, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/5 rounded-full blur-2xl"
            animate={{ 
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }} 
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="glass-card p-8 relative overflow-hidden">
            {/* Decorative gradient border */}
            <div className="absolute inset-0 rounded-xl p-[1px] bg-gradient-to-br from-primary/50 via-transparent to-accent/50 pointer-events-none" />
            
            <div className="relative z-10">
              {/* Header */}
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div 
                  className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 relative"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles className="w-8 h-8 text-primary-foreground" />
                  <motion.div 
                    className="absolute inset-0 rounded-2xl gradient-primary"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ filter: "blur(8px)", zIndex: -1 }}
                  />
                </motion.div>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isSignUp ? "signup" : "signin"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h1 className="text-2xl font-bold">
                      {isSignUp ? "Create Account" : "Welcome Back"}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      {isSignUp 
                        ? "Sign up to sync your favourites across devices" 
                        : "Sign in to access your podcasts"}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Form */}
              <AnimatePresence mode="wait">
                <motion.form 
                  key={isSignUp ? "signup-form" : "signin-form"}
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onSubmit={handleSubmit} 
                  className="space-y-5"
                >
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="you@example.com" 
                        required 
                        className="pl-10 bg-secondary/50 border-border/50 focus:border-primary/50 focus:bg-secondary transition-all duration-300"
                      />
                    </div>
                  </motion.div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input 
                        id="password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="••••••••" 
                        required 
                        minLength={6} 
                        className="pl-10 bg-secondary/50 border-border/50 focus:border-primary/50 focus:bg-secondary transition-all duration-300"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button 
                      type="submit" 
                      className="w-full gradient-primary text-primary-foreground font-medium h-12 group relative overflow-hidden"
                      disabled={loading}
                    >
                      <motion.span 
                        className="relative z-10 flex items-center justify-center gap-2"
                        whileHover={{ x: 5 }}
                      >
                        {loading ? (
                          <motion.div
                            className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                        ) : (
                          <>
                            {isSignUp ? "Create Account" : "Sign In"}
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </motion.span>
                      <motion.div 
                        className="absolute inset-0 bg-white/10"
                        initial={{ x: "-100%", opacity: 0 }}
                        whileHover={{ x: "100%", opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                    </Button>
                  </motion.div>
                </motion.form>
              </AnimatePresence>

              {/* Toggle */}
              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>
                
                <motion.button 
                  onClick={() => setIsSignUp(!isSignUp)} 
                  className="mt-4 text-sm text-muted-foreground hover:text-primary transition-colors group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSignUp ? (
                    <>Already have an account? <span className="text-primary font-medium group-hover:underline">Sign in</span></>
                  ) : (
                    <>Don't have an account? <span className="text-primary font-medium group-hover:underline">Sign up</span></>
                  )}
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
