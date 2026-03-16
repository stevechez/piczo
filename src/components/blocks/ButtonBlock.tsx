import { BuilderElement } from '@/types/builder';
import { cn } from '@/lib/utils';

export const ButtonBlock = ({ element }: { element: BuilderElement }) => {
  const dynamicClasses = Object.values(element.styles || {}).join(' ');

  return (
    <div className={cn("w-full flex", dynamicClasses)}>
      <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm">
        {element.content || 'Click Me'}
      </button>
    </div>
  );
};