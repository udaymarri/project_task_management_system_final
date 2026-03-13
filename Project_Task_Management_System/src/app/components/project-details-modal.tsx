import { motion } from 'motion/react';
import { X, Calendar, IndianRupee, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { formatIndianCurrency } from '../../utils/currency';
import { useAppStore } from '../../store';
import type { Project } from '../../types';

interface ProjectDetailsModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const priorityColors = {
  low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const statusColors = {
  planning: 'bg-slate-500',
  active: 'bg-blue-500',
  'on-hold': 'bg-yellow-500',
  completed: 'bg-green-500',
  archived: 'bg-slate-400',
};

export function ProjectDetailsModal({ project, isOpen, onClose }: ProjectDetailsModalProps) {
  const { tasks } = useAppStore();

  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
  const progress = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;

  const tasksByStatus = {
    backlog: projectTasks.filter(t => t.status === 'backlog').length,
    todo: projectTasks.filter(t => t.status === 'todo').length,
    'in-progress': projectTasks.filter(t => t.status === 'in-progress').length,
    review: projectTasks.filter(t => t.status === 'review').length,
    testing: projectTasks.filter(t => t.status === 'testing').length,
    completed: completedTasks,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            {project.title}
          </DialogTitle>
          <DialogDescription>
            View detailed information about this project
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Status and Priority */}
          <div className="flex items-center gap-2">
            <Badge className={`capitalize ${priorityColors[project.priority]}`}>
              {project.priority} priority
            </Badge>
            <Badge className={`capitalize ${statusColors[project.status]} text-white`}>
              {project.status}
            </Badge>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-slate-600 dark:text-slate-400">{project.description}</p>
          </div>

          {/* Client */}
          {project.clientName && (
            <div>
              <h3 className="font-semibold mb-2">Client</h3>
              <p className="text-slate-600 dark:text-slate-400">{project.clientName}</p>
            </div>
          )}

          {/* Project Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Start Date</span>
              </div>
              <p className="font-semibold">
                {new Date(project.startDate).toLocaleDateString('en-IN')}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Deadline</span>
              </div>
              <p className="font-semibold">
                {new Date(project.deadline).toLocaleDateString('en-IN')}
              </p>
            </div>

            {project.budget && (
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg col-span-2">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                  <IndianRupee className="w-4 h-4" />
                  <span className="text-sm">Budget</span>
                </div>
                <p className="font-semibold text-2xl text-blue-600 dark:text-blue-400">
                  {formatIndianCurrency(project.budget)}
                </p>
              </div>
            )}
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Overall Progress</h3>
              <span className="text-sm font-medium">{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              {completedTasks} of {projectTasks.length} tasks completed
            </p>
          </div>

          {/* Tasks Breakdown */}
          <div>
            <h3 className="font-semibold mb-3">Tasks Breakdown</h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(tasksByStatus).map(([status, count]) => (
                <div 
                  key={status} 
                  className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-center"
                >
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{count}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 capitalize mt-1">
                    {status.replace('-', ' ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Members */}
          <div>
            <h3 className="font-semibold mb-3">Team Members ({project.members.length})</h3>
            <div className="flex flex-wrap gap-3">
              {project.members.map((memberId, index) => (
                <Avatar key={index} className="w-10 h-10 border-2 border-slate-200 dark:border-slate-700">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${memberId}`} />
                  <AvatarFallback>U{index + 1}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={onClose}
            >
              Go to Project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
