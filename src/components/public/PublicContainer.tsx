// src/components/public/PublicContainer.tsx
import { BuilderElement } from '@/types/builder';
import { PublicBlockRenderer } from './PublicBlockRenderer';
import { cn } from '@/lib/utils';

interface PublicContainerProps {
  element: BuilderElement;
  allElements: BuilderElement[]; // We pass the flat array down so the container can find its children
}

export const PublicContainer = ({ element, allElements }: PublicContainerProps) => {
  // Find all elements that belong inside this container
  const children = allElements.filter((el) => el.parentId === element.id);
  
  // Apply our dynamic Tailwind classes (e.g., grid-cols-3, gap-4)
  const dynamicClasses = Object.values(element.styles || {}).join(' ');

  return (
    <div className={cn("w-full", dynamicClasses || "flex flex-col gap-2")}>
      {children.map((child) => (
        <PublicBlockRenderer 
          key={child.id} 
          element={child} 
          allElements={allElements} 
        />
      ))}
    </div>
  );
};