import Sidebar from '@/components/layout/sidebar';
import DashboardHeader from '@/components/layout/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-white">
      {/* Sidebar Container */}
      <aside className="w-72 h-full border-r border-white/10 bg-[#050505] hidden md:flex flex-col">
        <Sidebar />
      </aside>

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