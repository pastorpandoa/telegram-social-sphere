
import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Location } from '../utils/locationService';
import { Card } from '@/components/ui/card';
import { MapPin, Loader2, User, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);
  
  useEffect(() => {
    if (!canvasRef.current || !userLocation) return;
    
    const drawMap = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background (darker for Grindr-like style)
      ctx.fillStyle = '#121212';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw some map features (gridlines in dark theme)
      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 1;
      
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
      ctx.fillStyle = 'rgba(0, 204, 119, 0.2)';  // Green like Grindr
      ctx.fill();
      
      // Inner point for current user
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#00cc77'; // Grindr green
      ctx.fill();
      
      // Draw nearby users
      const markers: { x: number; y: number; user: any }[] = [];
      
      userLocations.forEach((user, index) => {
        // Generate positions around the center (in a real map, this would use actual coordinates)
        const angle = (index / userLocations.length) * Math.PI * 2;
        const distance = 50 + Math.random() * 80; // Spread users further for better visibility
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        // Store marker positions for click detection
        markers.push({ x, y, user });
        
        // Draw user point
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.fillStyle = user.userId === hoveredUserId ? '#ffcc00' : '#ff4500'; // Highlight on hover
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        
        // Don't draw names on map for cleaner look - more like Grindr/Sniffies
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
  }, [userLocation, userLocations, hoveredUserId]);
  
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
      
      if (distance <= 12) {
        // Click is on this user
        onUserClick(marker.user.userId);
        break;
      }
    }
  };
  
  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if mouse is over a user marker
    let hoveredId: string | null = null;
    for (const marker of userMarkers) {
      const dx = marker.x - x;
      const dy = marker.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= 12) {
        hoveredId = marker.user.userId;
        break;
      }
    }
    
    if (hoveredId !== hoveredUserId) {
      setHoveredUserId(hoveredId);
    }
  };
  
  const handleCanvasMouseLeave = () => {
    setHoveredUserId(null);
  };
  
  if (!userLocation) {
    return (
      <Card className="relative w-full h-[85vh] flex items-center justify-center bg-black/90">
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
      <Card className="relative w-full h-[85vh] flex items-center justify-center bg-black/90">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </Card>
    );
  }
  
  return (
    <div className="space-y-2">
      <Card className="relative w-full h-[85vh] overflow-hidden border-none rounded-xl bg-black/90">
        <canvas 
          ref={canvasRef}
          className="w-full h-full cursor-pointer"
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={handleCanvasMouseLeave}
        />
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-xs px-2 py-1 rounded-full text-white/70">
          {userLocations.length} online nearby
        </div>
        
        <div className="absolute bottom-4 left-4 flex flex-col space-y-2 max-h-[60vh] overflow-y-auto pr-2">
          {userLocations.map(user => (
            <div 
              key={user.userId} 
              className={`bg-black/70 backdrop-blur-sm rounded-xl p-2 flex items-center space-x-2 cursor-pointer hover:bg-black/90 transition-colors border border-gray-800 ${
                hoveredUserId === user.userId ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onUserClick && onUserClick(user.userId)}
              onMouseEnter={() => setHoveredUserId(user.userId)}
              onMouseLeave={() => setHoveredUserId(null)}
            >
              <Avatar className="h-10 w-10 border border-gray-800">
                {user.photoUrl ? (
                  <AvatarImage src={user.photoUrl} alt={user.name} />
                ) : (
                  <AvatarFallback className="bg-primary/20 text-primary">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white truncate">{user.name}</span>
                  <Badge variant="secondary" className="text-xs ml-2 bg-primary/20 text-primary">1.2km</Badge>
                </div>
                <div className="flex items-center space-x-1">
                  <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full">
                    <MessageCircle className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MapView;
