import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Project, Task, Notification, Activity, TeamMember, UserRole } from '../types';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query,
  getDoc
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

// Counter for unique IDs with random component
let idCounter = 0;
const generateUniqueId = () => `${Date.now()}-${++idCounter}-${Math.random().toString(36).substr(2, 9)}`;

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

interface AppState {
  projects: Project[];
  tasks: Task[];
  notifications: Notification[];
  activities: Activity[];
  teamMembers: TeamMember[];
  theme: 'light' | 'dark';
  
  // Projects
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Tasks
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: Task['status']) => void;
  
  // Team Members
  addTeamMember: (member: Omit<TeamMember, 'id' | 'status' | 'joinedAt'>) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  removeTeamMember: (id: string) => void;
  
  // Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // Theme
  toggleTheme: () => void;
}

// Mock users for demo
const mockUsers: Record<string, { password: string; user: User }> = {
  'admin@taskflow.com': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@taskflow.com',
      name: 'Rajesh Kumar',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
      role: 'admin',
      createdAt: new Date().toISOString(),
    }
  },
  'manager@taskflow.com': {
    password: 'manager123',
    user: {
      id: '2',
      email: 'manager@taskflow.com',
      name: 'Priya Sharma',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
      role: 'manager',
      createdAt: new Date().toISOString(),
    }
  },
  'member@taskflow.com': {
    password: 'member123',
    user: {
      id: '3',
      email: 'member@taskflow.com',
      name: 'Amit Patel',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
      role: 'member',
      createdAt: new Date().toISOString(),
    }
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          
          // Fetch additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            set({ user: userData, isAuthenticated: true });
            return true;
          } else {
            // If doc doesn't exist, create a basic one
            const basicUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || email.split('@')[0],
              role: 'member',
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
              createdAt: new Date().toISOString(),
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), basicUser);
            set({ user: basicUser, isAuthenticated: true });
            return true;
          }
        } catch (error: any) {
          console.error("Firebase Login Error:", error.code, error.message);
          return false;
        }
      },
      
      signup: async (email: string, password: string, name: string, role: UserRole = 'member') => {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          
          const newUser: User = {
            id: firebaseUser.uid,
            email,
            name,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
            role: role,
            createdAt: new Date().toISOString(),
          };
          
          // Store user profile in Firestore
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          
          set({ user: newUser, isAuthenticated: true });
          return true;
        } catch (error: any) {
          console.error("Firebase Signup Error:", error.code, error.message);
          return false;
        }
      },
      
      logout: async () => {
        try {
          await signOut(auth);
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error("Firebase Logout Error:", error);
        }
      },
      
      updateUser: async (updates: Partial<User>) => {
        set((state) => {
          if (!state.user) return state;
          const updatedUser = { ...state.user, ...updates };
          
          // Sync with Firestore
          updateDoc(doc(db, 'users', state.user.id), updates).catch(err => 
            console.error("Error updating user in Firestore:", err)
          );
          
          return { user: updatedUser };
        });
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Generate mock data with Indian context
const generateMockProjects = (userId: string): Project[] => [
  {
    id: '1',
    title: 'E-Commerce Platform Redesign',
    description: 'Complete redesign of online shopping platform with modern UI/UX for Indian market',
    clientName: 'Flipkart India',
    budget: 4500000, // ₹45 Lakhs
    startDate: '2026-02-01',
    deadline: '2026-04-30',
    priority: 'high',
    status: 'active',
    members: [userId, '2', '3', '4'],
    createdBy: userId,
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-02-19T00:00:00Z',
  },
  {
    id: '2',
    title: 'Banking Mobile App',
    description: 'Secure mobile banking application with UPI integration',
    clientName: 'HDFC Bank',
    budget: 12000000, // ₹1.2 Crores
    startDate: '2026-01-15',
    deadline: '2026-06-30',
    priority: 'critical',
    status: 'active',
    members: [userId, '2', '3', '5', '6'],
    createdBy: userId,
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-02-19T00:00:00Z',
  },
  {
    id: '3',
    title: 'Digital Marketing Campaign',
    description: 'Q2 social media and digital marketing campaign for Indian festivals',
    clientName: 'Myntra Fashion',
    budget: 3500000, // ₹35 Lakhs
    startDate: '2026-03-01',
    deadline: '2026-05-31',
    priority: 'medium',
    status: 'planning',
    members: [userId, '2', '7'],
    createdBy: userId,
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-02-19T00:00:00Z',
  },
  {
    id: '4',
    title: 'ERP System Implementation',
    description: 'Enterprise resource planning system for manufacturing unit',
    clientName: 'Tata Industries',
    budget: 8500000, // ₹85 Lakhs
    startDate: '2026-02-15',
    deadline: '2026-08-30',
    priority: 'high',
    status: 'active',
    members: [userId, '2', '4', '5'],
    createdBy: userId,
    createdAt: '2026-02-15T00:00:00Z',
    updatedAt: '2026-02-19T00:00:00Z',
  }
];

const generateMockTasks = (projectId: string, userId: string): Task[] => [
  {
    id: `${projectId}-1`,
    projectId,
    title: 'Design homepage mockups',
    description: 'Create high-fidelity mockups for the new homepage design',
    status: 'completed',
    priority: 'high',
    assignees: [userId],
    tags: ['design', 'ui/ux'],
    subtasks: [
      { id: '1', title: 'Hero section', completed: true },
      { id: '2', title: 'Feature cards', completed: true },
      { id: '3', title: 'Footer', completed: true },
    ],
    dueDate: '2026-02-25',
    estimatedHours: 16,
    timeSpent: 14,
    comments: [],
    attachments: [],
    createdBy: userId,
    createdAt: '2026-02-05T00:00:00Z',
    updatedAt: '2026-02-18T00:00:00Z',
  },
  {
    id: `${projectId}-2`,
    projectId,
    title: 'Implement responsive navigation',
    description: 'Build mobile-friendly navigation with hamburger menu',
    status: 'in-progress',
    priority: 'high',
    assignees: [userId],
    tags: ['frontend', 'react'],
    subtasks: [
      { id: '1', title: 'Desktop nav', completed: true },
      { id: '2', title: 'Mobile menu', completed: false },
      { id: '3', title: 'Animations', completed: false },
    ],
    dueDate: '2026-02-28',
    estimatedHours: 12,
    timeSpent: 8,
    comments: [],
    attachments: [],
    createdBy: userId,
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-02-19T00:00:00Z',
  },
  {
    id: `${projectId}-3`,
    projectId,
    title: 'Setup database schema',
    description: 'Design and implement database structure for user management',
    status: 'review',
    priority: 'critical',
    assignees: [userId],
    tags: ['backend', 'database'],
    subtasks: [],
    dueDate: '2026-02-22',
    estimatedHours: 8,
    timeSpent: 9,
    comments: [],
    attachments: [],
    createdBy: userId,
    createdAt: '2026-02-08T00:00:00Z',
    updatedAt: '2026-02-19T00:00:00Z',
  },
  {
    id: `${projectId}-4`,
    projectId,
    title: 'Write API documentation',
    description: 'Document all API endpoints with examples',
    status: 'todo',
    priority: 'medium',
    assignees: [userId],
    tags: ['documentation'],
    subtasks: [],
    dueDate: '2026-03-05',
    estimatedHours: 6,
    timeSpent: 0,
    comments: [],
    attachments: [],
    createdBy: userId,
    createdAt: '2026-02-12T00:00:00Z',
    updatedAt: '2026-02-19T00:00:00Z',
  },
  {
    id: `${projectId}-5`,
    projectId,
    title: 'Performance optimization',
    description: 'Optimize bundle size and lazy loading',
    status: 'backlog',
    priority: 'low',
    assignees: [],
    tags: ['performance'],
    subtasks: [],
    estimatedHours: 10,
    timeSpent: 0,
    comments: [],
    attachments: [],
    createdBy: userId,
    createdAt: '2026-02-15T00:00:00Z',
    updatedAt: '2026-02-19T00:00:00Z',
  }
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      projects: [],
      tasks: [],
      notifications: [],
      activities: [],
      teamMembers: [],
      theme: 'dark',
      
      // Projects
      addProject: async (project) => {
        const id = generateUniqueId();
        const newProject: Project = {
          ...project,
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        try {
          await setDoc(doc(db, 'projects', id), newProject);
          set((state) => ({ projects: [...state.projects, newProject] }));
        } catch (error) {
          console.error("Error adding project to Firestore: ", error);
          // Fallback to local only if Firestore fails
          set((state) => ({ projects: [...state.projects, newProject] }));
        }
      },
      
      updateProject: async (id, updates) => {
        const updatedAt = new Date().toISOString();
        try {
          await updateDoc(doc(db, 'projects', id), { ...updates, updatedAt });
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === id ? { ...p, ...updates, updatedAt } : p
            ),
          }));
        } catch (error) {
          console.error("Error updating project in Firestore: ", error);
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === id ? { ...p, ...updates, updatedAt } : p
            ),
          }));
        }
      },
      
      deleteProject: async (id) => {
        try {
          await deleteDoc(doc(db, 'projects', id));
          // Note: In a real app, you'd also delete associated tasks in Firestore
          set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
            tasks: state.tasks.filter((t) => t.projectId !== id),
          }));
        } catch (error) {
          console.error("Error deleting project from Firestore: ", error);
          set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
            tasks: state.tasks.filter((t) => t.projectId !== id),
          }));
        }
      },
      
      // Tasks
      addTask: async (task) => {
        const id = `${task.projectId}-${Date.now()}`;
        const newTask: Task = {
          ...task,
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        try {
          await setDoc(doc(db, 'tasks', id), newTask);
          set((state) => ({ tasks: [...state.tasks, newTask] }));
        } catch (error) {
          console.error("Error adding task to Firestore: ", error);
          set((state) => ({ tasks: [...state.tasks, newTask] }));
        }
      },
      
      updateTask: async (id, updates) => {
        const updatedAt = new Date().toISOString();
        try {
          await updateDoc(doc(db, 'tasks', id), { ...updates, updatedAt });
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id ? { ...t, ...updates, updatedAt } : t
            ),
          }));
        } catch (error) {
          console.error("Error updating task in Firestore: ", error);
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id ? { ...t, ...updates, updatedAt } : t
            ),
          }));
        }
      },
      
      deleteTask: async (id) => {
        try {
          await deleteDoc(doc(db, 'tasks', id));
          set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== id),
          }));
        } catch (error) {
          console.error("Error deleting task from Firestore: ", error);
          set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== id),
          }));
        }
      },
      
      moveTask: async (taskId, newStatus) => {
        const updatedAt = new Date().toISOString();
        try {
          await updateDoc(doc(db, 'tasks', taskId), { status: newStatus, updatedAt });
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === taskId ? { ...t, status: newStatus, updatedAt } : t
            ),
          }));
        } catch (error) {
          console.error("Error moving task in Firestore: ", error);
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === taskId ? { ...t, status: newStatus, updatedAt } : t
            ),
          }));
        }
      },
      
      // Team Members
      addTeamMember: (member) => {
        const newMember: TeamMember = {
          ...member,
          id: generateUniqueId(),
          status: 'pending',
          joinedAt: new Date().toISOString(),
        };
        set((state) => ({ teamMembers: [...state.teamMembers, newMember] }));
      },
      
      updateTeamMember: (id, updates) => {
        set((state) => ({
          teamMembers: state.teamMembers.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        }));
      },
      
      removeTeamMember: (id) => {
        set((state) => ({
          teamMembers: state.teamMembers.filter((m) => m.id !== id),
        }));
      },
      
      // Notifications
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: generateUniqueId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }));
      },
      
      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },
      
      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },
      
      // Theme
      toggleTheme: () => {
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }));
      },
    }),
    {
      name: 'app-storage',
    }
  )
);

