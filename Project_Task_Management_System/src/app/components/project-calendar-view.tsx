import { motion } from 'motion/react';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAppStore } from '../../store';

interface ProjectCalendarViewProps {
  projectId: string;
}

export function ProjectCalendarView({ projectId }: ProjectCalendarViewProps) {
  const { tasks } = useAppStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const projectTasks = tasks.filter(t => t.projectId === projectId && t.dueDate);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return projectTasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
      return taskDate === dateStr;
    });
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-6">
      <Card className="p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CalendarIcon className="w-6 h-6" />
            {monthName}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day Headers */}
          {days.map(day => (
            <div key={day} className="text-center font-semibold text-sm text-slate-600 dark:text-slate-400 py-2">
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Calendar Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNumber = i + 1;
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
            const tasksOnDate = getTasksForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <motion.div
                key={dayNumber}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.01 }}
                className={`
                  aspect-square p-2 border rounded-lg cursor-pointer transition-all
                  ${isToday ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' : 'border-slate-200 dark:border-slate-700'}
                  ${tasksOnDate.length > 0 ? 'hover:shadow-md' : ''}
                `}
              >
                <div className="text-sm font-semibold mb-1">{dayNumber}</div>
                {tasksOnDate.length > 0 && (
                  <div className="space-y-1">
                    {tasksOnDate.slice(0, 2).map(task => (
                      <div
                        key={task.id}
                        className="text-xs p-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded truncate"
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    ))}
                    {tasksOnDate.length > 2 && (
                      <div className="text-xs text-slate-500">
                        +{tasksOnDate.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/30 rounded" />
              <span className="text-slate-600 dark:text-slate-400">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/30 rounded" />
              <span className="text-slate-600 dark:text-slate-400">Tasks Due</span>
            </div>
            <Badge variant="outline">{projectTasks.length} tasks with due dates</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
