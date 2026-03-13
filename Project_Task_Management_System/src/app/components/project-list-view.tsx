import { motion } from 'motion/react';
import { CheckCircle2, Circle, Clock, AlertCircle, User } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAppStore } from '../../store';
import type { Task } from '../../types';

interface ProjectListViewProps {
  projectId: string;
}

const priorityColors = {
  low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const statusIcons = {
  backlog: Circle,
  todo: Circle,
  'in-progress': Clock,
  review: AlertCircle,
  testing: AlertCircle,
  completed: CheckCircle2,
};

export function ProjectListView({ projectId }: ProjectListViewProps) {
  const { tasks } = useAppStore();
  const projectTasks = tasks.filter(t => t.projectId === projectId);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      case 'review': return 'text-yellow-600';
      case 'testing': return 'text-orange-600';
      default: return 'text-slate-600';
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">All Tasks ({projectTasks.length})</h2>
        <div className="flex gap-2">
          <Badge variant="outline">{projectTasks.filter(t => t.status === 'completed').length} Completed</Badge>
          <Badge variant="outline">{projectTasks.filter(t => t.status === 'in-progress').length} In Progress</Badge>
        </div>
      </div>

      {projectTasks.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-slate-500">No tasks found. Create your first task!</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {projectTasks.map((task, index) => {
            const StatusIcon = statusIcons[task.status];
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <StatusIcon className={`w-5 h-5 mt-0.5 ${getStatusColor(task.status)}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{task.title}</h3>
                          <Badge className={`capitalize ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          {task.dueDate && (
                            <span>Due: {new Date(task.dueDate).toLocaleDateString('en-IN')}</span>
                          )}
                          {task.tags.length > 0 && (
                            <div className="flex gap-1">
                              {task.tags.map((tag, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {task.status.replace('-', ' ')}
                      </Badge>
                      {task.assignees.length > 0 && (
                        <div className="flex -space-x-2">
                          {task.assignees.slice(0, 3).map((assignee, idx) => (
                            <Avatar key={idx} className="w-8 h-8 border-2 border-white dark:border-slate-900">
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${assignee}`} />
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
