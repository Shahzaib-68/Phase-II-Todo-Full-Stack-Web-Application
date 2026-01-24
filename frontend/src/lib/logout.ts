'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

export const handleLogout = async () => {
  try {
    const { error } = await authClient.signOut();

    if (error) {
      console.error('Logout error:', error);
      toast.error('Logout Failed', {
        description: error.message || 'An error occurred during logout. Please try again.',
      });
      return;
    }

    window.location.href = '/login'; // Redirect to login page after logout
  } catch (error: any) {
    console.error('Logout error:', error);
    toast.error('Logout Failed', {
      description: error.message || 'An error occurred during logout. Please try again.',
    });
  }
};