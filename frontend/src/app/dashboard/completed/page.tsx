'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import TaskList from '@/components/dashboard/TaskList';

interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string;
  completed: boolean;  // ✅ Backend uses "completed", not "status"
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

interface TasksResponse {
  tasks: Task[];
  count: number;
}

export default function CompletedPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const fetchCompletedTasks = async (showErrorToast = false) => {
    try {
      setIsLoading(true);

      // ✅ Get session safely
      const { data: sessionData, error } = await authClient.getSession();

      if (error) {
        console.error('Session error:', error);
        if (showErrorToast) {
          toast.error('Session expired', {
            description: 'Please login again',
          });
        }
        return;
      }

      if (!sessionData?.user?.id) {
        console.log('No user session found');
        setTasks([]);
        return;
      }

      const userId = sessionData.user.id;

      // ✅ Fetch completed tasks from backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/?user_id=${userId}&status_filter=completed&sort_by=created`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Fetch error:', errorData);
        
        if (showErrorToast) {
          toast.error('Failed to fetch completed tasks', {
            description: errorData.detail || 'Please try again',
          });
        }
        
        setTasks([]);
        return;
      }

      const data: TasksResponse = await response.json();
      
      console.log('✅ Completed tasks fetched:', data);

      // ✅ Backend already filters by status, just use the response
      setTasks(data.tasks || []);

    } catch (error: any) {
      console.error('Error fetching completed tasks:', error);
      
      if (showErrorToast) {
        toast.error('Failed to fetch completed tasks', {
          description: error.message || 'Please check your connection',
        });
      }
      
      setTasks([]);
      
    } finally {
      setIsLoading(false);
      setInitialLoadComplete(true);
    }
  };

  // ✅ Initial load (no error toast)
  useEffect(() => {
    fetchCompletedTasks(false);
  }, []);

  // ✅ User-triggered refresh (show error toast)
  const handleTaskUpdate = () => {
    fetchCompletedTasks(true);
  };

  return (
    <div>
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Completed Tasks Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="text-3xl font-bold text-green-400">
              {isLoading && !initialLoadComplete ? '...' : tasks.length}
            </div>
            <div className="text-gray-400 mt-1">Completed Tasks</div>
          </Card>
        </motion.div>

        {/* All Completed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="text-3xl font-bold text-white">
              {isLoading && !initialLoadComplete ? '...' : tasks.filter(t => t.completed).length}
            </div>
            <div className="text-gray-400 mt-1">All Completed</div>
          </Card>
        </motion.div>

        {/* Completion Rate (if you track total) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="text-3xl font-bold text-blue-400">
              {tasks.length > 0 ? '100%' : '0%'}
            </div>
            <div className="text-gray-400 mt-1">Completion Rate</div>
          </Card>
        </motion.div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Completed Tasks</h2>
      </div>

      {/* Task List */}
      <TaskList
        tasks={tasks}
        loading={isLoading}
        onTaskUpdate={handleTaskUpdate}
      />
    </div>
  );
}