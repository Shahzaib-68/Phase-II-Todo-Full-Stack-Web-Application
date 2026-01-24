'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  Settings,
  LogOut,
  Menu
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const Sidebar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: CheckSquare, label: 'Tasks', href: '/dashboard/tasks' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = '/login'; // Redirect to login page after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isMobileMenuOpen ? 0 : '-100%' }}
        className={`fixed md:relative z-40 w-64 h-screen bg-white/5 backdrop-blur-xl border-r border-white/10 ${
          isMobileMenuOpen ? 'translate-x-0' : 'md:translate-x-0 -translate-x-full'
        } md:flex flex-col transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6 border-b border-white/10">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            VIP Todo
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        isActive(item.href)
                          ? 'bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                          : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </motion.div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

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
      </motion.aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;