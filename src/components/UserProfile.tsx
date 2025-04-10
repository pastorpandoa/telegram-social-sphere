
import React from 'react';
import { useUser, UserProfile as UserProfileType } from '../contexts/UserContext';
import { setupMainButton } from '../utils/telegramWebApp';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Pencil } from 'lucide-react';

interface UserProfileProps {
  editable?: boolean;
  onEditClick?: () => void;
  profile?: UserProfileType;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  editable = true, 
  onEditClick,
  profile 
}) => {
  const { currentUser, hasCompletedProfile } = useUser();
  const userProfile = profile || currentUser;
  
  // If this is the current user's profile and they can edit it
  React.useEffect(() => {
    if (editable && onEditClick) {
      setupMainButton('Edit Profile', onEditClick);
    }
    
    return () => {
      const tg = window.Telegram?.WebApp;
      if (tg && tg.MainButton.isVisible) {
        tg.MainButton.hide();
      }
    };
  }, [editable, onEditClick]);
  
  if (!userProfile) {
    return <div className="text-center p-4">User profile not available</div>;
  }
  
  const getInitials = () => {
    return `${userProfile.firstName?.charAt(0) || ''}${userProfile.lastName?.charAt(0) || ''}`;
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="relative pb-0 pt-6">
        <div className="absolute top-2 right-2">
          {editable && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onEditClick}
              className="h-8 w-8 rounded-full"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-2 shadow-md">
            {userProfile.photoUrl ? (
              <AvatarImage src={userProfile.photoUrl} />
            ) : (
              <AvatarFallback className="text-xl bg-telegram text-white">
                {getInitials()}
              </AvatarFallback>
            )}
          </Avatar>
          
          <h2 className="text-xl font-semibold">
            {userProfile.firstName} {userProfile.lastName || ''}
          </h2>
          
          {userProfile.username && (
            <span className="text-muted-foreground text-sm">@{userProfile.username}</span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        {userProfile.bio ? (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">About</h3>
            <p className="text-sm">{userProfile.bio}</p>
          </div>
        ) : editable && !hasCompletedProfile ? (
          <div className="mb-4 text-center">
            <p className="text-sm text-muted-foreground italic">
              Add a bio to complete your profile
            </p>
          </div>
        ) : null}
        
        {userProfile.interests && userProfile.interests.length > 0 ? (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Interests</h3>
            <div className="flex flex-wrap gap-1.5">
              {userProfile.interests.map((interest, index) => (
                <Badge key={index} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        ) : editable && !hasCompletedProfile ? (
          <div className="text-center">
            <p className="text-sm text-muted-foreground italic">
              Add some interests to find like-minded people
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default UserProfile;
