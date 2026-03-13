import { motion } from 'motion/react';
import { X, User, Upload, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuthStore } from '../../store';
import { toast } from 'sonner';

interface ChangeAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Generate avatar options
const avatarStyles = [
  'adventurer', 'adventurer-neutral', 'avataaars', 'avataaars-neutral',
  'big-ears', 'big-ears-neutral', 'big-smile', 'bottts', 'bottts-neutral',
  'croodles', 'croodles-neutral', 'fun-emoji', 'icons', 'identicon',
  'initials', 'lorelei', 'lorelei-neutral', 'micah', 'miniavs',
  'notionists', 'notionists-neutral', 'open-peeps', 'personas', 'pixel-art',
  'pixel-art-neutral', 'rings', 'shapes', 'thumbs'
];

export function ChangeAvatarModal({ isOpen, onClose }: ChangeAvatarModalProps) {
  const { user, updateUser } = useAuthStore();
  const [selectedStyle, setSelectedStyle] = useState('');
  const [loading, setLoading] = useState(false);

  const generateAvatarUrl = (style: string) => {
    const seed = user?.name || 'User';
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
  };

  const handleSelectAvatar = async (style: string) => {
    setSelectedStyle(style);
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newAvatarUrl = generateAvatarUrl(style);
    updateUser({ avatar: newAvatarUrl });
    
    toast.success('Avatar updated successfully!');
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            Choose Your Avatar
          </DialogTitle>
          <DialogDescription>
            Select a style that represents you best
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          {/* Current Avatar */}
          <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <p className="text-sm font-medium mb-3">Current Avatar</p>
            <div className="flex items-center gap-3">
              <Avatar className="w-16 h-16 border-2 border-slate-200 dark:border-slate-700">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Avatar Grid */}
          <div className="max-h-[400px] overflow-y-auto pr-2">
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {avatarStyles.map((style) => (
                <motion.button
                  key={style}
                  type="button"
                  onClick={() => handleSelectAvatar(style)}
                  disabled={loading && selectedStyle === style}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <div className={`
                    w-full aspect-square rounded-xl overflow-hidden border-2 transition-all
                    ${selectedStyle === style 
                      ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-blue-400'
                    }
                  `}>
                    <img
                      src={generateAvatarUrl(style)}
                      alt={style}
                      className="w-full h-full object-cover bg-white dark:bg-slate-800"
                    />
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <span className="text-xs text-white font-medium text-center px-2 capitalize">
                      {style.replace(/-/g, ' ')}
                    </span>
                  </div>

                  {/* Loading indicator */}
                  {loading && selectedStyle === style && (
                    <div className="absolute inset-0 bg-blue-500/80 rounded-xl flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Upload Option (placeholder for future implementation) */}
          <div className="mt-6 p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <Upload className="w-5 h-5" />
              <div>
                <p className="text-sm font-medium">Custom Upload</p>
                <p className="text-xs">Upload your own avatar (Coming soon)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
