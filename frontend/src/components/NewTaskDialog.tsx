'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

interface NewTaskDialogProps {
  onTaskCreated: () => void;
}

export default function NewTaskDialog({ onTaskCreated }: NewTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get session data for the current user
  const { data: session } = authClient.useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!title.trim()) {
      toast.error('Title required', {
        description: 'Please enter a task title',
      });
      return;
    }

    if (!session?.user?.id) {
      toast.error('Authentication error', {
        description: 'User ID not found. Please log in again.',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const taskData: any = {
        title: title.trim(),
        description: description.trim(),
        priority,
      };

      // Add due date if provided
      if (dueDate) {
        taskData.due_date = new Date(dueDate).toISOString();
      }

      console.log('Creating task:', taskData); // Debug

      // ✅ FIXED: Remove user_id from URL, remove Authorization header
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/`, {
        method: 'POST',
        credentials: 'include', // ✅ This sends cookies (auth-token)
        headers: {
          'Content-Type': 'application/json',
          // ❌ NO Authorization header - backend uses cookies only
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to create task');
      }

      const createdTask = await response.json();
      console.log('Task created:', createdTask); // Debug

      toast.success('Task created successfully!', {
        description: 'Your new task has been added to your list',
      });

      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setIsOpen(false);

      // Refresh the task list
      onTaskCreated();
    } catch (error: any) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task', {
        description: error.message || 'Please check your backend connection',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-shadow">
          <span className="text-lg">+</span>
          <span>New Task</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-black/80 backdrop-blur-xl border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Task</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add a new task to your productivity list
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
              className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-500"
              placeholder="Task title"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-500"
              placeholder="Task description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-1">
                Priority
              </label>
              <Select value={priority} onValueChange={setPriority} disabled={isSubmitting}>
                <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-gray-700 text-white">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300 mb-1">
                Due Date
              </label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isSubmitting}
                className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}