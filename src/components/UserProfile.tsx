
import React from 'react';
import { useUser, UserProfile as UserProfileType } from '../contexts/UserContext';
import { setupMainButton } from '../utils/telegramWebApp';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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

  const getBodyTypeLabel = (value: string) => {
    const types: {[key: string]: string} = {
      "delgado": "Delgado",
      "fit": "Fit",
      "musculoso": "Musculoso",
      "promedio": "Promedio",
      "gordioso": "Gordi-oso",
      "grande": "Grande"
    };
    return types[value] || value;
  };

  const getSexualityLabel = (value: string) => {
    const types: {[key: string]: string} = {
      "hetero": "Hetero",
      "bi": "Bi",
      "homosexual": "Homosexual"
    };
    return types[value] || value;
  };

  const getPositionLabel = (value: string) => {
    const types: {[key: string]: string} = {
      "activo": "Activo",
      "versatil_act": "Versátil Activo",
      "versatil": "Versátil", 
      "versatil_pas": "Versátil Pasivo",
      "pasivo": "Pasivo"
    };
    return types[value] || value;
  };

  const getTribeLabel = (value: string) => {
    const types: {[key: string]: string} = {
      "daddy": "Daddy",
      "twink": "Twink",
      "jock": "Jock",
      "bear": "Bear",
      "otter": "Otter",
      "wolf": "Wolf"
    };
    return types[value] || value;
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
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Sobre mí</h3>
            <p className="text-sm">{userProfile.bio}</p>
          </div>
        ) : editable && !hasCompletedProfile ? (
          <div className="mb-4 text-center">
            <p className="text-sm text-muted-foreground italic">
              Añade una biografía para completar tu perfil
            </p>
          </div>
        ) : null}
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {userProfile.height && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground">Estatura</h3>
              <p className="text-sm">{userProfile.height} cm</p>
            </div>
          )}
          
          {userProfile.weight && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground">Peso</h3>
              <p className="text-sm">{userProfile.weight} kg</p>
            </div>
          )}
          
          {userProfile.bodyType && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground">Tipo</h3>
              <p className="text-sm">{getBodyTypeLabel(userProfile.bodyType)}</p>
            </div>
          )}
          
          {userProfile.sexuality && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground">Sexualidad</h3>
              <p className="text-sm">{getSexualityLabel(userProfile.sexuality)}</p>
            </div>
          )}
          
          {userProfile.position && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground">Posición</h3>
              <p className="text-sm">{getPositionLabel(userProfile.position)}</p>
            </div>
          )}
          
          {userProfile.tribe && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground">Tribe</h3>
              <p className="text-sm">{getTribeLabel(userProfile.tribe)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
