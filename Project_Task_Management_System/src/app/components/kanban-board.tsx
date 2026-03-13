import { motion, AnimatePresence } from 'motion/react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import { Plus, MoreVertical, Calendar, User, MessageSquare, Paperclip, CheckCircle2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { useAppStore } from '../../store';
import type { Task, TaskStatus } from '../../types';
import { TaskModal } from './task-modal';

interface KanbanBoardProps {
  projectId: string;
}

const columns: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'backlog', label: 'Backlog', color: 'bg-slate-500' },
  { id: 'todo', label: 'To Do', color: 'bg-blue-500' },
  { id: 'in-progress', label: 'In Progress', color: 'bg-purple-500' },
  { id: 'review', label: 'Review', color: 'bg-yellow-500' },
  { id: 'testing', label: 'Testing', color: 'bg-orange-500' },
  { id: 'completed', label: 'Completed', color: 'bg-green-500' },
];

const priorityColors = {
  low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const { tasks, moveTask } = useAppStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const projectTasks = tasks.filter(t => t.projectId === projectId);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = projectTasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const newStatus = over.id as TaskStatus;
      if (columns.find(col => col.id === newStatus)) {
        moveTask(active.id as string, newStatus);
      }
    }
    
    setActiveTask(null);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return projectTasks.filter(task => task.status === status);
  };

  const getCompletedSubtasks = (task: Task) => {
    if (!task.subtasks || task.subtasks.length === 0) return 0;
    return task.subtasks.filter(st => st.completed).length;
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="h-full overflow-x-auto">
          <div className="flex gap-4 p-6 min-w-max">
            {columns.map((column) => {
              const columnTasks = getTasksByStatus(column.id);
              
              return (
                <motion.div
                  key={column.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-shrink-0 w-80"
                >
                  <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 h-full flex flex-col">
                    {/* Column Header */}
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${column.color}`} />
                          <h3 className="font-semibold">{column.label}</h3>
                          <Badge variant="secondary">{columnTasks.length}</Badge>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Task List */}
                    <SortableContext
                      items={columnTasks.map(t => t.id)}
                      strategy={verticalListSortingStrategy}
                      id={column.id}
                    >
                      <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-300px)]">
                        <AnimatePresence>
                          {columnTasks.map((task) => (
                            <TaskCard
                              key={task.id}
                              task={task}
                              onClick={() => setSelectedTask(task)}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    </SortableContext>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="rotate-3 opacity-80">
              <TaskCard task={activeTask} onClick={() => {}} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  );
}

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

function TaskCard({ task, onClick }: TaskCardProps) {
  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
    >
      <Card className="p-4 cursor-pointer backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1">
            <h4 className="font-medium mb-1 line-clamp-2">{task.title}</h4>
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
                {task.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{task.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
          <Badge className={`capitalize text-xs ${priorityColors[task.priority]}`}>
            {task.priority}
          </Badge>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
            {task.description}
          </p>
        )}

        {/* Progress */}
        {totalSubtasks > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Progress
              </span>
              <span>{completedSubtasks}/{totalSubtasks}</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            )}
            {task.comments && task.comments.length > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{task.comments.length}</span>
              </div>
            )}
            {task.attachments && task.attachments.length > 0 && (
              <div className="flex items-center gap-1">
                <Paperclip className="w-3.5 h-3.5" />
                <span>{task.attachments.length}</span>
              </div>
            )}
          </div>

          {task.assignees && task.assignees.length > 0 && (
            <div className="flex -space-x-2">
              {task.assignees.slice(0, 3).map((assigneeId, index) => (
                <Avatar key={index} className="w-6 h-6 border-2 border-white dark:border-slate-800">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${assigneeId}`} />
                  <AvatarFallback className="text-xs">U</AvatarFallback>
                </Avatar>
              ))}
              {task.assignees.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs font-medium">
                  +{task.assignees.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
