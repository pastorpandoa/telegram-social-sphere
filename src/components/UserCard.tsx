
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
    if (dist < 1) return `${Math.round(dist * 1000)} m away`;
    return `${dist.toFixed(1)} km away`;
  };
  
  const getInitials = () => {
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`;
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div 
        className="p-3 flex items-center gap-3 cursor-pointer"
        onClick={() => onViewProfile(user.id)}
      >
        <Avatar className="h-12 w-12 ring-2 ring-background">
          {user.photoUrl ? (
            <AvatarImage src={user.photoUrl} />
          ) : (
            <AvatarFallback className="bg-telegram text-white">
              {getInitials()}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">
            {user.firstName} {user.lastName || ''}
          </h3>
          
          {calculatedDistance !== undefined && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {formatDistance(calculatedDistance)}
            </p>
          )}
        </div>
      </div>
      
      <CardContent className="py-2 flex-1">
        {user.bio && (
          <p className="text-sm line-clamp-2 mb-2">{user.bio}</p>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 pb-3">
        {onMessage && (
          <Button 
            onClick={() => onMessage(user.id)} 
            variant="outline" 
            size="sm" 
            className="w-full flex items-center gap-1.5"
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
