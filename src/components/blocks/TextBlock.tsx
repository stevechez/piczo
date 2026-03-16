import { BuilderElement } from '@/types/builder';
import { cn } from '@/lib/utils';

export const TextBlock = ({ element }: { element: BuilderElement }) => {
  // Convert our styles object { padding: 'p-4', textAlign: 'text-center' } into a string: "p-4 text-center"
  const dynamicClasses = Object.values(element.styles || {}).join(' ');

  return (
    <div className={cn("min-h-[2rem] w-full break-words", dynamicClasses)}>
      {element.content || <span className="text-slate-400 italic">Empty text block...</span>}
    </div>
  );
};