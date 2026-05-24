'use client';

import { Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const passengerOptions = Array.from({ length: 99 }, (_, index) => String(index + 1));

export function PassengersSelect(props: { value: string; onChange: (value: string) => void }) {
  return (
    <Select value={props.value} onValueChange={props.onChange}>
      <SelectTrigger
        aria-label="Passenger count"
        className="h-12 border-2 border-gray-200 bg-white pl-4 pr-4 text-base font-bold text-gray-900 shadow-sm"
      >
        <span className="flex min-w-0 items-center gap-3">
          <Users className="h-5 w-5 shrink-0 text-yellow-600" />
          <SelectValue placeholder="Select passengers" />
        </span>
      </SelectTrigger>
      <SelectContent className="max-h-72">
        {passengerOptions.map((count) => (
          <SelectItem key={count} value={count} className="py-2 text-sm font-semibold">
            {count} {count === '1' ? 'Passenger' : 'Passengers'}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
