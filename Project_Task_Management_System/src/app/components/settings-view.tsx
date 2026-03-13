import { motion } from 'motion/react';
import { User, Bell, Shield, Palette, Globe, Key } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { useAuthStore, useAppStore } from '../../store';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function SettingsView() {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useAppStore();

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </h2>
          
          <div className="flex items-center gap-6 mb-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-2xl">{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline">Change Avatar</Button>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                JPG, GIF or PNG. Max size of 2MB.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user?.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input id="bio" placeholder="Tell us about yourself" />
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              Save Changes
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Appearance
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Toggle between light and dark theme
                </p>
              </div>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Receive email updates about your projects
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Task Assignments</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Get notified when you're assigned a task
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Comments & Mentions</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Get notified when someone mentions you
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Project Updates</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Get notified about project milestones
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security
          </h2>
          
          <div className="space-y-4">
            <div>
              <Button variant="outline">Change Password</Button>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-2">Two-Factor Authentication</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Add an extra layer of security to your account
              </p>
              <Button variant="outline">Enable 2FA</Button>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-2">Active Sessions</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Manage your active sessions across devices
              </p>
              <Button variant="outline">View Sessions</Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 backdrop-blur-xl bg-red-50/80 dark:bg-red-950/20 border-red-200 dark:border-red-900">
          <h2 className="text-xl font-semibold mb-4 text-red-700 dark:text-red-400">
            Danger Zone
          </h2>
          <p className="text-sm text-red-600 dark:text-red-400 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="destructive">Delete Account</Button>
        </Card>
      </motion.div>
    </div>
  );
}
