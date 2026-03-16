// src/components/editor/PropertiesPanel.tsx
import { useEditorStore } from '@/store/useEditorStore';
import { Settings2, Type, Image as ImageIcon, Link, Layout } from 'lucide-react';

export const PropertiesPanel = () => {
  const { elements, selectedElementId, updateElement } = useEditorStore();

  const activeElement = elements.find((el) => el.id === selectedElementId);

  if (!activeElement) {
    return (
      <aside className="w-80 border-l bg-slate-50 p-6 h-full shrink-0 flex flex-col items-center justify-center text-center">
        <Settings2 className="text-slate-300 mb-4" size={48} />
        <h2 className="font-bold text-slate-700">No element selected</h2>
        <p className="text-sm text-slate-500 mt-2">
          Click on any block on the canvas to edit its properties, content, and styles.
        </p>
      </aside>
    );
  }

  const handleContentChange = (value: string) => {
    updateElement(activeElement.id, { content: value });
  };

  const handleStyleChange = (property: string, value: string) => {
    updateElement(activeElement.id, {
      styles: { ...activeElement.styles, [property]: value },
    });
  };

  return (
    <aside className="w-80 border-l bg-white flex flex-col h-full shrink-0 shadow-sm z-10">
      {/* Header */}
      <div className="p-4 border-b bg-slate-50 flex items-center gap-2">
        {activeElement.type === 'text' && <Type size={18} className="text-blue-500" />}
        {activeElement.type === 'image' && <ImageIcon size={18} className="text-blue-500" />}
        {activeElement.type === 'button' && <Link size={18} className="text-blue-500" />}
        {activeElement.type === 'container' && <Layout size={18} className="text-blue-500" />}
        <h2 className="font-bold text-slate-800 capitalize">{activeElement.type} Properties</h2>
      </div>

      {/* Scrollable Form Area */}
      <div className="p-4 flex-1 overflow-y-auto space-y-6">
        
        {/* CONTENT INPUT (Hide for containers since they just hold other blocks) */}
        {activeElement.type !== 'container' && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">
              {activeElement.type === 'image' ? 'Image URL' : 'Content'}
            </label>
            
            {activeElement.type === 'text' ? (
              <textarea
                className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                value={activeElement.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Enter your text here..."
              />
            ) : (
              <input
                type="text"
                className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={activeElement.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder={activeElement.type === 'image' ? 'https://...' : 'Button text...'}
              />
            )}
          </div>
        )}

        {activeElement.type !== 'container' && <hr className="border-slate-100" />}

        {/* CONTAINER SPECIFIC CONTROLS (Grid Layout) */}
        {activeElement.type === 'container' && (
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase">Grid Layout</label>
            
            {/* Columns Control */}
            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-slate-700">Columns</span>
              <select
                className="w-full p-2 border rounded-md text-sm bg-white"
                value={activeElement.styles.gridTemplateColumns || 'grid-cols-1'}
                onChange={(e) => handleStyleChange('gridTemplateColumns', e.target.value)}
              >
                <option value="grid-cols-1">1 Column (Full Width)</option>
                <option value="grid-cols-2">2 Columns (Half & Half)</option>
                <option value="grid-cols-3">3 Columns (Thirds)</option>
                <option value="grid-cols-4">4 Columns (Quarters)</option>
              </select>
            </div>

            {/* Gap Control */}
            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-slate-700">Spacing (Gap)</span>
              <select
                className="w-full p-2 border rounded-md text-sm bg-white"
                value={activeElement.styles.gap || 'gap-4'}
                onChange={(e) => handleStyleChange('gap', e.target.value)}
              >
                <option value="gap-0">None (0px)</option>
                <option value="gap-2">Small (8px)</option>
                <option value="gap-4">Medium (16px)</option>
                <option value="gap-8">Large (32px)</option>
              </select>
            </div>
            
            <hr className="border-slate-100 my-4" />
          </div>
        )}

        {/* STANDARD STYLES INPUTS (Padding, etc.) */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-500 uppercase">Appearance</label>
          
          {/* Padding Control */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm text-slate-700">Padding</span>
            <select
              className="w-full p-2 border rounded-md text-sm bg-white"
              value={activeElement.styles.padding || ''}
              onChange={(e) => handleStyleChange('padding', e.target.value)}
            >
              <option value="">None (p-0)</option>
              <option value="p-4">Small (p-4)</option>
              <option value="p-8">Medium (p-8)</option>
              <option value="p-12">Large (p-12)</option>
            </select>
          </div>

          {/* Text Alignment (Only for text/buttons) */}
          {(activeElement.type === 'text' || activeElement.type === 'button') && (
            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-slate-700">Alignment</span>
              <select
                className="w-full p-2 border rounded-md text-sm bg-white"
                value={activeElement.styles.textAlign || ''}
                onChange={(e) => handleStyleChange('textAlign', e.target.value)}
              >
                <option value="text-left">Left</option>
                <option value="text-center">Center</option>
                <option value="text-right">Right</option>
              </select>
            </div>
          )}
        </div>

      </div>
    </aside>
  );
};