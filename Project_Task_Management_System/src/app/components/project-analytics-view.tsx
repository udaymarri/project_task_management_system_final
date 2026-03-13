import { motion } from 'motion/react';
import { TrendingUp, CheckCircle2, Clock, AlertCircle, Users } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { useAppStore } from '../../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface ProjectAnalyticsViewProps {
  projectId: string;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6b7280'];

export function ProjectAnalyticsView({ projectId }: ProjectAnalyticsViewProps) {
  const { tasks, projects } = useAppStore();
  
  const project = projects.find(p => p.id === projectId);
  const projectTasks = tasks.filter(t => t.projectId === projectId);
  
  const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
  const totalTasks = projectTasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Tasks by Status
  const tasksByStatus = [
    { name: 'Backlog', value: projectTasks.filter(t => t.status === 'backlog').length },
    { name: 'To Do', value: projectTasks.filter(t => t.status === 'todo').length },
    { name: 'In Progress', value: projectTasks.filter(t => t.status === 'in-progress').length },
    { name: 'Review', value: projectTasks.filter(t => t.status === 'review').length },
    { name: 'Testing', value: projectTasks.filter(t => t.status === 'testing').length },
    { name: 'Completed', value: completedTasks },
  ].filter(item => item.value > 0);

  // Tasks by Priority
  const tasksByPriority = [
    { name: 'Critical', value: projectTasks.filter(t => t.priority === 'critical').length, fill: '#ef4444' },
    { name: 'High', value: projectTasks.filter(t => t.priority === 'high').length, fill: '#f59e0b' },
    { name: 'Medium', value: projectTasks.filter(t => t.priority === 'medium').length, fill: '#3b82f6' },
    { name: 'Low', value: projectTasks.filter(t => t.priority === 'low').length, fill: '#6b7280' },
  ].filter(item => item.value > 0);

  // Time estimation vs actual
  const totalEstimated = projectTasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
  const totalSpent = projectTasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0);

  const stats = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: CheckCircle2,
      color: 'from-blue-500 to-cyan-500',
      change: `${completedTasks} completed`,
    },
    {
      title: 'Completion Rate',
      value: `${progress.toFixed(0)}%`,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      change: `${totalTasks - completedTasks} remaining`,
    },
    {
      title: 'Time Tracked',
      value: `${totalSpent}h`,
      icon: Clock,
      color: 'from-purple-500 to-pink-500',
      change: `${totalEstimated}h estimated`,
    },
    {
      title: 'Team Members',
      value: project?.members.length || 0,
      icon: Users,
      color: 'from-orange-500 to-red-500',
      change: 'Active contributors',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.title}</p>
              <p className="text-xs text-slate-500">{stat.change}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks by Status */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Tasks by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tasksByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Tasks by Priority */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Tasks by Priority</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tasksByPriority}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {tasksByPriority.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Overall Progress</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Project Completion</span>
              <span className="text-sm font-bold">{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{totalTasks}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Total Tasks</p>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Completed</p>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{totalTasks - completedTasks}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Remaining</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
