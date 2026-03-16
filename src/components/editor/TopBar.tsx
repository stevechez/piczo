'use client';

import { useDraggable } from '@dnd-kit/core';
import { 
  Type, 
  Image as ImageIcon, 
  Square, 
  Layout, 
  Save, 
  Loader2, 
  Rocket, 
  PartyPopper, 
  Zap 
} from 'lucide-react';
import { ElementType } from '@/types/builder';
import { useEditorStore } from '@/store/useEditorStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { GiphyDock } from './GiphyDock';

const DraggableTool = ({ type, label, icon }: { type: ElementType; label: string; icon: any }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `dock-tool-${type}`,
    data: { 
      type, 
      isSidebarTool: true,
      // Default content for the confetti block
      content: type === 'confetti' ? 'SURPRISE!' : '' 
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-xl transition-all cursor-grab active:cursor-grabbing hover:bg-slate-100",
        isDragging && "opacity-50 scale-110 bg-blue-50"
      )}
    >
      <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-600">
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
    </div>
  );
};

export const TopBar = ({ siteId }: { siteId: string }) => {
  const { savePage, isSaving } = useEditorStore();

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
      {/* The Main Tool Dock */}
      <nav className="flex items-center gap-1 px-3 py-2 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl">
        <DraggableTool type="container" label="Box" icon={<Layout size={18} />} />
        <DraggableTool type="text" label="Text" icon={<Type size={18} />} />
        <DraggableTool type="image" label="Image" icon={<ImageIcon size={18} />} />
        <DraggableTool type="button" label="Link" icon={<Square size={18} />} />
        
        {/* NEW: Confetti Cannon Tool */}
        <DraggableTool type="confetti" label="Party" icon={<PartyPopper size={18} className="text-pink-500" />} />
        
        <div className="w-px h-10 bg-slate-200 mx-2" />

        {/* Giphy / Sticker Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex flex-col gap-1 w-16 h-16 rounded-xl hover:bg-slate-100"
            >
              <div className="p-2 bg-slate-900 rounded-lg shadow-sm text-white">
                <Zap size={18} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Gifs</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[350px] p-4 mt-2 rounded-2xl shadow-3xl border border-slate-100 z-50">
            <GiphyDock />
          </PopoverContent>
        </Popover>

        <div className="w-px h-10 bg-slate-200 mx-2" />
        
        {/* Action Button */}
        <Button 
          onClick={() => savePage(siteId)}
          disabled={isSaving}
          className="rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 px-6 h-12"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Rocket size={18} className="mr-2" />}
          {isSaving ? 'Saving' : 'Publish'}
        </Button>
      </nav>
      
      {/* Site ID Badge */}
      <div className="hidden lg:flex px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-mono shadow-xl border border-white/10">
        {siteId}.piczo
      </div>
    </div>
  );
};