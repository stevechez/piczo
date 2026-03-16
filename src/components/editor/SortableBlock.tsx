// src/components/editor/SortableBlock.tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditorStore } from '@/store/useEditorStore';
import { BuilderElement } from '@/types/builder';
import { GripVertical, Trash2 } from 'lucide-react';
import { BlockRenderer } from './BlockRenderer';

export const SortableBlock = ({ element }: { element: BuilderElement }) => {
  const { selectedElementId, selectElement, removeElement } = useEditorStore();
  const isSelected = selectedElementId === element.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: element.id,
    data: { type: element.type, isCanvasElement: true },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Prevent parent click events (like clearing selection) from firing when clicking this block
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(element.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleClick}
      className={`relative group p-4 border rounded-md bg-white ${
        isDragging ? 'opacity-30' : 'opacity-100'
      } ${
        isSelected ? 'ring-2 ring-blue-500 border-transparent' : 'border-slate-200 hover:border-blue-300'
      }`}
    >
      {/* Drag Handle - Only visible on hover or when selected */}
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical size={16} />
      </div>

      {/* Delete Button */}
      {isSelected && (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-900 text-white p-1 rounded-lg shadow-xl animate-in fade-in slide-in-from-bottom-2">
      <Button variant="ghost" size="icon" onClick={handleEdit} className="h-8 w-8 hover:bg-white/20">
        <Edit2 size={14} />
      </Button>
      <div className="w-px h-4 bg-white/20 mx-1" />
      <Button variant="ghost" size="icon" onClick={handleDelete} className="h-8 w-8 hover:text-red-400">
        <Trash2 size={14} />
      </Button>
    </div>
  )}

      {/* The Actual Rendered Content */}
      <div className="pl-6 w-full">
        <BlockRenderer element={element} />
      </div>
    </div>
  );
};