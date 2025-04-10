
import React from 'react';
import NearbyUsers from '../NearbyUsers';

interface NearbyTabProps {
  onViewProfile: (userId: string) => void;
  onMessage: (userId: string) => void;
}

const NearbyTab: React.FC<NearbyTabProps> = ({ onViewProfile, onMessage }) => {
  return (
    <NearbyUsers 
      onViewProfile={onViewProfile}
      onMessage={onMessage}
    />
  );
};

export default NearbyTab;
