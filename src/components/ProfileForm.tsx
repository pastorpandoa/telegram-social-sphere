
import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { setupMainButton, showTelegramAlert } from '../utils/telegramWebApp';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const COMMON_INTERESTS = [
  "Music", "Travel", "Food", "Movies", "Sports", 
  "Technology", "Art", "Photography", "Reading", "Gaming",
  "Fitness", "Nature", "Fashion", "Dance", "Hiking",
  "Cooking", "Pets", "Cars", "Cycling", "Yoga"
];

const ProfileForm: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { currentUser, setUserProfile } = useUser();
  
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [interests, setInterests] = useState<string[]>(currentUser?.interests || []);
  const [newInterest, setNewInterest] = useState('');
  
  // Configure main button to save profile
  React.useEffect(() => {
    setupMainButton('Save Profile', handleSave);
    
    return () => {
      const tg = window.Telegram?.WebApp;
      if (tg && tg.MainButton.isVisible) {
        tg.MainButton.hide();
      }
    };
  }, [bio, interests]);
  
  // Add a new interest
  const handleAddInterest = () => {
    if (!newInterest.trim()) return;
    
    if (interests.includes(newInterest.trim())) {
      showTelegramAlert('This interest is already added');
      return;
    }
    
    if (interests.length >= 10) {
      showTelegramAlert('You can add up to 10 interests');
      return;
    }
    
    setInterests([...interests, newInterest.trim()]);
    setNewInterest('');
  };
  
  // Remove an interest
  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter(item => item !== interest));
  };
  
  // Add a suggested interest
  const handleAddSuggestedInterest = (interest: string) => {
    if (interests.includes(interest)) {
      showTelegramAlert('This interest is already added');
      return;
    }
    
    if (interests.length >= 10) {
      showTelegramAlert('You can add up to 10 interests');
      return;
    }
    
    setInterests([...interests, interest]);
  };
  
  // Save the profile
  const handleSave = () => {
    if (!bio.trim()) {
      showTelegramAlert('Please add a short bio about yourself');
      return;
    }
    
    if (interests.length === 0) {
      showTelegramAlert('Please add at least one interest');
      return;
    }
    
    // Update the user profile
    setUserProfile({
      bio: bio.trim(),
      interests: interests
    });
    
    // Callback to indicate completion
    onComplete();
  };
  
  // Display suggested interests that aren't already selected
  const filteredSuggestions = COMMON_INTERESTS.filter(
    interest => !interests.includes(interest)
  );
  
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
      
      <div className="space-y-2">
        <Label htmlFor="interests">Your Interests</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="interests"
            placeholder="Add an interest..."
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddInterest();
              }
            }}
          />
          <Button 
            type="button" 
            onClick={handleAddInterest}
            disabled={!newInterest.trim() || interests.length >= 10}
          >
            Add
          </Button>
        </div>
        
        {/* Current interests */}
        {interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {interests.map((interest, index) => (
              <Badge key={index} className="flex items-center gap-1 pr-1.5">
                {interest}
                <button 
                  type="button" 
                  onClick={() => handleRemoveInterest(interest)} 
                  className="hover:bg-background/20 rounded-full ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      {/* Suggested interests */}
      {filteredSuggestions.length > 0 && interests.length < 10 && (
        <div className="space-y-2">
          <Label className="text-sm">Suggested Interests</Label>
          <Card className="border border-border">
            <CardContent className="p-2">
              <div className="flex flex-wrap gap-1.5">
                {filteredSuggestions.slice(0, 10).map((interest, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary"
                    onClick={() => handleAddSuggestedInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
