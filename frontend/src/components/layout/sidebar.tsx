'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, CheckCircle, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: CheckSquare, label: 'My Tasks', href: '/dashboard/tasks' },
    { icon: CheckCircle, label: 'Completed', href: '/dashboard/completed' },
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
    <div className={`w-64 h-full bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col ${className || ''}`}>
      {/* Top Section */}
      <div>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            VIP Todo
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
                      isActive(item.href)
                        ? 'bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                        : 'text-gray-300'
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
      <div className="p-4 border-t border-white/10">
        <div className="text-sm text-gray-400 mb-2">Current User</div>
        <div className="flex items-center justify-between">
          <div className="text-gray-200">{user?.name || user?.email || 'Guest'}</div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}