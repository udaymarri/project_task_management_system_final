import { motion } from 'motion/react';
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useAppStore, useAuthStore } from '../../store';

export function DashboardOverview() {
  const { projects, tasks } = useAppStore();
  const { user } = useAuthStore();

  const myTasks = tasks.filter(t => t.assignees?.includes(user?.id || ''));
  const completedTasks = myTasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = myTasks.filter(t => t.status === 'in-progress').length;
  const upcomingTasks = myTasks.filter(t => {
    if (!t.dueDate) return false;
    const dueDate = new Date(t.dueDate);
    const today = new Date();
    const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff > 0 && daysDiff <= 7 && t.status !== 'completed';
  });

  const recentTasks = myTasks
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome back{user?.name ? `, ${user.name}` : ''}! 👋</h1>
        <p className="text-blue-100">Here's what's happening with your projects today.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'My Tasks',
            value: myTasks.length,
            icon: CheckCircle2,
            color: 'from-blue-500 to-cyan-500',
            desc: 'Total assigned',
          },
          {
            title: 'Completed',
            value: completedTasks,
            icon: CheckCircle2,
            color: 'from-green-500 to-emerald-500',
            desc: 'This week',
          },
          {
            title: 'In Progress',
            value: inProgressTasks,
            icon: Clock,
            color: 'from-purple-500 to-pink-500',
            desc: 'Active now',
          },
          {
            title: 'Upcoming',
            value: upcomingTasks.length,
            icon: AlertCircle,
            color: 'from-orange-500 to-red-500',
            desc: 'Due this week',
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-slate-900 dark:text-slate-100 font-medium">{stat.title}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{stat.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Tasks */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold mb-4">Recent Tasks</h3>
          <div className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <motion.div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <div className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-green-500' :
                      task.status === 'in-progress' ? 'bg-blue-500' :
                        'bg-slate-400'
                    }`} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{task.title}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {task.status.replace('-', ' ')}
                    </p>
                  </div>
                  <Badge className="capitalize">{task.priority}</Badge>
                </motion.div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-8">No tasks assigned to you yet</p>
            )}
          </div>
        </Card>

        <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold mb-4">Active Projects</h3>
          <div className="space-y-3">
            {projects.filter(p => p.status === 'active').slice(0, 5).map((project) => {
              const projectTasks = tasks.filter(t => t.projectId === project.id);
              const completed = projectTasks.filter(t => t.status === 'completed').length;
              const progress = projectTasks.length > 0 ? (completed / projectTasks.length) * 100 : 0;

              return (
                <div key={project.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{project.title}</h4>
                    <span className="text-sm font-semibold">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
