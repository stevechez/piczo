// src/components/editor/Canvas.tsx
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useEditorStore } from '@/store/useEditorStore';
import { SortableBlock } from './SortableBlock';
import { cn } from '@/lib/utils';

export const Canvas = () => {
  const { elements, selectElement } = useEditorStore();
  const { setNodeRef, isOver } = useDroppable({ id: 'editor-canvas' });
  const rootElements = elements.filter((el) => el.parentId === null);

  return (
    <main 
      className="flex-1 overflow-y-auto relative py-20 px-8 flex justify-center bg-slate-50"
      style={{
        // The "Modern Pro" Dot Grid
        backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }}
      onClick={() => selectElement(null)}
    >
      <div
        ref={setNodeRef}
        className={cn(
          "w-full max-w-5xl min-h-[1000px] bg-white rounded-2xl shadow-2xl ring-1 ring-slate-200 transition-all duration-300",
          isOver && "ring-4 ring-blue-500/20"
        )}
      >
        <SortableContext items={rootElements.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col p-8 gap-4">
            {rootElements.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-40 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                <p className="font-medium">Your canvas is empty</p>
                <p className="text-sm">Drag elements from the dock above to start</p>
              </div>
            ) : (
              rootElements.map((element) => <SortableBlock key={element.id} element={element} />)
            )}
          </div>
        </SortableContext>
      </div>
    </main>
  );
};