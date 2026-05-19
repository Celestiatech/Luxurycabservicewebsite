'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export type ShopifyVariantOption = {
  id: string;
  label: string;
  vehicleType?: 'taxi' | 'van' | null;
  collectionHandle?: string | null;
  priceAmount: string | null;
  currencyCode: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
};

export function ShopifyVariantSelect(props: {
  value: string;
  onChange: (value: string) => void;
  options: ShopifyVariantOption[];
  placeholder?: string;
}) {
  const { value, onChange, options, placeholder = 'Select vehicle / product' } = props;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={placeholder} className="w-full border-2 font-semibold bg-input-background justify-between text-left">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="p-1">
        {options.map((v) => (
          <SelectItem key={v.id} value={v.id} className="py-2">
            <div className="flex items-center gap-3">
              {v.imageUrl ? (
                <img
                  src={v.imageUrl}
                  alt={v.imageAlt || v.label}
                  className="h-9 w-9 rounded-md object-cover border border-yellow-200 bg-white"
                  loading="lazy"
                />
              ) : (
                <div className="h-9 w-9 rounded-md border border-yellow-200 bg-yellow-50" />
              )}
              <div className="min-w-0">
                <div className="font-black text-sm text-gray-900 truncate">{v.label}</div>
                {v.priceAmount ? (
                  <div className="text-xs font-semibold text-gray-600">
                    {v.priceAmount} {v.currencyCode || ''}
                  </div>
                ) : null}
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
