import { motion } from 'motion/react';
import { User, CheckCircle2, Clock, AlertCircle, TrendingUp, Calendar, MessageSquare } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useAppStore, useAuthStore } from '../../store';
import { Progress } from './ui/progress';

export function MemberDashboard() {
  const { user } = useAuthStore();
  const { projects, tasks } = useAppStore();

  // Member-specific metrics
  const myTasks = tasks.filter(t => t.assignees?.includes(user?.id || ''));
  const completedTasks = myTasks.filter(t => t.status === 'completed');
  const inProgressTasks = myTasks.filter(t => t.status === 'in-progress');
  const todoTasks = myTasks.filter(t => t.status === 'todo');
  const upcomingTasks = myTasks.filter(t => {
    if (!t.dueDate) return false;
    const dueDate = new Date(t.dueDate);
    const today = new Date();
    const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff > 0 && daysDiff <= 7 && t.status !== 'completed';
  });

  const myProjects = projects.filter(p => p.members.includes(user?.id || ''));
  const completionRate = myTasks.length > 0 
    ? Math.round((completedTasks.length / myTasks.length) * 100)
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Member Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track your tasks and productivity
          </p>
        </div>
      </motion.div>

      {/* Member Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 border-green-200 dark:border-green-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Completed</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">{completedTasks.length}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {completionRate}% completion rate
                </p>
              </div>
              <div className="p-3 bg-green-500 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">In Progress</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-2">{inProgressTasks.length}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  Active tasks
                </p>
              </div>
              <div className="p-3 bg-purple-500 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">To Do</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">{todoTasks.length}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Pending tasks
                </p>
              </div>
              <div className="p-3 bg-blue-500 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30 border-orange-200 dark:border-orange-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Due Soon</p>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100 mt-2">{upcomingTasks.length}</p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  Next 7 days
                </p>
              </div>
              <div className="p-3 bg-orange-500 rounded-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* My Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">My Active Tasks</h2>
            <Badge variant="outline">{myTasks.length} Total</Badge>
          </div>
          <div className="space-y-3">
            {myTasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">
                  No tasks assigned yet. Check back soon!
                </p>
              </div>
            ) : (
              myTasks
                .filter(t => t.status !== 'completed')
                .sort((a, b) => {
                  if (!a.dueDate) return 1;
                  if (!b.dueDate) return -1;
                  return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                })
                .slice(0, 6)
                .map((task, index) => {
                  const project = projects.find(p => p.id === task.projectId);
                  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className={`p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        isOverdue 
                          ? 'border-orange-300 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20' 
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{task.title}</h3>
                            {isOverdue && (
                              <Badge variant="destructive" className="text-xs">
                                Overdue
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            {project?.title}
                          </p>
                        </div>
                        <Badge
                          className={
                            task.priority === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                            task.priority === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                            task.priority === 'medium' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }
                        >
                          {task.priority}
                        </Badge>
                      </div>

                      {task.subtasks.length > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-slate-600 dark:text-slate-400">Subtasks</span>
                            <span className="font-medium">
                              {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
                            </span>
                          </div>
                          <Progress 
                            value={(task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100} 
                            className="h-1.5"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                          {task.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                          )}
                          {task.comments.length > 0 && (
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>{task.comments.length}</span>
                            </div>
                          )}
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            task.status === 'in-progress' ? 'border-purple-500 text-purple-600' :
                            task.status === 'review' ? 'border-yellow-500 text-yellow-600' :
                            task.status === 'testing' ? 'border-orange-500 text-orange-600' :
                            'border-blue-500 text-blue-600'
                          }
                        >
                          {task.status}
                        </Badge>
                      </div>
                    </motion.div>
                  );
                })
            )}
          </div>
        </Card>
      </motion.div>

      {/* My Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">My Projects</h2>
            <Badge variant="outline">{myProjects.length} Projects</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myProjects.map((project, index) => {
              const projectTasks = tasks.filter(t => t.projectId === project.id && t.assignees?.includes(user?.id || ''));
              const completed = projectTasks.filter(t => t.status === 'completed').length;
              const progress = projectTasks.length > 0 ? (completed / projectTasks.length) * 100 : 0;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-semibold mb-2">{project.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {projectTasks.length} tasks assigned to you
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Your progress</span>
                      <span className="font-medium">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
