import { motion } from 'motion/react';
import { Users, Mail, Shield, UserPlus, Edit, Trash2, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useAuthStore, useAppStore } from '../../store';
import { InviteMemberModal } from './invite-member-modal';
import { EditMemberModal } from './edit-member-modal';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function TeamView() {
  const { user } = useAuthStore();
  const { teamMembers, removeTeamMember } = useAppStore();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  // Combine logged-in users with team members
  const allTeamMembers = [
    { 
      id: '1', 
      name: 'Rajesh Kumar', 
      email: 'admin@taskflow.com', 
      role: 'admin', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
      status: 'active',
      joinedAt: '2025-11-01T00:00:00Z'
    },
    { 
      id: '2', 
      name: 'Priya Sharma', 
      email: 'manager@taskflow.com', 
      role: 'manager', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
      status: 'active',
      joinedAt: '2025-11-01T00:00:00Z'
    },
    { 
      id: '3', 
      name: 'Amit Patel', 
      email: 'member@taskflow.com', 
      role: 'member', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
      status: 'active',
      joinedAt: '2025-11-01T00:00:00Z'
    },
    ...teamMembers,
  ];

  const roleColors = {
    admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    manager: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    member: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  };

  const statusColors = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    inactive: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  };

  const handleEdit = (member: any) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  const handleRemove = (memberId: string, memberName: string) => {
    if (memberId === user?.id) {
      toast.error("You cannot remove yourself!");
      return;
    }
    
    if (confirm(`Are you sure you want to remove ${memberName}?`)) {
      removeTeamMember(memberId);
      toast.success(`${memberName} has been removed from the team`);
    }
  };

  const canManageTeam = user?.role === 'admin' || user?.role === 'manager';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Team Members</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your team and their permissions
          </p>
        </div>
        {canManageTeam && (
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={() => setShowInviteModal(true)}
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Invite Member
          </Button>
        )}
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { 
            title: 'Total Members', 
            value: allTeamMembers.length, 
            icon: Users, 
            color: 'from-blue-500 to-cyan-500' 
          },
          { 
            title: 'Admins', 
            value: allTeamMembers.filter(m => m.role === 'admin').length, 
            icon: Shield, 
            color: 'from-red-500 to-orange-500' 
          },
          { 
            title: 'Managers', 
            value: allTeamMembers.filter(m => m.role === 'manager').length, 
            icon: Users, 
            color: 'from-purple-500 to-pink-500' 
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-slate-600 dark:text-slate-400">{stat.title}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Team Members List */}
      <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {allTeamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      {member.name}
                      {member.id === user?.id && (
                        <Badge variant="secondary" className="text-xs">You</Badge>
                      )}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {member.email}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      Joined {new Date(member.joinedAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-2">
                    <Badge className={`capitalize ${roleColors[member.role as keyof typeof roleColors]}`}>
                      {member.role}
                    </Badge>
                    <Badge className={`capitalize text-xs ${statusColors[member.status as keyof typeof statusColors]}`}>
                      {member.status}
                    </Badge>
                  </div>
                  
                  {canManageTeam && member.id !== user?.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus-visible:ring-slate-300 h-10 w-10">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(member)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleRemove(member.id, member.name)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Modals */}
      <InviteMemberModal 
        isOpen={showInviteModal} 
        onClose={() => setShowInviteModal(false)} 
      />
      {selectedMember && (
        <EditMemberModal 
          isOpen={showEditModal} 
          onClose={() => {
            setShowEditModal(false);
            setSelectedMember(null);
          }}
          member={selectedMember}
        />
      )}
    </div>
  );
}
