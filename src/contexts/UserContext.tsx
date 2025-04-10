import React, { createContext, useState, useEffect, useContext } from 'react';
import { getTelegramUser, initTelegramWebApp } from '../utils/telegramWebApp';
import { getCurrentLocation, Location, watchUserLocation } from '../utils/locationService';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  bio?: string;
  height?: number;
  weight?: number;
  bodyType?: string;
  sexuality?: string;
  position?: string;
  tribe?: string;
  interests?: string[]; // Added interests property
}

interface UserContextType {
  currentUser: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  userLocation: Location | null;
  setUserProfile: (profile: Partial<UserProfile>) => void;
  hasCompletedProfile: boolean;
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  isLoading: true,
  error: null,
  userLocation: null,
  setUserProfile: () => {},
  hasCompletedProfile: false,
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  
  const hasCompletedProfile = Boolean(
    currentUser && currentUser.bio && currentUser.height && currentUser.weight && currentUser.bodyType && currentUser.sexuality && currentUser.position && currentUser.tribe
  );

  useEffect(() => {
    async function initializeUser() {
      try {
        setIsLoading(true);
        
        initTelegramWebApp();
        
        const telegramUser = getTelegramUser();
        
        if (telegramUser) {
          setCurrentUser({
            id: telegramUser.id.toString(),
            firstName: telegramUser.first_name,
            lastName: telegramUser.last_name,
            username: telegramUser.username,
            photoUrl: telegramUser.photo_url,
          });
        } else {
          setCurrentUser({
            id: 'dev-user-123',
            firstName: 'Development',
            lastName: 'User',
            photoUrl: 'https://via.placeholder.com/100',
          });
        }
        
        try {
          const location = await getCurrentLocation();
          setUserLocation(location);
        } catch (locationErr) {
          console.error('Failed to get initial location:', locationErr);
        }
      } catch (err) {
        setError('Failed to initialize user data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    
    initializeUser();
  }, []);
  
  useEffect(() => {
    if (!currentUser) return;
    
    const stopWatching = watchUserLocation(
      (location) => {
        setUserLocation(location);
      },
      (err) => {
        console.error('Location watch error:', err);
      }
    );
    
    return stopWatching;
  }, [currentUser]);
  
  const setUserProfile = (profileData: Partial<UserProfile>) => {
    if (!currentUser) return;
    
    setCurrentUser({
      ...currentUser,
      ...profileData,
    });
    
    console.log('Profile updated:', { ...currentUser, ...profileData });
  };
  
  return (
    <UserContext.Provider
      value={{
        currentUser,
        isLoading,
        error,
        userLocation,
        setUserProfile,
        hasCompletedProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
