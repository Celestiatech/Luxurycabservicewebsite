'use client';

import { Users } from 'lucide-react';
import { Input } from './ui/input';

export function PassengersSelect(props: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative">
      <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-600" />
      <Input
        aria-label="Passenger count"
        type="number"
        min={1}
        max={99}
        step={1}
        inputMode="numeric"
        placeholder="Enter passengers"
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        className="border-2 pl-10 font-semibold"
      />
    </div>
  );
}
