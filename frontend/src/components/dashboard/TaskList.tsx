'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash, Pencil, Check } from 'lucide-react';

interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string;
  priority: string;
  due_date: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onTaskUpdate: () => void;
}

export default function TaskList({ tasks, loading, onTaskUpdate }: TaskListProps) {
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleStatusToggle = async (taskId: number, currentStatus: boolean) => {
    try {
      // ✅ Session check - clean error
      if (!session?.user?.id) {
        toast.error('Please login first');
        return;
      }

      // ✅ Optimistic UI update (instant feedback)
      setLocalTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: !currentStatus } : task
        )
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}/complete?user_id=${session.user.id}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        // ✅ Revert optimistic update on error
        setLocalTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, completed: currentStatus } : task
          )
        );

        const errorData = await response.json().catch(() => ({}));
        console.error('Toggle error:', errorData);
        throw new Error(errorData.detail || 'Failed to update task');
      }

      // ✅ Success feedback
      toast.success(`Task ${!currentStatus ? 'completed' : 'marked pending'}!`);
      onTaskUpdate(); // Refresh from server
      
    } catch (error: any) {
      console.error('Task toggle error:', error);
      toast.error('Could not update task', {
        description: error.message || 'Please try again',
      });
    }
  };

  const handleDelete = async (taskId: number) => {
    try {
      setDeletingTaskId(taskId);

      // ✅ Session check
      if (!session?.user?.id) {
        toast.error('Please login first');
        setDeletingTaskId(null);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}?user_id=${session.user.id}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Delete error:', errorData);
        throw new Error(errorData.detail || 'Failed to delete task');
      }

      // ✅ Update local state
      setLocalTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      toast.success('Task deleted successfully!');
      onTaskUpdate();
      
    } catch (error: any) {
      console.error('Task delete error:', error);
      toast.error('Could not delete task', {
        description: error.message || 'Please try again',
      });
    } finally {
      setDeletingTaskId(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Skeleton className="h-20 w-full bg-white/10 rounded-xl" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (localTasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-8 rounded-2xl border border-white/10 backdrop-blur-sm max-w-lg">
          <div className="text-5xl mb-6">✨</div>
          <h3 className="text-2xl font-bold text-white mb-3">All clear!</h3>
          <p className="text-gray-400">Ready to add new tasks?</p>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <div className="space-y-4">
        {localTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="flex items-center pt-1">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => handleStatusToggle(task.id, task.completed)}
                  className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`text-base font-medium ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                    {task.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                    {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)}
                  </span>
                </div>

                {task.description && (
                  <p className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-400'}`}>
                    {task.description}
                  </p>
                )}

                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                  {task.due_date && (
                    <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white hover:bg-white/10"
                  onClick={() => {
                    toast.info('Edit feature coming soon!');
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                  onClick={() => handleDelete(task.id)}
                  disabled={deletingTaskId === task.id}
                >
                  {deletingTaskId === task.id ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Trash className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}