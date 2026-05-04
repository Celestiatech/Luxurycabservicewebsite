import { MapPin } from 'lucide-react';
import { Input } from './ui/input';

interface LocationAutocompleteProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function LocationAutocomplete({ placeholder, value, onChange, className }: LocationAutocompleteProps) {
  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-500 z-10" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`pl-12 font-semibold border-2 ${className}`}
      />
    </div>
  );
}
