
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, Users, UserCircle } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { showTelegramAlert } from '../utils/telegramWebApp';
import MapTab from './tabs/MapTab';
import NearbyTab from './tabs/NearbyTab';
import ProfileTab from './tabs/ProfileTab';
import ViewProfileScreen from './screens/ViewProfileScreen';
import ProfileFormScreen from './screens/ProfileFormScreen';

// Mock users data - in a real app, this would come from an API
const MOCK_USERS = [
  {
    id: "user1",
    firstName: "Alex",
    lastName: "Miller",
    username: "alexmiller",
    photoUrl: "https://i.pravatar.cc/150?img=1",
    bio: "Tech enthusiast and coffee addict. Love hiking on weekends.",
    height: 180,
    weight: 75,
    bodyType: "fit",
    sexuality: "bi",
    position: "versatil",
    tribe: "jock"
  },
  {
    id: "user2",
    firstName: "Sophia",
    lastName: "Garcia",
    username: "sophiagarcia",
    photoUrl: "https://i.pravatar.cc/150?img=5",
    bio: "Digital artist and music lover. Looking for concert buddies.",
    height: 165,
    weight: 60,
    bodyType: "promedio",
    sexuality: "hetero",
    position: "activo",
    tribe: "twink"
  },
  {
    id: "user3",
    firstName: "James",
    lastName: "Wong",
    username: "jameswong",
    photoUrl: "https://i.pravatar.cc/150?img=3",
    bio: "Foodie exploring the best restaurants in town. Amateur chef.",
    height: 175,
    weight: 80,
    bodyType: "musculoso",
    sexuality: "homosexual",
    position: "versatil_pas",
    tribe: "wolf"
  },
  {
    id: "user4",
    firstName: "Emma",
    lastName: "Taylor",
    username: "emmataylor",
    photoUrl: "https://i.pravatar.cc/150?img=9",
    bio: "Fitness trainer and yoga instructor. Love outdoor activities.",
    height: 170,
    weight: 65,
    bodyType: "fit",
    sexuality: "bi",
    position: "pasivo",
    tribe: "otter"
  },
];

const MainContent: React.FC = () => {
  const { currentUser, hasCompletedProfile } = useUser();
  const [activeTab, setActiveTab] = useState('map');
  const [isEditingProfile, setIsEditingProfile] = useState(!hasCompletedProfile);
  const [viewedUserId, setViewedUserId] = useState<string | null>(null);

  // Handle profile form completion
  const handleProfileComplete = () => {
    setIsEditingProfile(false);
    showTelegramAlert('Perfil actualizado con éxito!');
  };
  
  // Handle user card click
  const handleViewProfile = (userId: string) => {
    setViewedUserId(userId);
    setActiveTab('profile');
  };
  
  // Handle message user
  const handleMessageUser = (userId: string) => {
    // In a real app, this would open Telegram chat or create a new chat
    showTelegramAlert(`Se abriría chat con usuario ${userId}`);
    
    // Try to open the user's Telegram profile if it's a Telegram username
    const username = MOCK_USERS.find(u => u.id === userId)?.username;
    if (username) {
      window.open(`https://t.me/${username}`, '_blank');
    }
  };
  
  // Reset viewed profile
  const handleBackToList = () => {
    setViewedUserId(null);
    setActiveTab('map');
  };
  
  // Find viewed user in mock data
  const viewedUser = viewedUserId 
    ? MOCK_USERS.find(user => user.id === viewedUserId) 
    : null;

  // Show profile creation form if profile is incomplete
  if (!hasCompletedProfile && isEditingProfile) {
    return <ProfileFormScreen onComplete={handleProfileComplete} isNewProfile={true} />;
  }
  
  // Show profile edit form
  if (isEditingProfile) {
    return <ProfileFormScreen onComplete={handleProfileComplete} />;
  }
  
  // Show viewed user profile
  if (viewedUserId) {
    return <ViewProfileScreen userId={viewedUserId} user={viewedUser} onBack={handleBackToList} />;
  }

  // Show main tabs
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="w-full grid grid-cols-3">
        <TabsTrigger value="map" className="flex items-center gap-1">
          <Map className="h-4 w-4" />
          <span className="hidden sm:inline">Mapa</span>
        </TabsTrigger>
        <TabsTrigger value="nearby" className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Cercanos</span>
        </TabsTrigger>
        <TabsTrigger value="profile" className="flex items-center gap-1">
          <UserCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Perfil</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="map" className="mt-2">
        <MapTab onViewProfile={handleViewProfile} mockUsers={MOCK_USERS} />
      </TabsContent>
      
      <TabsContent value="nearby" className="mt-4 space-y-4">
        <NearbyTab onViewProfile={handleViewProfile} onMessage={handleMessageUser} />
      </TabsContent>
      
      <TabsContent value="profile" className="mt-4">
        <ProfileTab onEditClick={() => setIsEditingProfile(true)} />
      </TabsContent>
    </Tabs>
  );
};

export default MainContent;
