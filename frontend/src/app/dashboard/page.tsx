'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import NewTaskDialog from '@/components/NewTaskDialog';
import TaskList from '@/components/dashboard/TaskList';

interface TaskStats {
  total: number;
  pending: number;
  completed: number;
}

interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

interface TasksResponse {
  tasks: Task[];
  count: number;
}

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    pending: 0,
    completed: 0
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const fetchTasksAndStats = async (showErrorToast = false) => {
    try {
      setIsLoading(true);

      // ✅ Check session
      if (!session?.user?.id) {
        console.log('No user session found');
        setStats({ total: 0, pending: 0, completed: 0 });
        setTasks([]);
        return;
      }

      const userId = session.user.id;

      // ✅ Fetch stats from backend (cookie-based auth)
      const statsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/stats?user_id=${userId}`,
        {
          credentials: 'include', // ✅ Uses cookies, no Authorization header needed
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!statsResponse.ok) {
        const errorData = await statsResponse.json().catch(() => ({}));
        console.error('Stats fetch error:', errorData);
        
        if (showErrorToast) {
          toast.error('Failed to fetch stats', {
            description: errorData.detail || 'Please try again',
          });
        }
        
        setStats({ total: 0, pending: 0, completed: 0 });
      } else {
        const statsData = await statsResponse.json();
        setStats(statsData);
        console.log('✅ Stats fetched:', statsData);
      }

      // ✅ Fetch tasks from backend
      const tasksResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/?user_id=${userId}&status_filter=all&sort_by=created`,
        {
          credentials: 'include', // ✅ Uses cookies
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!tasksResponse.ok) {
        const errorData = await tasksResponse.json().catch(() => ({}));
        console.error('Tasks fetch error:', errorData);
        
        if (showErrorToast) {
          toast.error('Failed to fetch tasks', {
            description: errorData.detail || 'Please try again',
          });
        }
        
        setTasks([]);
      } else {
        const tasksData: TasksResponse = await tasksResponse.json();
        setTasks(tasksData.tasks || []);
        console.log('✅ Tasks fetched:', tasksData);
      }

    } catch (error: any) {
      console.error('Error fetching data:', error);
      
      if (showErrorToast) {
        toast.error('Failed to fetch task data', {
          description: error.message || 'Please check your connection',
        });
      }
      
      setStats({ total: 0, pending: 0, completed: 0 });
      setTasks([]);
      
    } finally {
      setIsLoading(false);
      setInitialLoadComplete(true);
    }
  };

  // ✅ Diagnostic log
  console.log('CLIENT SESSION:', session);

  useEffect(() => {
    // ✅ Wait for session to load
    if (isPending) {
      return;
    }

    // ✅ Silent initial load (no error toast)
    fetchTasksAndStats(false);
  }, [session, isPending]);

  const handleTaskCreated = () => {
    // ✅ Show errors on user-triggered refresh
    fetchTasksAndStats(true);
  };

  const handleTaskUpdate = () => {
    // ✅ Show errors on user-triggered refresh
    fetchTasksAndStats(true);
  };

  // ✅ Show loading state while checking auth
  if (isPending || (isLoading && !initialLoadComplete)) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  // ✅ Show not authenticated message if no session
  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Not Authenticated</h2>
          <p className="text-gray-400 mb-4">You need to be logged in to access the dashboard.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Total Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="text-3xl font-bold text-white">
              {isLoading && !initialLoadComplete ? '...' : stats.total}
            </div>
            <div className="text-gray-400 mt-1">Total Tasks</div>
          </Card>
        </motion.div>

        {/* Pending Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="text-3xl font-bold text-yellow-400">
              {isLoading && !initialLoadComplete ? '...' : stats.pending}
            </div>
            <div className="text-gray-400 mt-1">Pending</div>
          </Card>
        </motion.div>

        {/* Completed Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="text-3xl font-bold text-green-400">
              {isLoading && !initialLoadComplete ? '...' : stats.completed}
            </div>
            <div className="text-gray-400 mt-1">Completed</div>
          </Card>
        </motion.div>
      </div>

      {/* Task List Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Tasks</h2>
          <NewTaskDialog onTaskCreated={handleTaskCreated} />
        </div>

        {/* Task List Component */}
        <TaskList
          tasks={tasks}
          loading={isLoading}
          onTaskUpdate={handleTaskUpdate}
        />
      </section>
    </div>
  );
}