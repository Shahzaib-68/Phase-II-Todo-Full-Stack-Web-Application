'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { 
  User, 
  Palette, 
  Bell, 
  Lock, 
  Trash2, 
  Download,
  Moon,
  Sun,
  Monitor,
  Save,
  AlertTriangle
} from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  id: string;
}

interface TaskStats {
  total: number;
  pending: number;
  completed: number;
}

interface Settings {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  notifications: boolean;
  emailNotifications: boolean;
  soundEnabled: boolean;
}

export default function SettingsPage() {
  const { data: session } = authClient.useSession();
  const [stats, setStats] = useState<TaskStats>({ total: 0, pending: 0, completed: 0 });
  const [profile, setProfile] = useState<UserProfile>({ name: '', email: '', id: '' });
  const [settings, setSettings] = useState<Settings>({
    theme: 'dark',
    accentColor: 'blue',
    notifications: true,
    emailNotifications: false,
    soundEnabled: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch stats and profile data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!session?.user?.id) {
          setIsLoading(false);
          return;
        }

        // Fetch stats
        const statsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/stats?user_id=${session.user.id}`,
          { credentials: 'include' }
        );

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        // Set profile from session
        setProfile({
          name: session.user.name || '',
          email: session.user.email || '',
          id: session.user.id,
        });

        // Load settings from localStorage
        const savedSettings = localStorage.getItem('app-settings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      // System theme
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', isDark);
    }

    // Apply accent color
    root.style.setProperty('--accent-color', settings.accentColor);
  }, [settings.theme, settings.accentColor]);

  // Save settings
  const handleSaveSettings = () => {
    setIsSaving(true);
    localStorage.setItem('app-settings', JSON.stringify(settings));
    
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings saved successfully!');
    }, 500);
  };

  // Update profile
  const handleUpdateProfile = async () => {
    try {
      setIsSaving(true);
      
      // In production, you'd make an API call here
      // await fetch(`/api/users/${profile.id}`, { method: 'PUT', body: JSON.stringify(profile) })
      
      toast.success('Profile updated successfully!');
      setIsSaving(false);
    } catch (error) {
      toast.error('Failed to update profile');
      setIsSaving(false);
    }
  };

  // Export data
  const handleExportData = async () => {
    try {
      toast.info('Exporting your data...');
      
      // Fetch all tasks
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/?user_id=${session?.user?.id}`,
        { credentials: 'include' }
      );

      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tasks-export-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success('Data exported successfully!');
      }
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    try {
      toast.error('Account deletion not implemented yet');
      setShowDeleteConfirm(false);
      
      // In production:
      // await fetch(`/api/users/${profile.id}`, { method: 'DELETE' })
      // authClient.signOut()
      // router.push('/')
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-400">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <div className="text-gray-400 mt-1">Total Tasks</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
            <div className="text-gray-400 mt-1">Pending</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="text-3xl font-bold text-green-400">{stats.completed}</div>
            <div className="text-gray-400 mt-1">Completed</div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <Button 
                onClick={handleUpdateProfile}
                disabled={isSaving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Update Profile'}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Theme Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-5 w-5 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Appearance</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Theme Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSettings({ ...settings, theme: 'light' })}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border ${
                      settings.theme === 'light' 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <Sun className="h-5 w-5" />
                    <span className="text-xs">Light</span>
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, theme: 'dark' })}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border ${
                      settings.theme === 'dark' 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <Moon className="h-5 w-5" />
                    <span className="text-xs">Dark</span>
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, theme: 'system' })}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border ${
                      settings.theme === 'system' 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <Monitor className="h-5 w-5" />
                    <span className="text-xs">System</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Accent Color</label>
                <select 
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={settings.accentColor}
                  onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                >
                  <option value="blue">Blue</option>
                  <option value="cyan">Cyan</option>
                  <option value="purple">Purple</option>
                  <option value="emerald">Emerald</option>
                  <option value="rose">Rose</option>
                </select>
              </div>

              <Button 
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Theme'}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-yellow-400" />
              <h2 className="text-xl font-semibold text-white">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">Push Notifications</div>
                  <div className="text-xs text-gray-400">Receive task reminders</div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notifications ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">Email Notifications</div>
                  <div className="text-xs text-gray-400">Daily task summary</div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">Sound Effects</div>
                  <div className="text-xs text-gray-400">Play sounds on actions</div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.soundEnabled ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <Button 
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Data & Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-green-400" />
              <h2 className="text-xl font-semibold text-white">Data & Privacy</h2>
            </div>
            <div className="space-y-3">
              <Button 
                onClick={handleExportData}
                variant="outline"
                className="w-full border-gray-700 hover:bg-white/5 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Export My Data
              </Button>

              <Button 
                onClick={() => {
                  localStorage.clear();
                  toast.success('Cache cleared successfully!');
                }}
                variant="outline"
                className="w-full border-gray-700 hover:bg-white/5 text-white"
              >
                Clear Cache
              </Button>

              <div className="pt-4 border-t border-gray-700">
                <h3 className="text-sm font-medium text-red-400 mb-2">Danger Zone</h3>
                <Button 
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="outline"
                  className="w-full border-red-600 hover:bg-red-600/10 text-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a1a1a] border border-red-600 rounded-xl p-6 max-w-md mx-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h3 className="text-xl font-bold text-white">Delete Account?</h3>
            </div>
            <p className="text-gray-400 mb-6">
              This action cannot be undone. All your tasks and data will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                className="flex-1 border-gray-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Delete Forever
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}