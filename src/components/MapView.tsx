
import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Location } from '../utils/locationService';
import { Card } from '@/components/ui/card';
import { MapPin, Loader2, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MapViewProps {
  userLocations?: Array<{
    userId: string;
    location: Location;
    name: string;
    photoUrl?: string;
  }>;
  onUserClick?: (userId: string) => void;
}

const MapView: React.FC<MapViewProps> = ({ userLocations = [], onUserClick }) => {
  const { userLocation } = useUser();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userMarkers, setUserMarkers] = useState<{ x: number; y: number; user: any }[]>([]);
  
  useEffect(() => {
    if (!canvasRef.current || !userLocation) return;
    
    const drawMap = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      ctx.fillStyle = '#f0f4f8';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw some fake map features
      ctx.strokeStyle = '#d0d8e0';
      ctx.lineWidth = 2;
      
      // Grid lines
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
      
      // Draw center point (current user)
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Pulse effect for current user
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(0, 136, 204, 0.2)';
      ctx.fill();
      
      // Inner point for current user
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#0088cc';
      ctx.fill();
      
      // Draw nearby users
      const markers: { x: number; y: number; user: any }[] = [];
      
      userLocations.forEach((user, index) => {
        // Generate positions around the center (in a real map, this would use actual coordinates)
        const angle = (index / userLocations.length) * Math.PI * 2;
        const distance = 50 + Math.random() * 50;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        // Store marker positions for click detection
        markers.push({ x, y, user });
        
        // Draw user point
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = '#0088cc';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        
        // Draw user name
        ctx.font = '12px Arial';
        ctx.fillStyle = '#333';
        ctx.fillText(user.name, x - 15, y - 12);
      });
      
      setUserMarkers(markers);
    };
    
    // Initial draw
    setIsLoading(false);
    drawMap();
    
    // Redraw on window resize
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = canvasRef.current.clientWidth;
        canvasRef.current.height = canvasRef.current.clientHeight;
        drawMap();
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [userLocation, userLocations]);
  
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !onUserClick) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if click is on a user marker
    for (const marker of userMarkers) {
      const dx = marker.x - x;
      const dy = marker.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= 10) {
        // Click is on this user
        onUserClick(marker.user.userId);
        break;
      }
    }
  };
  
  if (!userLocation) {
    return (
      <Card className="relative w-full h-[75vh] flex items-center justify-center bg-muted/30">
        <div className="text-center p-4">
          <MapPin className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Location data not available
          </p>
        </div>
      </Card>
    );
  }
  
  if (isLoading) {
    return (
      <Card className="relative w-full h-[75vh] flex items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 text-telegram animate-spin" />
      </Card>
    );
  }
  
  return (
    <div className="space-y-2">
      <Card className="relative w-full h-[75vh] overflow-hidden">
        <canvas 
          ref={canvasRef}
          className="w-full h-full cursor-pointer"
          onClick={handleCanvasClick}
        />
        <div className="absolute bottom-2 right-2 bg-background/70 text-xs px-2 py-1 rounded">
          Usuarios cercanos: {userLocations.length}
        </div>
        
        <div className="absolute bottom-4 left-4 flex flex-col space-y-2">
          {userLocations.slice(0, 3).map(user => (
            <div 
              key={user.userId} 
              className="bg-background/80 backdrop-blur-sm rounded-full p-1 flex items-center space-x-2 cursor-pointer hover:bg-background/90 transition-colors"
              onClick={() => onUserClick && onUserClick(user.userId)}
            >
              <Avatar className="h-8 w-8">
                {user.photoUrl ? (
                  <AvatarImage src={user.photoUrl} alt={user.name} />
                ) : (
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="text-sm font-medium pr-2">{user.name}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MapView;
