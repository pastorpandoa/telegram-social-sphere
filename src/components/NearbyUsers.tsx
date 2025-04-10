
import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { getNearbyUsers, Location, UserLocationData } from '../utils/locationService';
import UserCard from './UserCard';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, RefreshCcw, ArrowUpDown, Filter } from 'lucide-react';
import { showTelegramAlert } from '../utils/telegramWebApp';
import { UserProfile } from '../contexts/UserContext';
import { Badge } from '@/components/ui/badge';

// Mock users data - in a real app, this would come from an API
const MOCK_USERS: UserProfile[] = [
  {
    id: "user1",
    firstName: "Alex",
    lastName: "Miller",
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

interface NearbyUsersProps {
  onViewProfile: (userId: string) => void;
  onMessage: (userId: string) => void;
}

const NearbyUsers: React.FC<NearbyUsersProps> = ({ onViewProfile, onMessage }) => {
  const { userLocation, currentUser } = useUser();
  const [nearbyUsers, setNearbyUsers] = useState<Array<UserProfile & { distance?: number }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortType, setSortType] = useState<string>("distance");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // Load nearby users when user location changes
  useEffect(() => {
    if (!userLocation) return;
    
    loadNearbyUsers();
  }, [userLocation]);
  
  // Function to load nearby users
  const loadNearbyUsers = async () => {
    if (!userLocation) {
      setError("Location not available");
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, this would call your backend API
      // For now, we'll use mock data and filter by location
      const locationData = getNearbyUsers(userLocation);
      
      // Map location data to user profiles with distance
      const nearbyUsersWithDistance = MOCK_USERS.map(user => {
        const userLocData = locationData.find(loc => loc.userId === user.id);
        let distance;
        
        if (userLocData) {
          distance = Math.random() * 5; // Random distance for demo
        }
        
        return {
          ...user,
          distance
        };
      });
      
      // Sort by distance by default
      sortUsers(nearbyUsersWithDistance, sortType);
      
    } catch (err) {
      console.error('Failed to load nearby users:', err);
      setError('Failed to load nearby users');
      showTelegramAlert('Failed to load nearby users');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sort users by the selected sort type
  const sortUsers = (users: Array<UserProfile & { distance?: number }>, type: string) => {
    const sorted = [...users];
    
    switch(type) {
      case "distance":
        sorted.sort((a, b) => {
          if (a.distance === undefined) return 1;
          if (b.distance === undefined) return -1;
          return a.distance - b.distance;
        });
        break;
      case "activity":
        // Simulating activity sorting with random order for demo
        sorted.sort(() => Math.random() - 0.5);
        break;
      case "new":
        // Simulating newest users sorting with random order for demo
        sorted.sort(() => Math.random() - 0.5);
        break;
    }
    
    setNearbyUsers(sorted);
  };
  
  // Handle sort change
  const handleSortChange = (type: string) => {
    setSortType(type);
    sortUsers(nearbyUsers, type);
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    loadNearbyUsers();
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="my-8 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }
  
  if (!userLocation) {
    return (
      <div className="my-8 text-center p-4">
        <MapPin className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-muted-foreground mb-4">
          Please enable location services to see people nearby
        </p>
      </div>
    );
  }
  
  if (nearbyUsers.length === 0) {
    return (
      <div className="my-8 text-center p-4">
        <p className="text-muted-foreground mb-4">
          No users found nearby. Try again later.
        </p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">People Nearby</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-1" />
            Filters
          </Button>
          <Button variant="ghost" size="sm" onClick={handleRefresh}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <div className="p-2 bg-black/30 backdrop-blur-md rounded-lg border border-gray-800">
          <div className="text-sm font-medium mb-2">Sort by:</div>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={sortType === "distance" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleSortChange("distance")}
            >
              Distance
            </Badge>
            <Badge 
              variant={sortType === "activity" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleSortChange("activity")}
            >
              Activity
            </Badge>
            <Badge 
              variant={sortType === "new" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleSortChange("new")}
            >
              New
            </Badge>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-4">
        {nearbyUsers.map(user => (
          <UserCard
            key={user.id}
            user={user}
            distance={user.distance}
            onViewProfile={onViewProfile}
            onMessage={onMessage}
          />
        ))}
      </div>
    </div>
  );
};

export default NearbyUsers;
