import { motion } from 'motion/react';
import { useState } from 'react';
import { Mail, Lock, User, ArrowLeft, Zap, Loader2, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAuthStore } from '../../store';
import { toast } from 'sonner';
import type { UserRole } from '../../types';

interface AuthPageProps {
  mode: 'login' | 'signup';
  onBack: () => void;
  onSuccess: () => void;
}

export function AuthPage({ mode, onBack, onSuccess }: AuthPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('member');
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const success = await login(email, password);
        if (success) {
          toast.success('Welcome back!');
          onSuccess();
        } else {
          toast.error('Invalid email or password. Please check your credentials.');
        }
      } else {
        if (!name.trim()) {
          toast.error('Please enter your name');
          setLoading(false);
          return;
        }
        const success = await signup(email, password, name, role);
        if (success) {
          toast.success('Account created successfully!');
          onSuccess();
        } else {
          toast.error('Failed to create account. Email might already be in use.');
        }
      }
    } catch (error: any) {
      const message = error.message || 'An unexpected error occurred';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Back button */}
      <motion.button
        className="absolute top-6 left-6 z-10 flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        onClick={onBack}
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to home</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="p-8 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center"
              whileHover={{ rotate: 10, scale: 1.1 }}
            >
              <Zap className="w-7 h-7 text-white" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-slate-900 dark:text-slate-100">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {mode === 'login' 
                ? 'Enter your credentials to access your account' 
                : 'Sign up to get started with TaskFlow'}
            </p>
          </div>

          {mode === 'login' && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg space-y-3">
              <p className="text-sm text-blue-900 dark:text-blue-200 font-medium mb-2">Demo Credentials:</p>
              <div className="space-y-2 text-xs text-blue-800 dark:text-blue-300">
                <div className="p-2 bg-white/50 dark:bg-slate-900/50 rounded">
                  <p className="font-medium text-red-600 dark:text-red-400">👑 Admin:</p>
                  <p>admin@taskflow.com / admin123</p>
                </div>
                <div className="p-2 bg-white/50 dark:bg-slate-900/50 rounded">
                  <p className="font-medium text-blue-600 dark:text-blue-400">💼 Manager:</p>
                  <p>manager@taskflow.com / manager123</p>
                </div>
                <div className="p-2 bg-white/50 dark:bg-slate-900/50 rounded">
                  <p className="font-medium text-purple-600 dark:text-purple-400">👤 Member:</p>
                  <p>member@taskflow.com / member123</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Rajesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label htmlFor="role">Select Role</Label>
                  <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-slate-500" />
                          <div>
                            <p className="font-medium">Team Member</p>
                            <p className="text-xs text-slate-500">Can view and work on assigned tasks</p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="manager">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-blue-500" />
                          <div>
                            <p className="font-medium">Project Manager</p>
                            <p className="text-xs text-slate-500">Can manage projects and team members</p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-red-500" />
                          <div>
                            <p className="font-medium">Administrator</p>
                            <p className="text-xs text-slate-500">Full access to all projects and settings</p>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-slate-600 dark:text-slate-400">Remember me</span>
                </label>
                <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Forgot password?
                </a>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-6 text-base"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                mode === 'login' ? 'Sign in' : 'Create account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={() => window.location.hash = mode === 'login' ? 'signup' : 'login'}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>

          {mode === 'signup' && (
            <p className="mt-6 text-xs text-center text-slate-500 dark:text-slate-400">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            </p>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
