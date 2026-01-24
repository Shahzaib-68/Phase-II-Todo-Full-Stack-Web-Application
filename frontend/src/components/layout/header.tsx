'use client';

import { Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import NewTaskDialog from '@/components/NewTaskDialog';

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

  const handleTaskCreated = () => {
    // Refresh the task list or stats when a new task is created
    window.location.reload();
  };

  return (
    <div className="w-full flex items-center justify-between">
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
        <NewTaskDialog onTaskCreated={handleTaskCreated} />
      </div>
    </div>
  );
};

export default DashboardHeader;