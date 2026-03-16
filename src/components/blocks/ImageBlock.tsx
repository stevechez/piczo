import { BuilderElement } from '@/types/builder';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';

export const ImageBlock = ({ element }: { element: BuilderElement }) => {
  const dynamicClasses = Object.values(element.styles || {}).join(' ');
  const hasValidUrl = element.content && element.content.startsWith('http');

  return (
    <div className={cn("w-full flex justify-center", dynamicClasses)}>
      {hasValidUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img 
          src={element.content} 
          alt="User uploaded block" 
          className="max-w-full h-auto rounded-md shadow-sm"
        />
      ) : (
        <div className="w-full h-48 bg-slate-100 border-2 border-dashed border-slate-300 rounded-md flex flex-col items-center justify-center text-slate-400">
          <ImageIcon size={32} className="mb-2 opacity-50" />
          <span className="text-sm font-medium">Add an image URL in properties</span>
        </div>
      )}
    </div>
  );
};