// Sync with Firestore
export const syncWithFirestore = () => {
  // Sync Projects
  onSnapshot(query(collection(db, 'projects')), (snapshot) => {
    const projects: Project[] = [];
    snapshot.forEach((doc) => projects.push(doc.data() as Project));
    if (projects.length > 0) {
      useAppStore.setState({ projects });
    }
  });

  // Sync Tasks
  onSnapshot(query(collection(db, 'tasks')), (snapshot) => {
    const tasks: Task[] = [];
    snapshot.forEach((doc) => tasks.push(doc.data() as Task));
    if (tasks.length > 0) {
      useAppStore.setState({ tasks });
    }
  });

  // Sync Auth State
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          useAuthStore.setState({ user: userDoc.data() as User, isAuthenticated: true });
        } else {
          // Fallback if doc doesn't exist yet (e.g. during signup race condition)
          const currentUserState = useAuthStore.getState().user;
          if (!currentUserState) {
            const basicUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              role: 'member',
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
              createdAt: new Date().toISOString(),
            };
            useAuthStore.setState({ user: basicUser, isAuthenticated: true });
          }
        }
      } catch (error) {
        console.error("Error fetching user doc in onAuthStateChanged:", error);
      }
    } else {
      useAuthStore.setState({ user: null, isAuthenticated: false });
    }
  });
};

