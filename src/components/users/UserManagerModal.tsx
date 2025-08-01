import React, { useState } from 'react';
import { User } from '@/types/auth';
import { useMultiUserAuth } from '@/hooks/useMultiUserAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Trash2, Check, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserManagerModal = ({ isOpen, onClose }: UserManagerModalProps) => {
  const { users, currentUser, switchUser, deleteUser } = useMultiUserAuth();
  const { t } = useLanguage();
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const handleSwitchUser = (userId: string) => {
    switchUser(userId);
    onClose();
  };

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
    setUserToDelete(null);
    if (users.length <= 1) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {t('users.manageUsers') || 'ניהול משתמשים'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                currentUser?.id === user.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50"
              )}
              onClick={() => handleSwitchUser(user.id)}
            >
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={user.selfieImage} alt={user.name || 'User'} />
                  <AvatarFallback>
                    <UserCircle className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
                {currentUser?.id === user.id && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {user.name || user.phone || user.email || 'משתמש'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString('he-IL')}
                </p>
              </div>

              {users.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserToDelete(user.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Delete Confirmation */}
        {userToDelete && (
          <div className="mt-4 p-3 border border-destructive/20 bg-destructive/5 rounded-lg">
            <p className="text-sm text-center mb-3">
              {t('users.deleteConfirm') || 'האם אתה בטוח שברצונך למחוק משתמש זה?'}
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUserToDelete(null)}
              >
                {t('common.cancel') || 'ביטול'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteUser(userToDelete)}
              >
                {t('common.delete') || 'מחק'}
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={onClose}>
            {t('common.close') || 'סגור'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};