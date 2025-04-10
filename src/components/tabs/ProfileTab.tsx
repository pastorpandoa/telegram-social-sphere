
import React from 'react';
import UserProfile from '../UserProfile';

interface ProfileTabProps {
  onEditClick: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ onEditClick }) => {
  return (
    <UserProfile 
      editable={true}
      onEditClick={onEditClick}
    />
  );
};

export default ProfileTab;
