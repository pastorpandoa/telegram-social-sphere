
import React, { useState } from 'react';
import { UserProvider } from '../contexts/UserContext';
import Layout from '../components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserProfile from '../components/UserProfile';
import NearbyUsers from '../components/NearbyUsers';
import ProfileForm from '../components/ProfileForm';
import MapView from '../components/MapView';
import { useUser } from '../contexts/UserContext';
import { showTelegramAlert } from '../utils/telegramWebApp';
import { Button } from '@/components/ui/button';
import { Map, Users, UserCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

const IndexContent = () => {
  const { currentUser, hasCompletedProfile } = useUser();
  const [activeTab, setActiveTab] = useState('nearby');
  const [isEditingProfile, setIsEditingProfile] = useState(!hasCompletedProfile);
  const [viewedUserId, setViewedUserId] = useState<string | null>(null);
  
  // Handle profile form completion
  const handleProfileComplete = () => {
    setIsEditingProfile(false);
    showTelegramAlert('Profile updated successfully!');
  };
  
  // Handle user card click
  const handleViewProfile = (userId: string) => {
    setViewedUserId(userId);
    setActiveTab('profile');
  };
  
  // Handle message user
  const handleMessageUser = (userId: string) => {
    // In a real app, this would open Telegram chat or create a new chat
    showTelegramAlert(`Messaging would open chat with user ${userId}`);
    
    // Try to open the user's Telegram profile if it's a Telegram username
    const username = MOCK_USERS.find(u => u.id === userId)?.username;
    if (username) {
      window.open(`https://t.me/${username}`, '_blank');
    }
  };
  
  // Reset viewed profile
  const handleBackToList = () => {
    setViewedUserId(null);
    setActiveTab('nearby');
  };
  
  // Find viewed user in mock data
  const viewedUser = viewedUserId 
    ? MOCK_USERS.find(user => user.id === viewedUserId) 
    : null;
    
  return (
    <div className="space-y-4">
      {/* Show profile creation form if profile is incomplete */}
      {!hasCompletedProfile && isEditingProfile ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center">Complete Your Profile</h2>
          <ProfileForm onComplete={handleProfileComplete} />
        </div>
      ) : isEditingProfile ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Edit Profile</h2>
            <Button variant="ghost" size="sm" onClick={() => setIsEditingProfile(false)}>
              Cancel
            </Button>
          </div>
          <ProfileForm onComplete={handleProfileComplete} />
        </div>
      ) : viewedUserId ? (
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleBackToList} 
            className="mb-2"
          >
            ← Back to nearby
          </Button>
          
          {viewedUser && (
            <>
              <UserProfile 
                profile={viewedUser} 
                editable={false} 
              />
              <Button 
                onClick={() => handleMessageUser(viewedUserId)}
                className="w-full bg-telegram hover:bg-telegram-dark"
              >
                Message on Telegram
              </Button>
            </>
          )}
        </div>
      ) : (
        <>
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="nearby" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Nearby</span>
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-1">
                <Map className="h-4 w-4" />
                <span className="hidden sm:inline">Map</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-1">
                <UserCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="nearby" className="mt-4 space-y-4">
              <NearbyUsers 
                onViewProfile={handleViewProfile}
                onMessage={handleMessageUser}
              />
            </TabsContent>
            
            <TabsContent value="map" className="mt-4 space-y-4">
              <h2 className="text-lg font-medium mb-2">People Around You</h2>
              <MapView 
                userLocations={
                  MOCK_USERS.slice(0, 5).map((user, index) => ({
                    userId: user.id,
                    name: user.firstName,
                    location: {
                      latitude: 40.7128 + (Math.random() - 0.5) * 0.01,
                      longitude: -74.006 + (Math.random() - 0.5) * 0.01
                    }
                  }))
                }
              />
              <div className="grid grid-cols-2 gap-2 mt-4">
                {MOCK_USERS.slice(0, 4).map(user => (
                  <Card key={user.id} className="p-2 flex items-center gap-2 cursor-pointer"
                    onClick={() => handleViewProfile(user.id)}>
                    <div className="h-8 w-8 rounded-full bg-muted overflow-hidden flex-shrink-0">
                      {user.photoUrl && <img src={user.photoUrl} alt={user.firstName} className="h-full w-full object-cover" />}
                    </div>
                    <div className="truncate">
                      <span className="text-sm font-medium">{user.firstName}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="profile" className="mt-4">
              <UserProfile 
                editable={true}
                onEditClick={() => setIsEditingProfile(true)}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

// Mock users data - in a real app, this would come from an API
const MOCK_USERS = [
  {
    id: "user1",
    firstName: "Alex",
    lastName: "Miller",
    username: "alexmiller",
    photoUrl: "https://i.pravatar.cc/150?img=1",
    bio: "Tech enthusiast and coffee addict. Love hiking on weekends.",
    interests: ["Technology", "Coffee", "Hiking", "Photography"]
  },
  {
    id: "user2",
    firstName: "Sophia",
    lastName: "Garcia",
    username: "sophiagarcia",
    photoUrl: "https://i.pravatar.cc/150?img=5",
    bio: "Digital artist and music lover. Looking for concert buddies.",
    interests: ["Art", "Music", "Concerts", "Design"]
  },
  {
    id: "user3",
    firstName: "James",
    lastName: "Wong",
    username: "jameswong",
    photoUrl: "https://i.pravatar.cc/150?img=3",
    bio: "Foodie exploring the best restaurants in town. Amateur chef.",
    interests: ["Food", "Cooking", "Travel", "Wine"]
  },
  {
    id: "user4",
    firstName: "Emma",
    lastName: "Taylor",
    username: "emmataylor",
    photoUrl: "https://i.pravatar.cc/150?img=9",
    bio: "Fitness trainer and yoga instructor. Love outdoor activities.",
    interests: ["Fitness", "Yoga", "Running", "Nutrition"]
  },
];

const Index = () => {
  return (
    <UserProvider>
      <Layout>
        <IndexContent />
      </Layout>
    </UserProvider>
  );
};

export default Index;
