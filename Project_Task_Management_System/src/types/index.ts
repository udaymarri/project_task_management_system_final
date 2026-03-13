export type UserRole = 'admin' | 'manager' | 'member';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'testing' | 'completed';
export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed' | 'archived';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  status: 'active' | 'pending' | 'inactive';
  joinedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  clientName?: string;
  budget?: number;
  startDate: string;
  deadline: string;
  priority: Priority;
  status: ProjectStatus;
  members: string[]; // user IDs
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  mentions: string[];
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignees: string[];
  tags: string[];
  subtasks: Subtask[];
  dueDate?: string;
  estimatedHours?: number;
  timeSpent?: number;
  comments: Comment[];
  attachments: Attachment[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  userId: string;
  action: string;
  targetType: 'project' | 'task';
  targetId: string;
  timestamp: string;
  metadata?: any;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'mention' | 'assignment' | 'comment' | 'deadline' | 'status-change' | 'warning' | 'announcement' | 'complaint';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}
