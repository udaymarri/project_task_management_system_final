import { motion } from 'motion/react';
import { Bell, AlertTriangle, MessageSquare, Megaphone, Send } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAppStore } from '../../store';
import { toast } from 'sonner';
import type { Notification } from '../../types';

interface CreateNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateNotificationModal({ isOpen, onClose }: CreateNotificationModalProps) {
  const [notificationType, setNotificationType] = useState<Notification['type']>('announcement');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState<'all' | 'specific'>('all');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [loading, setLoading] = useState(false);

  const { addNotification, teamMembers } = useAppStore();

  const notificationTypes = [
    { value: 'announcement', label: 'Announcement', icon: Megaphone, color: 'text-blue-600' },
    { value: 'warning', label: 'Warning', icon: AlertTriangle, color: 'text-orange-600' },
    { value: 'complaint', label: 'Complaint/Feedback', icon: MessageSquare, color: 'text-red-600' },
    { value: 'deadline', label: 'Deadline Reminder', icon: Bell, color: 'text-purple-600' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (recipientType === 'specific' && !selectedRecipient) {
      toast.error('Please select a recipient');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Send notification - only one notification per message
    if (recipientType === 'all') {
      addNotification({
        userId: 'all', // Special marker for all users
        type: notificationType,
        title: title,
        message: message,
        read: false,
        createdAt: new Date().toISOString(),
      });
      toast.success(`${notificationTypes.find(t => t.value === notificationType)?.label} sent to all team members`);
    } else {
      addNotification({
        userId: selectedRecipient,
        type: notificationType,
        title: title,
        message: message,
        read: false,
        createdAt: new Date().toISOString(),
      });
      const recipient = teamMembers.find(m => m.id === selectedRecipient);
      toast.success(`${notificationTypes.find(t => t.value === notificationType)?.label} sent to ${recipient?.name}`);
    }

    setLoading(false);
    setTitle('');
    setMessage('');
    setNotificationType('announcement');
    setRecipientType('all');
    setSelectedRecipient('');
    onClose();
  };

  const selectedType = notificationTypes.find(t => t.value === notificationType);
  const TypeIcon = selectedType?.icon || Bell;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Bell className="w-5 h-5 text-white" />
            </div>
            Create Notification
          </DialogTitle>
          <DialogDescription>
            Send announcements, warnings, or feedback to team members
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Notification Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">
              Notification Type
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {notificationTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <motion.button
                    key={type.value}
                    type="button"
                    onClick={() => setNotificationType(type.value as Notification['type'])}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      notificationType === type.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-1 ${type.color}`} />
                    <div className="text-sm font-medium">{type.label}</div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Recipient Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Send To
            </Label>
            <div className="flex gap-2">
              <motion.button
                type="button"
                onClick={() => setRecipientType('all')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 p-2.5 rounded-lg border-2 transition-all ${
                  recipientType === 'all'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="text-sm font-medium">All Team Members</div>
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setRecipientType('specific')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 p-2.5 rounded-lg border-2 transition-all ${
                  recipientType === 'specific'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="text-sm font-medium">Specific Person</div>
              </motion.button>
            </div>
          </div>

          {/* Select Specific Recipient */}
          {recipientType === 'specific' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <Label htmlFor="recipient" className="text-sm font-medium">
                Select Recipient
              </Label>
              <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                <SelectTrigger id="recipient">
                  <SelectValue placeholder="Choose a team member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs">
                          {member.name.charAt(0)}
                        </div>
                        <span>{member.name}</span>
                        <span className="text-xs text-gray-500">({member.role})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter notification title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Enter your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full min-h-[100px] resize-none"
              required
            />
          </div>

          {/* Preview Card */}
          {(title || message) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800"
            >
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Preview</div>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 ${selectedType?.color}`}>
                  <TypeIcon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">{title || 'Title'}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{message || 'Message'}</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={loading}
            >
              {loading ? (
                'Sending...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Notification
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
