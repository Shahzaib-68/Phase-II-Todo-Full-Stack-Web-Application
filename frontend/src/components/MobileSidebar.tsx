'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, LayoutDashboard, CheckSquare, CheckCircle, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const MobileSidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const navItems: NavItem[] = [
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
      onClose(); // Close the mobile menu after logout
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed', {
        description: 'There was an issue signing you out. Please try again.',
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-40 md:hidden"
            onClick={onClose}
          />

          {/* Mobile sidebar */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="fixed top-0 left-0 z-50 w-64 h-full bg-black/80 backdrop-blur-xl border-r border-white/10 flex flex-col"
          >
            {/* Header with close button */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                VIP TODO
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link href={item.href} onClick={onClose}>
                        <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                          isActive(item.href)
                            ? 'bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                            : 'text-gray-300 hover:bg-white/10'
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

            {/* User info and logout */}
            <div className="p-4 border-t border-white/10">
              <div className="text-sm text-gray-400 mb-2">Current User</div>
              <div className="flex items-center justify-between">
                <div className="text-gray-200">{user?.name || user?.email || 'Guest'}</div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;