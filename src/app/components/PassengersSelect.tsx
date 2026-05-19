'use client';

import { Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const OPTIONS = [
  { value: '1-4', label: '1–4 Passengers' },
  { value: '5-11', label: '5–11 Passengers' },
];

export function PassengersSelect(props: { value: string; onChange: (value: string) => void }) {
  return (
    <Select value={props.value} onValueChange={props.onChange}>
      <SelectTrigger aria-label="Select passengers" className="w-full border-2 font-semibold bg-input-background justify-between text-left">
        <div className="flex flex-1 items-center gap-2 min-w-0 text-left">
          <Users className="h-4 w-4 text-yellow-600 shrink-0" />
          <SelectValue placeholder="Select passengers" />
        </div>
      </SelectTrigger>
      <SelectContent className="p-1">
        {OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value} className="py-2 font-semibold">
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
