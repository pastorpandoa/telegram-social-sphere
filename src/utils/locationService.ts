
import { showTelegramAlert } from './telegramWebApp';

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export interface UserLocationData {
  userId: string;
  location: Location;
  lastUpdated: number;
}

// In a real app, this would be stored in a database
const MOCK_NEARBY_USERS: UserLocationData[] = [
  {
    userId: 'user1',
    location: { latitude: 40.7128, longitude: -74.006, accuracy: 10 },
    lastUpdated: Date.now() - 60000, // 1 min ago
  },
  {
    userId: 'user2',
    location: { latitude: 40.7138, longitude: -74.008, accuracy: 15 },
    lastUpdated: Date.now() - 180000, // 3 mins ago
  },
  {
    userId: 'user3',
    location: { latitude: 40.7118, longitude: -74.002, accuracy: 8 },
    lastUpdated: Date.now() - 300000, // 5 mins ago
  },
];

// Get current user location
export function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      showTelegramAlert('Geolocation is not supported by your browser');
      reject(new Error('Geolocation not supported'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        resolve(location);
      },
      (error) => {
        let errorMessage: string;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'User denied the request for geolocation';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get user location timed out';
            break;
          default:
            errorMessage = 'An unknown error occurred';
            break;
        }
        showTelegramAlert(errorMessage);
        reject(new Error(errorMessage));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

// Start watching user location updates
export function watchUserLocation(
  onLocationUpdate: (location: Location) => void,
  onError?: (error: GeolocationPositionError) => void
): (() => void) {
  if (!navigator.geolocation) {
    showTelegramAlert('Geolocation is not supported by your browser');
    return () => {};
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const location: Location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      };
      onLocationUpdate(location);
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        showTelegramAlert(`Error getting location: ${error.message}`);
      }
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );

  // Return function to stop watching location
  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
}

// Calculate distance between two points in kilometers
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

// Simulate getting nearby users
export function getNearbyUsers(
  currentLocation: Location,
  radiusKm: number = 10
): UserLocationData[] {
  // In a real app, you would fetch this data from your backend
  return MOCK_NEARBY_USERS.filter(user => {
    const distance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      user.location.latitude,
      user.location.longitude
    );
    return distance <= radiusKm;
  });
}
