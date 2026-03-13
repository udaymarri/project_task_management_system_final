import { motion } from 'motion/react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Clock, CheckCircle2, AlertCircle, Users } from 'lucide-react';
import { useAppStore } from '../../store';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

export function AnalyticsView() {
  const { projects, tasks } = useAppStore();

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate) < new Date() && t.status !== 'completed';
  }).length;
  
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Task status distribution
  const statusData = [
    { name: 'Backlog', value: tasks.filter(t => t.status === 'backlog').length },
    { name: 'To Do', value: tasks.filter(t => t.status === 'todo').length },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length },
    { name: 'Review', value: tasks.filter(t => t.status === 'review').length },
    { name: 'Testing', value: tasks.filter(t => t.status === 'testing').length },
    { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length },
  ];

  // Priority distribution
  const priorityData = [
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length },
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length },
    { name: 'Critical', value: tasks.filter(t => t.priority === 'critical').length },
  ];

  // Weekly activity (mock data for demo)
  const weeklyData = [
    { name: 'Mon', tasks: 12, completed: 8 },
    { name: 'Tue', tasks: 15, completed: 10 },
    { name: 'Wed', tasks: 18, completed: 14 },
    { name: 'Thu', tasks: 14, completed: 11 },
    { name: 'Fri', tasks: 20, completed: 16 },
    { name: 'Sat', tasks: 8, completed: 6 },
    { name: 'Sun', tasks: 5, completed: 4 },
  ];

  // Project progress
  const projectProgress = projects.map(project => {
    const projectTasks = tasks.filter(t => t.projectId === project.id);
    const completed = projectTasks.filter(t => t.status === 'completed').length;
    const progress = projectTasks.length > 0 ? (completed / projectTasks.length) * 100 : 0;
    
    return {
      name: project.title.slice(0, 20),
      progress: Math.round(progress),
      tasks: projectTasks.length,
    };
  });

  const stats = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      change: '+12%',
      trending: 'up',
      icon: CheckCircle2,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Completion Rate',
      value: `${Math.round(completionRate)}%`,
      change: '+5%',
      trending: 'up',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      change: '→',
      trending: 'neutral',
      icon: Clock,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Overdue',
      value: overdueTasks,
      change: '-3%',
      trending: 'down',
      icon: AlertCircle,
      color: 'from-red-500 to-orange-500',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Track your team's performance and project insights
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <Badge
                  variant={stat.trending === 'up' ? 'default' : stat.trending === 'down' ? 'destructive' : 'secondary'}
                  className="flex items-center gap-1"
                >
                  {stat.trending === 'up' ? <TrendingUp className="w-3 h-3" /> : 
                   stat.trending === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
                  {stat.change}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{stat.title}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-6">Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="tasks" stroke="#3b82f6" strokeWidth={3} name="Created" />
                <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} name="Completed" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Task Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-6">Task Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Project Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-6">Project Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="progress" fill="#8b5cf6" name="Completion %" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-6">Priority Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="name" type="category" stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" fill="#ec4899" name="Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold mb-6">Team Performance</h3>
          <div className="space-y-4">
            {projects.slice(0, 5).map((project, index) => {
              const projectTasks = tasks.filter(t => t.projectId === project.id);
              const completed = projectTasks.filter(t => t.status === 'completed').length;
              const progress = projectTasks.length > 0 ? (completed / projectTasks.length) * 100 : 0;
              
              return (
                <div key={project.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${COLORS[index % COLORS.length]} flex items-center justify-center text-white font-bold`}>
                          {project.title.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-medium">{project.title}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {completed} / {projectTasks.length} tasks completed
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-lg">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
