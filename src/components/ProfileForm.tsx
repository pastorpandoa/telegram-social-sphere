
import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { setupMainButton, showTelegramAlert } from '../utils/telegramWebApp';

const ProfileForm: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { currentUser, setUserProfile } = useUser();
  
  const [bio, setBio] = useState(currentUser?.bio || '');
  
  // Configure main button to save profile
  React.useEffect(() => {
    setupMainButton('Save Profile', handleSave);
    
    return () => {
      const tg = window.Telegram?.WebApp;
      if (tg && tg.MainButton.isVisible) {
        tg.MainButton.hide();
      }
    };
  }, [bio]);
  
  // Save the profile
  const handleSave = () => {
    if (!bio.trim()) {
      showTelegramAlert('Please add a short bio about yourself');
      return;
    }
    
    // Update the user profile
    setUserProfile({
      bio: bio.trim()
    });
    
    // Callback to indicate completion
    onComplete();
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="bio">About You</Label>
        <Textarea
          id="bio"
          placeholder="Write a short bio about yourself..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="resize-none"
          rows={4}
          maxLength={200}
        />
        <div className="text-right text-xs text-muted-foreground">
          {bio.length}/200
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
