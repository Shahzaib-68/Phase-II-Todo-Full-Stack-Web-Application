'use client';

import { Search, Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const getPageTitle = (pathname: string) => {
  switch(pathname) {
    case '/dashboard':
      return 'Good Morning, ';
    case '/dashboard/tasks':
      return 'My Tasks';
    case '/dashboard/calendar':
      return 'Calendar View';
    case '/dashboard/settings':
      return 'Settings';
    default:
      return 'Dashboard';
  }
};

const DashboardHeader = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  
  const title = getPageTitle(pathname);
  const userName = user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <header className="p-6 border-b border-white/10 backdrop-blur-sm bg-black/20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          {pathname === '/dashboard' ? `${title}${userName}` : title}
        </h1>
        
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          
          {/* Quick Add Button */}
          <button className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-shadow">
            <Plus size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;