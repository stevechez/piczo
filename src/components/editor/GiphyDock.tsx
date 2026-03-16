'use client';

import { useState, useEffect } from 'react';
import { giphy } from '@/lib/giphy';
import { useDraggable } from '@dnd-kit/core';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Loader2, Search } from 'lucide-react';

// --- The Draggable GIF Wrapper ---
const DraggableGif = ({ gif }: { gif: any }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `giphy-${gif.id}`,
    data: { 
      type: 'image', 
      isSidebarTool: true, 
      content: gif.images.fixed_height.url 
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all ${
        isDragging ? 'opacity-50 border-blue-500 scale-95' : 'border-transparent hover:border-slate-200'
      }`}
    >
      <img 
        src={gif.images.fixed_height_small.url} 
        alt={gif.title} 
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
};

// --- The Main Dock Component ---
export const GiphyDock = () => {
  const [searchTerm, setSearchTerm] = useState('blinkie'); // Default to the classic Piczo term
  const [gifs, setGifs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchGifs = async (query: string) => {
    setIsLoading(true);
    try {
      const { data } = query 
        ? await giphy.search(query, { limit: 20, rating: 'g' }) 
        : await giphy.trending({ limit: 20 });
      setGifs(data);
    } catch (error) {
      console.error('Giphy search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search so we don't spam the API on every keystroke
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchGifs(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <Input
          placeholder="Search stickers & blinkies..."
          className="pl-10 rounded-full bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[350px] pr-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-500" size={24} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {gifs.map((gif) => (
              <DraggableGif key={gif.id} gif={gif} />
            ))}
          </div>
        )}
        
        {!isLoading && gifs.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm">
            No blinkies found. Try "sparkle" or "retro".
          </div>
        )}
      </ScrollArea>
      
      <div className="pt-2 border-t border-slate-100 flex items-center justify-center">
        <img 
          src="https://raw.githubusercontent.com/Giphy/giphy-js/master/packages/components/static/Poweredby_640px-White_Vert.png" 
          alt="Powered by GIPHY" 
          className="h-4 opacity-50 grayscale"
        />
      </div>
    </div>
  );
};