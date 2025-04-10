
import React from 'react';
import { Button } from '@/components/ui/button';
import UserProfile from '../UserProfile';
import { UserProfile as UserProfileType } from '../../contexts/UserContext';
import { showTelegramAlert } from '../../utils/telegramWebApp';

interface ViewProfileScreenProps {
  userId: string;
  user: UserProfileType | null;
  onBack: () => void;
}

const ViewProfileScreen: React.FC<ViewProfileScreenProps> = ({ userId, user, onBack }) => {
  const handleMessageUser = (userId: string) => {
    showTelegramAlert(`Se abriría chat con usuario ${userId}`);
    
    if (user?.username) {
      window.open(`https://t.me/${user.username}`, '_blank');
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onBack} 
        className="mb-2"
      >
        ← Volver al mapa
      </Button>
      
      {user && (
        <>
          <UserProfile 
            profile={user} 
            editable={false} 
          />
          <Button 
            onClick={() => handleMessageUser(userId)}
            className="w-full bg-telegram hover:bg-telegram-dark"
          >
            Mensaje en Telegram
          </Button>
        </>
      )}
    </div>
  );
};

export default ViewProfileScreen;
