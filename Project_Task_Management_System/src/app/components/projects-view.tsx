import { motion } from 'motion/react';
import { useState } from 'react';
import { Plus, Search, Grid, List, Calendar, BarChart, MoreVertical, Users, IndianRupee, Clock, Edit, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { useAppStore } from '../../store';
import type { Project } from '../../types';
import { KanbanBoard } from './kanban-board';
import { ProjectListView } from './project-list-view';
import { ProjectCalendarView } from './project-calendar-view';
import { ProjectAnalyticsView } from './project-analytics-view';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { formatIndianCurrency } from '../../utils/currency';
import { NewProjectModal } from './new-project-modal';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface ProjectsViewProps {
  onViewChange?: (view: string) => void;
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

export function ProjectsView({ onViewChange }: ProjectsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectView, setProjectView] = useState<'kanban' | 'list' | 'calendar' | 'analytics'>('kanban');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  
  const { projects, tasks, deleteProject } = useAppStore();

  const handleDeleteProject = (projectId: string, projectTitle: string) => {
    if (confirm(`Are you sure you want to delete "${projectTitle}"? This will also delete all associated tasks.`)) {
      deleteProject(projectId);
      toast.success(`Project "${projectTitle}" deleted successfully`);
    }
  };

  const getProjectProgress = (projectId: string) => {
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    if (projectTasks.length === 0) return 0;
    const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
    return (completedTasks / projectTasks.length) * 100;
  };

  const getProjectTaskCount = (projectId: string) => {
    return tasks.filter(t => t.projectId === projectId).length;
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedProject) {
    return (
      <div className="h-screen flex flex-col">
        {/* Project Header */}
        <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <Button
                variant="ghost"
                onClick={() => setSelectedProject(null)}
                className="mb-2 -ml-2"
              >
                ← Back to Projects
              </Button>
              <h1 className="text-3xl font-bold mb-2">{selectedProject.title}</h1>
              <p className="text-slate-600 dark:text-slate-400">{selectedProject.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`capitalize ${priorityColors[selectedProject.priority]}`}>
                {selectedProject.priority} priority
              </Badge>
              <Badge className={`capitalize ${statusColors[selectedProject.status]} text-white`}>
                {selectedProject.status}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600 dark:text-slate-400">
                Due: {new Date(selectedProject.deadline).toLocaleDateString()}
              </span>
            </div>
            {selectedProject.budget && (
              <div className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-slate-500" />
                <span className="text-slate-600 dark:text-slate-400">
                  {formatIndianCurrency(selectedProject.budget)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              <div className="flex -space-x-2">
                {selectedProject.members.slice(0, 5).map((memberId, index) => (
                  <Avatar key={index} className="w-6 h-6 border-2 border-white dark:border-slate-900">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${memberId}`} />
                    <AvatarFallback className="text-xs">U</AvatarFallback>
                  </Avatar>
                ))}
                {selectedProject.members.length > 5 && (
                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs">
                    +{selectedProject.members.length - 5}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 px-6 py-3">
          <div className="flex items-center gap-2">
            {[
              { id: 'kanban', icon: Grid, label: 'Kanban' },
              { id: 'list', icon: List, label: 'List' },
              { id: 'calendar', icon: Calendar, label: 'Calendar' },
              { id: 'analytics', icon: BarChart, label: 'Analytics' },
            ].map((view) => (
              <Button
                key={view.id}
                variant={projectView === view.id ? 'default' : 'ghost'}
                onClick={() => setProjectView(view.id as any)}
                className={projectView === view.id ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
              >
                <view.icon className="w-4 h-4 mr-2" />
                {view.label}
              </Button>
            ))}
          </div>
        </div>

        {/* View Content */}
        <div className="flex-1 overflow-auto">
          {projectView === 'kanban' && <KanbanBoard projectId={selectedProject.id} />}
          {projectView === 'list' && <ProjectListView projectId={selectedProject.id} />}
          {projectView === 'calendar' && <ProjectCalendarView projectId={selectedProject.id} />}
          {projectView === 'analytics' && <ProjectAnalyticsView projectId={selectedProject.id} />}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage and track your projects
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={() => setShowNewProjectModal(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          New Project
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
          >
            <Card
              className="p-6 cursor-pointer backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
              onClick={() => setSelectedProject(project)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1" onClick={() => setSelectedProject(project)}>
                  <h3 className="font-bold text-lg mb-1">{project.title}</h3>
                  {project.clientName && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {project.clientName}
                    </p>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus-visible:ring-slate-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project);
                    }}>
                      <Edit className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id, project.title);
                      }}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                {project.description}
              </p>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-600 dark:text-slate-400">Progress</span>
                  <span className="font-medium">{Math.round(getProjectProgress(project.id))}%</span>
                </div>
                <Progress value={getProjectProgress(project.id)} />
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Badge className={`capitalize ${priorityColors[project.priority]}`}>
                    {project.priority}
                  </Badge>
                  <span className="text-slate-600 dark:text-slate-400">
                    {getProjectTaskCount(project.id)} tasks
                  </span>
                </div>
                <div className="flex -space-x-2">
                  {project.members.slice(0, 3).map((memberId, idx) => (
                    <Avatar key={idx} className="w-7 h-7 border-2 border-white dark:border-slate-800">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${memberId}`} />
                      <AvatarFallback className="text-xs">U</AvatarFallback>
                    </Avatar>
                  ))}
                  {project.members.length > 3 && (
                    <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs font-medium">
                      +{project.members.length - 3}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(project.deadline).toLocaleDateString()}</span>
                </div>
                <Badge className={`capitalize ${statusColors[project.status]} text-white`}>
                  {project.status}
                </Badge>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-500 text-lg">No projects found</p>
          <Button 
            className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600"
            onClick={() => setShowNewProjectModal(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create your first project
          </Button>
        </div>
      )}

      {/* New Project Modal */}
      <NewProjectModal 
        isOpen={showNewProjectModal} 
        onClose={() => setShowNewProjectModal(false)} 
      />
    </div>
  );
}
