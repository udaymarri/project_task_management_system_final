import { motion } from 'motion/react';
import { Briefcase, FolderKanban, Users, TrendingUp, CheckCircle2, Clock, AlertCircle, Calendar, Bell } from 'lucide-react';
import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useAppStore, useAuthStore } from '../../store';
import { Progress } from './ui/progress';
import { CreateNotificationModal } from './create-notification-modal';

export function ManagerDashboard() {
  const { user } = useAuthStore();
  const { projects, tasks, teamMembers } = useAppStore();
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Manager-specific metrics
  const myProjects = projects.filter(p => p.createdBy === user?.id || p.members.includes(user?.id || ''));
  const activeProjects = myProjects.filter(p => p.status === 'active');
  const projectTasks = tasks.filter(t => myProjects.some(p => p.id === t.projectId));
  const completedTasks = projectTasks.filter(t => t.status === 'completed');
  const overdueTasks = projectTasks.filter(t => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate) < new Date() && t.status !== 'completed';
  });

  const teamSize = teamMembers.length + 3;
  const completionRate = projectTasks.length > 0 
    ? Math.round((completedTasks.length / projectTasks.length) * 100)
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Manager Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-3 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Project Manager Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your projects and team performance
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowNotificationModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Bell className="w-4 h-4 mr-2" />
          Send Notification
        </Button>
      </motion.div>

      {/* Manager Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">My Projects</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">{myProjects.length}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {activeProjects.length} active
                </p>
              </div>
              <div className="p-3 bg-blue-500 rounded-lg">
                <FolderKanban className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 border-green-200 dark:border-green-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Completion Rate</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">{completionRate}%</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {completedTasks.length} of {projectTasks.length} tasks
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
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30 border-orange-200 dark:border-orange-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Overdue Tasks</p>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100 mt-2">{overdueTasks.length}</p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  Require attention
                </p>
              </div>
              <div className="p-3 bg-orange-500 rounded-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Team Size</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-2">{teamSize}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  Active members
                </p>
              </div>
              <div className="p-3 bg-purple-500 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Active Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Active Projects</h2>
            <Badge variant="outline">{activeProjects.length} Projects</Badge>
          </div>
          <div className="space-y-4">
            {activeProjects.length === 0 ? (
              <p className="text-center text-slate-600 dark:text-slate-400 py-8">
                No active projects. Create a new project to get started!
              </p>
            ) : (
              activeProjects.map((project, index) => {
                const projectTaskList = tasks.filter(t => t.projectId === project.id);
                const completed = projectTaskList.filter(t => t.status === 'completed').length;
                const progress = projectTaskList.length > 0 
                  ? (completed / projectTaskList.length) * 100 
                  : 0;

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold mb-1">{project.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {project.clientName}
                        </p>
                      </div>
                      <Badge
                        className={
                          project.priority === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                          project.priority === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                          project.priority === 'medium' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }
                      >
                        {project.priority}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Progress</span>
                        <span className="font-medium">{progress.toFixed(0)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{completed}/{projectTaskList.length} tasks</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span>Due {new Date(project.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </Card>
      </motion.div>

      {/* Tasks Requiring Attention */}
      {overdueTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6 border-l-4 border-l-orange-500">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-bold">Tasks Requiring Attention</h2>
            </div>
            <div className="space-y-3">
              {overdueTasks.slice(0, 5).map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Create Notification Modal */}
      <CreateNotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
      />
    </div>
  );
}
