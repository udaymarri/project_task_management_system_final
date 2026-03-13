import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, User, Tag, Clock, MessageSquare, Paperclip, CheckSquare, MoreVertical, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useState } from 'react';
import type { Task } from '../../types';
import { useAppStore } from '../../store';

interface TaskModalProps {
  task: Task;
  onClose: () => void;
}

const priorityColors = {
  low: 'bg-slate-500',
  medium: 'bg-blue-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
};

const statusColors = {
  backlog: 'bg-slate-500',
  todo: 'bg-blue-500',
  'in-progress': 'bg-purple-500',
  review: 'bg-yellow-500',
  testing: 'bg-orange-500',
  completed: 'bg-green-500',
};

export function TaskModal({ task, onClose }: TaskModalProps) {
  const [newComment, setNewComment] = useState('');
  const { updateTask, deleteTask } = useAppStore();

  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const handleSubtaskToggle = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks?.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    updateTask(task.id, { subtasks: updatedSubtasks });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
      onClose();
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const newCommentObj = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: '1',
      content: newComment,
      mentions: [],
      createdAt: new Date().toISOString(),
    };
    
    updateTask(task.id, {
      comments: [...(task.comments || []), newCommentObj]
    });
    
    setNewComment('');
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-white/95 dark:bg-slate-900/95">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{task.title}</DialogTitle>
              <DialogDescription className="sr-only">
                View and manage task details, comments, and subtasks
              </DialogDescription>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={`capitalize ${priorityColors[task.priority]} text-white`}>
                  {task.priority}
                </Badge>
                <Badge className={`capitalize ${statusColors[task.status]} text-white`}>
                  {task.status.replace('-', ' ')}
                </Badge>
                {task.tags?.map(tag => (
                  <Badge key={tag} variant="secondary">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {task.description || 'No description provided.'}
                  </p>
                </div>

                {/* Subtasks */}
                {totalSubtasks > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <CheckSquare className="w-5 h-5" />
                        Subtasks
                      </h3>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {completedSubtasks} / {totalSubtasks}
                      </span>
                    </div>
                    <Progress value={progress} className="mb-4" />
                    <div className="space-y-3">
                      {task.subtasks?.map(subtask => (
                        <motion.div
                          key={subtask.id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                          whileHover={{ x: 4 }}
                        >
                          <Checkbox
                            checked={subtask.completed}
                            onCheckedChange={() => handleSubtaskToggle(subtask.id)}
                          />
                          <span className={subtask.completed ? 'line-through text-slate-500' : ''}>
                            {subtask.title}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Comments */}
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Comments ({task.comments?.length || 0})
                  </h3>
                  
                  <div className="space-y-4 mb-4">
                    {task.comments?.map(comment => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.userId}`} />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">User {comment.userId}</span>
                            <span className="text-xs text-slate-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-300">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  <Button onClick={handleAddComment} className="mt-2">
                    Post Comment
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="activity">
                <div className="space-y-4">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex gap-3 mb-4">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                      <div>
                        <p>Task created</p>
                        <p className="text-xs text-slate-500">{new Date(task.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                      <div>
                        <p>Last updated</p>
                        <p className="text-xs text-slate-500">{new Date(task.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="files">
                <div className="text-center py-8 text-slate-500">
                  {task.attachments && task.attachments.length > 0 ? (
                    <div className="space-y-2">
                      {task.attachments.map(att => (
                        <div key={att.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <Paperclip className="w-4 h-4" />
                          <span>{att.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <Paperclip className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                      <p>No files attached</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assignees */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Assignees
              </h3>
              <div className="space-y-2">
                {task.assignees && task.assignees.length > 0 ? (
                  task.assignees.map((assigneeId, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${assigneeId}`} />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">User {assigneeId}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No assignees</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Due Date */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Due Date
              </h3>
              {task.dueDate ? (
                <div className="text-sm">
                  {new Date(task.dueDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No due date</p>
              )}
            </div>

            <Separator />

            {/* Time Tracking */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Time Tracking
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Estimated</span>
                  <span className="font-medium">{task.estimatedHours || 0}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Time Spent</span>
                  <span className="font-medium">{task.timeSpent || 0}h</span>
                </div>
                {task.estimatedHours && (
                  <Progress
                    value={((task.timeSpent || 0) / task.estimatedHours) * 100}
                    className="mt-2"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
