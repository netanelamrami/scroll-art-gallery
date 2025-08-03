import React, { useState } from 'react';
import { useMultiUserAuth } from '@/contexts/AuthContext';
import { AddUserModal } from '@/components/users/AddUserModal';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Plus, UserCircle, LogOut, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const UserSwitcher = () => {
  const { users, currentUser, isAuthenticated, switchUser, logout } = useMultiUserAuth();
  const [showAddUser, setShowAddUser] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  console.log('UserSwitcher render:', {
    isAuthenticated,
    currentUser: currentUser ? { id: currentUser.id, name: currentUser.name } : null,
    usersCount: users.length
  });

  if (!isAuthenticated || !currentUser) {
    console.log('UserSwitcher: Not showing because isAuthenticated=', isAuthenticated, 'currentUser=', currentUser);
    return null;
  }

  return (
    <>
      <div className="fixed bottom-6 left-6 z-50">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="h-12 w-12 rounded-full bg-white/90 hover:bg-white shadow-lg border border-gray-200 p-0"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={currentUser.selfieImage} alt={currentUser.name || 'User'} />
                <AvatarFallback>
                  <UserCircle className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </PopoverTrigger>
          
          <PopoverContent 
            side="top" 
            align="start" 
            className="w-64 p-2 mb-2"
            sideOffset={8}
          >
            <div className="space-y-1">
              {/* Current User Header */}
              <div className="px-2 py-2 border-b border-gray-100">
                <p className="text-xs text-muted-foreground">משתמש פעיל</p>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={currentUser.selfieImage} alt={currentUser.name || 'User'} />
                    <AvatarFallback>
                      <UserCircle className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium truncate">
                    {currentUser.name || 'משתמש'}
                  </span>
                </div>
              </div>

              {/* Other Users */}
              {users.filter(u => u.id !== currentUser.id).length > 0 && (
                <div className="py-1">
                  <p className="text-xs text-muted-foreground px-2 py-1">החלף משתמש</p>
                  {users
                    .filter(u => u.id !== currentUser.id)
                    .map((user) => (
                      <Button
                        key={user.id}
                        variant="ghost"
                        className="w-full h-auto p-2 justify-start hover:bg-gray-50"
                        onClick={() => {
                          switchUser(user.id);
                          setIsOpen(false);
                          // Dispatch event to trigger user photos reload
                          window.dispatchEvent(new CustomEvent('switchToMyPhotos'));
                        }}
                      >
                        <Avatar className="w-6 h-6 mr-2">
                          <AvatarImage src={user.selfieImage} alt={user.name || 'User'} />
                          <AvatarFallback>
                            <UserCircle className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm truncate flex-1 text-left">
                          {user.name || 'משתמש'}
                        </span>
                      </Button>
                    ))}
                </div>
              )}

              {/* Add User */}
              <div className="border-t border-gray-100 pt-1">
                <Button
                  variant="ghost"
                  className="w-full h-auto p-2 justify-start hover:bg-gray-50"
                  onClick={() => {
                    setShowAddUser(true);
                    setIsOpen(false);
                  }}
                >
                  <div className="w-6 h-6 mr-2 rounded-full bg-gray-100 flex items-center justify-center">
                    <Plus className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-sm">הוסף משתמש</span>
                </Button>
              </div>

              {/* Logout */}
              <div className="border-t border-gray-100 pt-1">
                <Button
                  variant="ghost"
                  className="w-full h-auto p-2 justify-start hover:bg-red-50 text-red-600 hover:text-red-700"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="text-sm">התנתק</span>
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <AddUserModal 
        isOpen={showAddUser}
        onClose={() => setShowAddUser(false)}
      />
    </>
  );
};
