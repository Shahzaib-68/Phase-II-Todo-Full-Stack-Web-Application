'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/sidebar';
import MobileSidebar from '@/components/MobileSidebar';
import DashboardHeader from '@/components/layout/header';
import { Menu } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-white">
      {/* Desktop Sidebar - Hidden on mobile, visible on desktop */}
      <aside className="w-64 h-full border-r border-white/10 bg-[#050505] hidden md:flex flex-col">
        <Sidebar />
      </aside>

      {/* Mobile menu button - visible on mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={isMobileMenuOpen} onClose={toggleMobileMenu} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <header className="h-16 w-full border-b border-white/5 flex items-center px-8 bg-black/40 backdrop-blur-md">
          <DashboardHeader />
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-10 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}