// src/components/editor/Sidebar.tsx
import { useDraggable } from '@dnd-kit/core';
import { Type, Image as ImageIcon, Square, Layout } from 'lucide-react';
import { ElementType } from '@/types/builder';

// The generic wrapper for our draggable tools
interface SidebarItemProps {
  type: ElementType;
  label: string;
  icon: React.ReactNode;
}

const DraggableTool = ({ type, label, icon }: SidebarItemProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-tool-${type}`, // Unique ID for the dnd-kit system
    data: { 
      type, 
      isSidebarTool: true // This flag tells our drop handler to CREATE a new block, not move an old one
    },
  });

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-3 p-3 w-full border rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:border-slate-300 ${
        isDragging ? 'opacity-50 ring-2 ring-blue-500' : 'bg-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export const Sidebar = () => {
  return (
    <aside className="w-64 border-r bg-slate-50 p-4 flex flex-col gap-4 shrink-0 h-screen">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-800">Add Elements</h2>
        <p className="text-xs text-slate-500">Drag and drop onto the canvas</p>
      </div>
      
      <div className="flex flex-col gap-2">
        <DraggableTool type="container" label="Container" icon={<Layout size={18} />} />
        <DraggableTool type="text" label="Text Block" icon={<Type size={18} />} />
        <DraggableTool type="image" label="Image" icon={<ImageIcon size={18} />} />
        <DraggableTool type="button" label="Button" icon={<Square size={18} />} />
      </div>
    </aside>
  );
};