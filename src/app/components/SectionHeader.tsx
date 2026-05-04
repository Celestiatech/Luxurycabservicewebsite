import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  showNavigation?: boolean;
  showSeeMore?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  onSeeMore?: () => void;
}

export function SectionHeader({
  title,
  subtitle,
  showNavigation = false,
  showSeeMore = false,
  onPrev,
  onNext,
  onSeeMore
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-12">
      <div className="max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 uppercase tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg md:text-xl font-semibold text-gray-600">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {showNavigation && (
          <div className="flex items-center gap-2">
            <button
              onClick={onPrev}
              className="w-12 h-12 rounded-full border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all flex items-center justify-center group"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={onNext}
              className="w-12 h-12 rounded-full border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all flex items-center justify-center group"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
        {showSeeMore && (
          <Button
            onClick={onSeeMore}
            variant="outline"
            className="font-bold border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8"
          >
            SEE MORE
          </Button>
        )}
      </div>
    </div>
  );
}
