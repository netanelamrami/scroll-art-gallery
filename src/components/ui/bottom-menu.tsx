import React, { useState } from 'react';
import { useMultiUserAuth } from '@/hooks/useMultiUserAuth';
import { AddUserModal } from '@/components/users/AddUserModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { FAQSupportDialog } from '@/components/gallery/FAQSupportDialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Menu, 
  Share, 
  Images, 
  HelpCircle, 
  UserCircle, 
  Plus, 
  LogOut,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { faqData } from '@/data/faqData';
import { useLanguage } from '@/hooks/useLanguage';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface BottomMenuProps {
  onViewAllPhotos?: () => void;
  onShareEvent?: () => void;
  event?: any;
  onAuthComplete?: (userData: { contact: string; otp: string; selfieData: string; notifications: boolean }) => void;
}

export const BottomMenu = ({ onViewAllPhotos, onShareEvent, event, onAuthComplete }: BottomMenuProps) => {
  const { users, currentUser, isAuthenticated, switchUser, logout, addUser } = useMultiUserAuth();
  const { language } = useLanguage();
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFAQDialog, setShowFAQDialog] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Listen for user updates
  React.useEffect(() => {
    const handleUserAdded = () => {
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('userAdded', handleUserAdded);
    return () => window.removeEventListener('userAdded', handleUserAdded);
  }, []);

  const handleShareEvent = () => {
    onShareEvent?.();
    setIsOpen(false);
  };

  const handleViewAllPhotos = () => {
    onViewAllPhotos?.();
    setIsOpen(false);
  };

  const handleSupport = () => {
    setShowFAQDialog(true);
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-6 left-6 z-50">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="h-14 w-14 rounded-full bg-white/90 hover:bg-white shadow-lg border border-gray-200 p-0"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </Button>
          </PopoverTrigger>
          
          <PopoverContent 
            side="top" 
            align="start" 
            className="w-64 p-2 mb-2"
            sideOffset={8}
          >
            <div className="space-y-1">
              {/* Main Actions */}
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full h-auto p-3 justify-start hover:bg-gray-50"
                  onClick={handleShareEvent}
                >
                  <Share className="w-5 h-5 mr-3" />
                  <span className="text-sm font-medium">
                    {language === 'he' ? 'שתף אירוע' : 'Share Event'}
                  </span>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full h-auto p-3 justify-start hover:bg-gray-50"
                  onClick={handleViewAllPhotos}
                >
                  <Images className="w-5 h-5 mr-3" />
                  <span className="text-sm font-medium">
                    {language === 'he' ? 'כל התמונות' : 'All Photos'}
                  </span>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full h-auto p-3 justify-start hover:bg-gray-50"
                  onClick={handleSupport}
                >
                  <HelpCircle className="w-5 h-5 mr-3" />
                  <span className="text-sm font-medium">
                    {language === 'he' ? 'תמיכה' : 'Support'}
                  </span>
                </Button>
              </div>

              {/* User Management Section */}
              {isAuthenticated && currentUser && (
                <>
                  <div className="border-t border-gray-100 pt-2 mt-2">
                    <p className="text-xs text-muted-foreground px-2 py-1">
                      {language === 'he' ? 'ניהול משתמשים' : 'User Management'}
                    </p>
                    
                    {/* Current User */}
                    <div className="px-2 py-2 bg-gray-50 rounded-md mb-1">
                      <p className="text-xs text-muted-foreground mb-1">
                        {language === 'he' ? 'משתמש פעיל' : 'Active User'}
                      </p>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={currentUser.selfieImage} alt={currentUser.name || 'User'} />
                          <AvatarFallback>
                            <UserCircle className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium truncate">
                          {currentUser.name || (language === 'he' ? 'משתמש' : 'User')}
                        </span>
                      </div>
                    </div>

                    {/* Other Users */}
                    {users.filter(u => u.id !== currentUser.id).length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground px-2">
                          {language === 'he' ? 'החלף משתמש' : 'Switch User'}
                        </p>
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
                              }}
                            >
                              <Avatar className="w-5 h-5 mr-2">
                                <AvatarImage src={user.selfieImage} alt={user.name || 'User'} />
                                <AvatarFallback>
                                  <UserCircle className="w-3 h-3" />
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm truncate flex-1 text-left">
                                {user.name || (language === 'he' ? 'משתמש' : 'User')}
                              </span>
                            </Button>
                          ))}
                      </div>
                    )}

                    {/* Add User */}
                    <Button
                      variant="ghost"
                      className="w-full h-auto p-2 justify-start hover:bg-gray-50 mt-1"
                      onClick={() => {
                        setShowAddUser(true);
                        setIsOpen(false);
                      }}
                    >
                      <div className="w-5 h-5 mr-2 rounded-full bg-gray-100 flex items-center justify-center">
                        <Plus className="w-3 h-3 text-gray-600" />
                      </div>
                      <span className="text-sm">
                        {language === 'he' ? 'הוסף משתמש' : 'Add User'}
                      </span>
                    </Button>

                    {/* Logout */}
                    <Button
                      variant="ghost"
                      className="w-full h-auto p-2 justify-start hover:bg-red-50 text-red-600 hover:text-red-700 mt-1"
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {language === 'he' ? 'התנתק' : 'Logout'}
                      </span>
                    </Button>
                  </div>
                </>
              )}

              {/* Login Option for non-authenticated users */}
              {!isAuthenticated && (
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <Button
                    variant="ghost"
                    className="w-full h-auto p-3 justify-start hover:bg-gray-50"
                    onClick={() => {
                      setShowAuthModal(true);
                      setIsOpen(false);
                    }}
                  >
                    <User className="w-5 h-5 mr-3" />
                    <span className="text-sm font-medium">
                      {language === 'he' ? 'הירשם לאירוע' : 'Register for Event'}
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <AddUserModal 
        isOpen={showAddUser}
        onClose={() => setShowAddUser(false)}
      />
      
      {event && (
        <>
          <AuthModal 
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            event={event}
            onComplete={(authData) => {
              // Add user to multi-user system
              const newUser = addUser({
                name: authData.contact.includes('@') ? authData.contact.split('@')[0] : '',
                phone: authData.contact.includes('@') ? '' : authData.contact,
                email: authData.contact.includes('@') ? authData.contact : '',
                selfieImage: authData.selfieData
              });
              
              console.log('New user added from BottomMenu:', newUser);
              setShowAuthModal(false);
              onAuthComplete?.(authData);
              
              // Force immediate re-render
              setForceUpdate(prev => prev + 1);
              setIsOpen(false);
            }}
          />
          
          <FAQSupportDialog
            isOpen={showFAQDialog}
            setIsOpen={setShowFAQDialog}
            questions={faqData[language] || faqData.he}
            event={event}
          />
        </>
      )}
    </>
  );
};
