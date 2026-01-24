'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: email.trim(),
        password: password,
        callbackURL: '/dashboard',
      }, {
        onSuccess: () => {
          window.location.assign('/dashboard');
        }
      });

      console.log('Login response:', data, error); // Debug log

      if (error) {
        // Show specific error like "Invalid email or password"
        toast.error('Login Failed', {
          description: error.message || 'Sign in failed',
        });
        return;
      }

      // Force a full browser reload to the dashboard to ensure clean state transfer
      window.location.assign('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error); // Debug log
      toast.error('Login Failed', {
        description: error.message || 'An error occurred during login',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-black to-black p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-md p-8 rounded-2xl bg-[rgba(10,10,10,0.7)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Elevate Your Productivity</h1>
          <p className="text-gray-400 mt-2">Access your premium workspace and manage tasks with precision.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 text-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}