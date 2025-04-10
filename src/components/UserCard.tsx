
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserProfile } from '../contexts/UserContext';
import { MapPin, MessageCircle } from 'lucide-react';
import { calculateDistance } from '../utils/locationService';

interface UserCardProps {
  user: UserProfile;
  distance?: number;
  onViewProfile: (userId: string) => void;
  onMessage?: (userId: string) => void;
  currentUserLocation?: { latitude: number; longitude: number };
  userLocation?: { latitude: number; longitude: number };
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  distance,
  onViewProfile,
  onMessage,
  currentUserLocation,
  userLocation
}) => {
  const calculatedDistance = distance || (
    currentUserLocation && userLocation ? 
    calculateDistance(
      currentUserLocation.latitude,
      currentUserLocation.longitude,
      userLocation.latitude,
      userLocation.longitude
    ) : undefined
  );
  
  const formatDistance = (dist?: number): string => {
    if (dist === undefined) return 'Unknown distance';
    if (dist < 1) return `${Math.round(dist * 1000)} m`;
    return `${dist.toFixed(1)} km`;
  };
  
  const getInitials = () => {
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`;
  };

  const getBodyTypeLabel = (value?: string) => {
    if (!value) return '';
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

  return (
    <Card className="overflow-hidden h-full flex flex-col bg-black/80 border-gray-800 hover:border-primary/50 transition-colors text-white">
      <div 
        className="p-3 flex items-center gap-3 cursor-pointer"
        onClick={() => onViewProfile(user.id)}
      >
        <Avatar className="h-14 w-14 ring-1 ring-primary/20">
          {user.photoUrl ? (
            <AvatarImage src={user.photoUrl} />
          ) : (
            <AvatarFallback className="bg-primary/20 text-primary">
              {getInitials()}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-medium truncate text-white">
              {user.firstName} {user.lastName || ''}
            </h3>
            
            {calculatedDistance !== undefined && (
              <Badge variant="outline" className="ml-1 text-xs bg-transparent border-gray-700">
                {formatDistance(calculatedDistance)}
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1 mt-1">
            {user.height && (
              <Badge variant="secondary" className="text-xs bg-black/70 text-gray-300">
                {user.height} cm
              </Badge>
            )}
            
            {user.bodyType && (
              <Badge variant="secondary" className="text-xs bg-black/70 text-gray-300">
                {getBodyTypeLabel(user.bodyType)}
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <CardContent className="py-2 flex-1">
        {user.bio && (
          <p className="text-sm line-clamp-2 text-gray-300">{user.bio}</p>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 pb-3">
        {onMessage && (
          <Button 
            onClick={() => onMessage(user.id)} 
            variant="secondary" 
            size="sm" 
            className="w-full flex items-center gap-1.5 bg-primary/20 hover:bg-primary/30 text-white"
          >
            <MessageCircle className="h-4 w-4" />
            Message
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default UserCard;