// Initialize mock data
export const initializeMockData = (userId: string) => {
  const store = useAppStore.getState();
  
  // Only initialize if there are no projects
  if (store.projects.length === 0) {
    const projects = generateMockProjects(userId);
    
    // Manually set projects and tasks instead of using addProject/addTask
    // to avoid ID conflicts
    const allTasks: Task[] = [];
    
    projects.forEach(project => {
      const projectTasks = generateMockTasks(project.id, userId);
      allTasks.push(...projectTasks);
    });
    
    // Initialize team members with Indian names
    const initialTeamMembers: TeamMember[] = [
      {
        id: '4',
        email: 'vikram.singh@taskflow.com',
        name: 'Vikram Singh',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
        role: 'manager',
        status: 'active',
        joinedAt: '2025-12-01T00:00:00Z',
      },
      {
        id: '5',
        email: 'sneha.reddy@taskflow.com',
        name: 'Sneha Reddy',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
        role: 'member',
        status: 'active',
        joinedAt: '2025-12-15T00:00:00Z',
      },
      {
        id: '6',
        email: 'arjun.mehta@taskflow.com',
        name: 'Arjun Mehta',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
        role: 'member',
        status: 'active',
        joinedAt: '2026-01-05T00:00:00Z',
      },
      {
        id: '7',
        email: 'pooja.gupta@taskflow.com',
        name: 'Pooja Gupta',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pooja',
        role: 'member',
        status: 'active',
        joinedAt: '2026-01-20T00:00:00Z',
      },
      {
        id: '8',
        email: 'rohit.verma@taskflow.com',
        name: 'Rohit Verma',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit',
        role: 'manager',
        status: 'active',
        joinedAt: '2025-11-10T00:00:00Z',
      },
    ];
    
    // Directly update the store
    useAppStore.setState({
      projects: projects,
      tasks: allTasks,
      teamMembers: initialTeamMembers,
    });
    
    // Add some notifications
    store.addNotification({
      userId,
      type: 'assignment',
      title: 'New task assigned',
      message: 'You have been assigned to "Implement responsive navigation"',
      read: false,
    });
    
    store.addNotification({
      userId,
      type: 'deadline',
      title: 'Upcoming deadline',
      message: 'Task "Setup database schema" is due in 3 days',
      read: false,
    });
  }
};
