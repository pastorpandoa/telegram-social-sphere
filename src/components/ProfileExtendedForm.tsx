
import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { setupMainButton, showTelegramAlert } from '../utils/telegramWebApp';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const ProfileExtendedForm: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { currentUser, setUserProfile } = useUser();
  
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [height, setHeight] = useState<number | undefined>(currentUser?.height);
  const [weight, setWeight] = useState<number | undefined>(currentUser?.weight);
  const [bodyType, setBodyType] = useState(currentUser?.bodyType || '');
  const [sexuality, setSexuality] = useState(currentUser?.sexuality || '');
  const [position, setPosition] = useState(currentUser?.position || '');
  const [tribe, setTribe] = useState(currentUser?.tribe || '');
  
  // Configure main button to save profile
  React.useEffect(() => {
    setupMainButton('Guardar Perfil', handleSave);
    
    return () => {
      const tg = window.Telegram?.WebApp;
      if (tg && tg.MainButton.isVisible) {
        tg.MainButton.hide();
      }
    };
  }, [bio, height, weight, bodyType, sexuality, position, tribe]);
  
  // Parse input to number
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHeight(value ? Number(value) : undefined);
  };
  
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWeight(value ? Number(value) : undefined);
  };
  
  // Save the profile
  const handleSave = () => {
    if (!bio.trim()) {
      showTelegramAlert('Por favor, añade una breve biografía sobre ti');
      return;
    }
    
    // Update the user profile
    setUserProfile({
      bio: bio.trim(),
      height,
      weight,
      bodyType,
      sexuality,
      position,
      tribe
    });
    
    // Callback to indicate completion
    onComplete();
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="bio">Acerca de ti</Label>
        <Textarea
          id="bio"
          placeholder="Escribe una breve biografía sobre ti..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="resize-none"
          rows={3}
          maxLength={200}
        />
        <div className="text-right text-xs text-muted-foreground">
          {bio.length}/200
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height">Estatura (cm)</Label>
          <Input
            id="height"
            type="number"
            placeholder="170"
            value={height || ''}
            onChange={handleHeightChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="weight">Peso (kg)</Label>
          <Input
            id="weight"
            type="number"
            placeholder="70"
            value={weight || ''}
            onChange={handleWeightChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Tipo de cuerpo</Label>
        <Select value={bodyType} onValueChange={setBodyType}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona tipo de cuerpo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="delgado">Delgado</SelectItem>
            <SelectItem value="fit">Fit</SelectItem>
            <SelectItem value="musculoso">Musculoso</SelectItem>
            <SelectItem value="promedio">Promedio</SelectItem>
            <SelectItem value="gordioso">Gordi-oso</SelectItem>
            <SelectItem value="grande">Grande</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Sexualidad</Label>
        <RadioGroup value={sexuality} onValueChange={setSexuality} className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hetero" id="hetero" />
            <Label htmlFor="hetero" className="cursor-pointer">Hetero</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bi" id="bi" />
            <Label htmlFor="bi" className="cursor-pointer">Bi</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="homosexual" id="homosexual" />
            <Label htmlFor="homosexual" className="cursor-pointer">Homosexual</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label>Posición</Label>
        <Select value={position} onValueChange={setPosition}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona posición" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="activo">Activo</SelectItem>
            <SelectItem value="versatil_act">Versátil Activo</SelectItem>
            <SelectItem value="versatil">Versátil</SelectItem>
            <SelectItem value="versatil_pas">Versátil Pasivo</SelectItem>
            <SelectItem value="pasivo">Pasivo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Tribe</Label>
        <Select value={tribe} onValueChange={setTribe}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona tribe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daddy">Daddy</SelectItem>
            <SelectItem value="twink">Twink</SelectItem>
            <SelectItem value="jock">Jock</SelectItem>
            <SelectItem value="bear">Bear</SelectItem>
            <SelectItem value="otter">Otter</SelectItem>
            <SelectItem value="wolf">Wolf</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProfileExtendedForm;
