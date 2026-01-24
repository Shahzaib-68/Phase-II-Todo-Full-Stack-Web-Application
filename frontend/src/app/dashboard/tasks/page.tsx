'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import NewTaskDialog from '@/components/NewTaskDialog';
import TaskList from '@/components/dashboard/TaskList';

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

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskCount, setTaskCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const fetchTasksAndStats = async (showErrorToast = false) => {
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
        setTaskCount(0);
        return;
      }

      const userId = sessionData.user.id;

      // ✅ Fetch tasks from backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/?user_id=${userId}&status_filter=all&sort_by=created`,
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
        
        // ✅ Only show toast for user-triggered refreshes
        if (showErrorToast) {
          toast.error('Failed to fetch tasks', {
            description: errorData.detail || 'Please try again',
          });
        }
        
        setTasks([]);
        setTaskCount(0);
        return;
      }

      const data: TasksResponse = await response.json();
      
      // ✅ Debug logging
      console.log('✅ Tasks fetched successfully:', data);

      // ✅ Update state
      setTasks(data.tasks || []);
      setTaskCount(data.count || 0);

    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      
      // ✅ Only show error toast if explicitly requested
      if (showErrorToast) {
        toast.error('Failed to fetch tasks', {
          description: error.message || 'Please check your connection',
        });
      }
      
      setTasks([]);
      setTaskCount(0);
      
    } finally {
      setIsLoading(false);
      setInitialLoadComplete(true);
    }
  };

  // ✅ Initial load (no error toast)
  useEffect(() => {
    fetchTasksAndStats(false);
  }, []);

  // ✅ User-triggered refresh (show error toast)
  const handleTaskCreated = () => {
    fetchTasksAndStats(true);
  };

  const handleTaskUpdate = () => {
    fetchTasksAndStats(true);
  };

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
              {isLoading && !initialLoadComplete ? '...' : taskCount}
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
              {isLoading && !initialLoadComplete 
                ? '...' 
                : tasks.filter(task => !task.completed).length
              }
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
              {isLoading && !initialLoadComplete 
                ? '...' 
                : tasks.filter(task => task.completed).length
              }
            </div>
            <div className="text-gray-400 mt-1">Completed</div>
          </Card>
        </motion.div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">All Tasks</h2>
        <NewTaskDialog onTaskCreated={handleTaskCreated} />
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