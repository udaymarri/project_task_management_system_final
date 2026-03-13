import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Users,
  Settings,
  Bell,
  Search,
  Plus,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Moon,
  Sun,
  Zap,
  UserPlus,
  User,
  Megaphone,
  AlertTriangle,
  MessageSquare,
  Clock
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useAuthStore, useAppStore } from '../../store';
import { ScrollArea } from './ui/scroll-area';
import { NewProjectModal } from './new-project-modal';
import { InviteMemberModal } from './invite-member-modal';
import { ChangeAvatarModal } from './change-avatar-modal';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

export function DashboardLayout({ children, currentView, onViewChange }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showInviteMemberModal, setShowInviteMemberModal] = useState(false);
  const [showChangeAvatarModal, setShowChangeAvatarModal] = useState(false);

  const { user, logout } = useAuthStore();
  const { notifications, theme, toggleTheme, markAllNotificationsRead } = useAppStore();

  const unreadCount = notifications.filter(n => !n.read).length;

  // Get icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'announcement':
        return { icon: Megaphone, color: 'text-blue-600' };
      case 'warning':
        return { icon: AlertTriangle, color: 'text-orange-600' };
      case 'complaint':
        return { icon: MessageSquare, color: 'text-red-600' };
      case 'deadline':
        return { icon: Clock, color: 'text-purple-600' };
      default:
        return { icon: Bell, color: 'text-blue-600' };
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'projects', icon: FolderKanban, label: 'Projects' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'team', icon: Users, label: 'Team' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Top Navigation */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-40 h-16 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-full px-4 flex items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSidebarCollapsed(!sidebarCollapsed);
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex"
            >
              <Menu />
            </Button>

            <div className="flex items-center gap-2">
              <motion.div
                className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <Zap className="w-5 h-5 text-white" />
              </motion.div>
              <span className="hidden sm:block text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </div>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search projects, tasks, or teammates..."
                className="pl-10 bg-slate-100 dark:bg-slate-800 border-0"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfile(false);
                }}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <h3 className="font-semibold">Notifications</h3>
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={markAllNotificationsRead}
                          className="text-xs"
                        >
                          Mark all read
                        </Button>
                      )}
                    </div>
                    <ScrollArea className="h-96">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                          No notifications
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-200 dark:divide-slate-800">
                          {notifications.slice(0, 10).map((notification, index) => {
                            const { icon: NotificationIcon, color } = getNotificationIcon(notification.type);
                            return (
                              <div
                                key={`${notification.id}-${index}`}
                                className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                                  }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm">{notification.title}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                      {notification.message}
                                    </p>
                                  </div>
                                  <NotificationIcon className={`w-5 h-5 flex-shrink-0 ${color}`} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </ScrollArea>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setShowProfile(!showProfile);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Avatar>
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4 hidden sm:block" />
              </button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-64 backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{user?.email}</p>
                      <Badge className="mt-2 capitalize">{user?.role}</Badge>
                    </div>
                    <div className="p-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          setShowChangeAvatarModal(true);
                          setShowProfile(false);
                        }}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Change Avatar
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          onViewChange('settings');
                          setShowProfile(false);
                        }}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Sidebar - Desktop */}
      <motion.aside
        className="hidden lg:block fixed left-0 top-16 bottom-0 z-30 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-r border-slate-200 dark:border-slate-800"
        animate={{ width: sidebarCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3 }}
      >
        <ScrollArea className="h-full p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === item.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                whileHover={{ x: sidebarCollapsed ? 0 : 4 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </motion.button>
            ))}
          </nav>

          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 space-y-2"
            >
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => setShowNewProjectModal(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                New Project
              </Button>

              {(user?.role === 'admin' || user?.role === 'manager') && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowInviteMemberModal(true)}
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Invite Member
                </Button>
              )}
            </motion.div>
          )}
        </ScrollArea>
      </motion.aside>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 20 }}
              className="lg:hidden fixed left-0 top-16 bottom-0 z-40 w-64 backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 border-r border-slate-200 dark:border-slate-800"
            >
              <ScrollArea className="h-full p-4">
                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onViewChange(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === item.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </ScrollArea>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
      >
        {children}
      </main>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showProfile) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
          }}
        />
      )}

      {/* Modals */}
      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
      />
      <InviteMemberModal
        isOpen={showInviteMemberModal}
        onClose={() => setShowInviteMemberModal(false)}
      />
      <ChangeAvatarModal
        isOpen={showChangeAvatarModal}
        onClose={() => setShowChangeAvatarModal(false)}
      />
    </div>
  );
}
