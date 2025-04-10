
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
  interests?: string[];
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
  
  // Check if user has completed their profile (added bio and interests)
  const hasCompletedProfile = Boolean(
    currentUser && currentUser.bio && currentUser.interests && currentUser.interests.length > 0
  );

  // Initialize the app with Telegram user data
  useEffect(() => {
    async function initializeUser() {
      try {
        setIsLoading(true);
        
        // Initialize Telegram Web App
        initTelegramWebApp();
        
        // Get Telegram user data
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
          // For development without Telegram
          setCurrentUser({
            id: 'dev-user-123',
            firstName: 'Development',
            lastName: 'User',
            photoUrl: 'https://via.placeholder.com/100',
          });
        }
        
        // Get initial location
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
  
  // Watch for location updates
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
  
  // Function to update user profile data
  const setUserProfile = (profileData: Partial<UserProfile>) => {
    if (!currentUser) return;
    
    setCurrentUser({
      ...currentUser,
      ...profileData,
    });
    
    // In a real app, this would be saved to a database
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
