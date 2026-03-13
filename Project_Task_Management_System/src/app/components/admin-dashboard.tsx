import { motion } from 'motion/react';
import { Shield, Users, FolderKanban, CheckCircle2, Clock, TrendingUp, Activity, Settings, Bell } from 'lucide-react';
import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useAppStore, useAuthStore } from '../../store';
import { Progress } from './ui/progress';
import { ProjectDetailsModal } from './project-details-modal';
import { CreateNotificationModal } from './create-notification-modal';

export function AdminDashboard() {
  const { user } = useAuthStore();
  const { projects, tasks, teamMembers } = useAppStore();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalMembers = teamMembers.length + 3; // Including mock users

  const projectsByStatus = {
    planning: projects.filter(p => p.status === 'planning').length,
    active: projects.filter(p => p.status === 'active').length,
    'on-hold': projects.filter(p => p.status === 'on-hold').length,
    completed: projects.filter(p => p.status === 'completed').length,
  };

  const recentProjects = projects.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Admin Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-3 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Complete system overview and management
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowNotificationModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Bell className="w-4 h-4 mr-2" />
          Create Notification
        </Button>
      </motion.div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Projects</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">{totalProjects}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {activeProjects} active
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
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Team Members</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-2">{totalMembers}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  Across all roles
                </p>
              </div>
              <div className="p-3 bg-purple-500 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 border-green-200 dark:border-green-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Tasks Completed</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">{completedTasks}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {Math.round((completedTasks / totalTasks) * 100)}% completion rate
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
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30 border-orange-200 dark:border-orange-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Active Tasks</p>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100 mt-2">
                  {tasks.filter(t => t.status === 'in-progress').length}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  In progress now
                </p>
              </div>
              <div className="p-3 bg-orange-500 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Project Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Project Status Distribution</h2>
          <div className="space-y-4">
            {Object.entries(projectsByStatus).map(([status, count]) => {
              const total = totalProjects;
              const percentage = total > 0 ? (count / total) * 100 : 0;
              const colors = {
                planning: 'bg-slate-500',
                active: 'bg-blue-500',
                'on-hold': 'bg-yellow-500',
                completed: 'bg-green-500',
              };

              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium capitalize">{status}</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Recent Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">All Projects</h2>
            <Badge variant="outline">{totalProjects} Total</Badge>
          </div>
          <div className="space-y-3">
            {recentProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{project.title}</h3>
                    <Badge
                      variant="outline"
                      className={
                        project.status === 'active' ? 'border-blue-500 text-blue-600' :
                        project.status === 'completed' ? 'border-green-500 text-green-600' :
                        project.status === 'on-hold' ? 'border-yellow-500 text-yellow-600' :
                        'border-slate-500 text-slate-600'
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {project.clientName} • {project.members.length} members
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedProject(project)}
                >
                  Manage
                </Button>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* System Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">System Status</p>
              <p className="font-semibold text-green-600">All Systems Operational</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Platform Growth</p>
              <p className="font-semibold text-purple-600">+12% this month</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Avg Response Time</p>
              <p className="font-semibold text-green-600">1.2 hours</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetailsModal 
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Create Notification Modal */}
      <CreateNotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
      />
    </div>
  );
}
