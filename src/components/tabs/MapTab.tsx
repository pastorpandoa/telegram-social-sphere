
import React from 'react';
import MapView from '../MapView';
import { Button } from '@/components/ui/button';
import { UserProfile } from '../../contexts/UserContext';

interface MapTabProps {
  onViewProfile: (userId: string) => void;
  mockUsers: UserProfile[];
}

const MapTab: React.FC<MapTabProps> = ({ onViewProfile, mockUsers }) => {
  return (
    <MapView 
      userLocations={
        mockUsers.map((user) => ({
          userId: user.id,
          name: user.firstName,
          photoUrl: user.photoUrl,
          location: {
            latitude: 40.7128 + (Math.random() - 0.5) * 0.01,
            longitude: -74.006 + (Math.random() - 0.5) * 0.01
          }
        }))
      }
      onUserClick={onViewProfile}
    />
  );
};

export default MapTab;
