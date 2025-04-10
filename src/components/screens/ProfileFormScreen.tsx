
import React from 'react';
import { Button } from '@/components/ui/button';
import ProfileExtendedForm from '../ProfileExtendedForm';
import { useUser } from '../../contexts/UserContext';

interface ProfileFormScreenProps {
  onComplete: () => void;
  isNewProfile?: boolean;
}

const ProfileFormScreen: React.FC<ProfileFormScreenProps> = ({ onComplete, isNewProfile = false }) => {
  return (
    <div className="space-y-4">
      {isNewProfile ? (
        <h2 className="text-xl font-semibold text-center">Completa tu perfil</h2>
      ) : (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Editar perfil</h2>
          <Button variant="ghost" size="sm" onClick={onComplete}>
            Cancelar
          </Button>
        </div>
      )}
      <ProfileExtendedForm onComplete={onComplete} />
    </div>
  );
};

export default ProfileFormScreen;
