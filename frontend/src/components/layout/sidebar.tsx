'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ListTodo, CheckCircle2, Settings, LogOut, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: ListTodo, label: 'My Tasks', href: '/dashboard/tasks' },
    { icon: CheckCircle2, label: 'Completed', href: '/dashboard/completed' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = '/login';
      toast.success('Logged out successfully!', {
        description: 'You have been signed out of your account',
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed', {
        description: 'There was an issue signing you out. Please try again.',
      });
    }
  };

  return (
    <div className={`w-72 h-full bg-black/40 backdrop-blur-xl border-r border-white/5 flex flex-col justify-between ${className || ''}`}>
      {/* Top Section */}
      <div>
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-blue-500" size={24} />
            <span className="text-xl font-bold text-blue-500">VIP TODO</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <div className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-all ${
                      isActive(item.href) ? 'bg-blue-500/20 text-blue-400' : 'text-gray-300'
                    }`}>
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-all text-red-500 w-full justify-start"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}