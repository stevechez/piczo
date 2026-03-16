// src/components/blocks/ContainerBlock.tsx
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useEditorStore } from '@/store/useEditorStore';
import { BuilderElement } from '@/types/builder';
import { SortableBlock } from '../editor/SortableBlock';
import { cn } from '@/lib/utils';

export const ContainerBlock = ({ element }: { element: BuilderElement }) => {
  const { elements } = useEditorStore();
  
  // Find all elements that point to this container as their parent
  const children = elements.filter((el) => el.parentId === element.id);

  // Register this specific container as a drop zone
  const { setNodeRef, isOver } = useDroppable({
    id: element.id,
    data: { 
      type: 'container', 
      isContainer: true // Flags this as a valid drop target for our dragEnd handler
    },
  });

  const dynamicClasses = Object.values(element.styles || {}).join(' ');

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[120px] w-full p-4 border-2 border-dashed rounded-md transition-all",
        isOver ? "bg-blue-50 border-blue-400" : "bg-slate-50 border-slate-300",
        // If no dynamic grid/flex classes are applied yet, default to a vertical flex layout
        dynamicClasses || "flex flex-col gap-2" 
      )}
    >
      <SortableContext 
        items={children.map((c) => c.id)} 
        strategy={verticalListSortingStrategy}
      >
        {children.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm italic py-4 pointer-events-none">
            Drop blocks here
          </div>
        ) : (
          children.map((child) => (
            <SortableBlock key={child.id} element={child} />
          ))
        )}
      </SortableContext>
    </div>
  );
};