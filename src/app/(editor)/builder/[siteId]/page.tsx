'use client';

import { useState, useEffect } from 'react';
import { DndContext, DragOverlay, closestCenter, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { Sidebar } from '@/components/editor/Sidebar';
import { Canvas } from '@/components/editor/Canvas';
import { useEditorStore } from '@/store/useEditorStore';
import { BuilderElement, ElementType } from '@/types/builder';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import { Save, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation'; // To get the siteId from the URL

export default function BuilderPage() {
  const params = useParams();
  const siteId = params.siteId as string;

  const { 
    elements, addElement, updateElement, reorderElements, 
    loadPage, savePage, isSaving, isLoading 
  } = useEditorStore();  
  
  const [activeDragType, setActiveDragType] = useState<ElementType | null>(null);

  // Load the page data when the component mounts
  useEffect(() => {
    if (siteId) {
      loadPage(siteId);
    }
  }, [siteId, loadPage]);

  // ... (Keep all your existing handleDragStart and handleDragEnd logic exactly the same) ...
  const handleDragStart = (event: DragStartEvent) => { /* ... */ };
  const handleDragEnd = (event: DragEndEvent) => { /* ... */ };

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center bg-slate-50">Loading editor...</div>;
  }

  return (
    <DndContext 
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-screen overflow-hidden bg-white">
        
        {/* NEW TOP BAR */}
        <header className="h-14 border-b bg-white flex items-center justify-between px-6 shrink-0 z-20">
          <div className="font-bold text-slate-800">Site Builder: <span className="text-blue-600">{siteId}</span></div>
          <button 
            onClick={() => savePage(siteId)}
            disabled={isSaving}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <Canvas />
          <PropertiesPanel />
        </div>

        <DragOverlay>
          {activeDragType ? (
            <div className="p-3 bg-blue-500 text-white rounded shadow-xl opacity-80 cursor-grabbing">
              Dragging {activeDragType}...
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}