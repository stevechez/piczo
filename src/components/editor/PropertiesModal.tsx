'use client';

import { useEditorStore, SiteTheme, BgEffect } from '@/store/useEditorStore';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Type, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Layout, 
  RotateCw, 
  Layers, 
  Maximize, 
  Sun, 
  Moon, 
  Zap,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
  Music,
  Pipette,
  Ban,
  Heart,
  Star,
  Terminal
} from 'lucide-react';

export const PropertiesModal = () => {
  const { 
    elements, 
    selectedElementId, 
    updateElement, 
    isPropertiesModalOpen, 
    setPropertiesModalOpen,
    theme,
    setTheme,
    bgEffect,
    setBgEffect,
    spotifyUrl,
    setSpotifyUrl
  } = useEditorStore();

  const activeElement = elements.find((el) => el.id === selectedElementId);

  if (!activeElement) return null;

  const handleStyleChange = (property: string, value: string) => {
    updateElement(activeElement.id, {
      styles: { ...activeElement.styles, [property]: value },
    });
  };

  const handleContentChange = (value: string) => {
    updateElement(activeElement.id, { content: value });
  };

  // Piczo-ish Color Palettes
  const piczoPalettes = [
    { name: 'Flashbang', bg: 'bg-[#ff00ff]', text: 'text-[#ffff00]', description: 'Neon Pink & Yellow' },
    { name: 'Blinkie', bg: 'bg-[#000000]', text: 'text-[#00ff00]', description: 'Matrix Hacker' },
    { name: 'Parchment', bg: 'bg-[#fdf6e3]', text: 'text-[#657b83]', description: 'Original Piczo' },
    { name: 'Holographic', bg: 'bg-gradient-to-r from-violet-300 via-pink-300 to-sky-300', text: 'text-white', description: 'Y2K Sparkle' },
    { name: 'Vaporwave', bg: 'bg-[#9400d3]', text: 'text-[#00ffff]', description: 'Violet & Cyan' }
  ];

  return (
    <Dialog open={isPropertiesModalOpen} onOpenChange={setPropertiesModalOpen}>
      <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-y-auto border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
            {activeElement.type === 'text' && <Type size={20} className="text-blue-500" />}
            {activeElement.type === 'image' && <ImageIcon size={20} className="text-blue-500" />}
            {activeElement.type === 'container' && <Layout size={20} className="text-blue-500" />}
            Edit {activeElement.type}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="site">Site</TabsTrigger>
          </TabsList>

          {/* TAB 1: CONTENT */}
          <TabsContent value="content" className="space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {activeElement.type === 'image' ? 'Image URL' : 'Display Text'}
              </Label>
              <textarea
                className="w-full p-3 border rounded-xl text-sm outline-none min-h-[100px] bg-slate-50"
                value={activeElement.content}
                onChange={(e) => handleContentChange(e.target.value)}
              />
            </div>
          </TabsContent>

          {/* TAB 2: DESIGN (Figma-meets-Scrapbook) */}
          <TabsContent value="design" className="space-y-8 py-2">
            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-slate-700 font-bold">
                <RotateCw size={14} className="text-blue-500" /> Transform
              </Label>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-500"><span>Rotation</span><span>{activeElement.styles.rotation || '0deg'}</span></div>
                  <Slider defaultValue={[parseInt(activeElement.styles.rotation || '0')]} max={180} min={-180} step={1} onValueChange={(v) => handleStyleChange('rotation', `${v[0]}deg`)} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-500"><span>Scale</span><span>{activeElement.styles.scale || '1'}x</span></div>
                  <Slider defaultValue={[parseFloat(activeElement.styles.scale || '1') * 100]} max={300} min={10} step={1} onValueChange={(v) => handleStyleChange('scale', `${v[0] / 100}`)} />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-slate-700 font-bold">
                <Pipette size={14} className="text-blue-500" /> Color Vibe
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full rounded-xl">Choose a Color Combo</Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-2 rounded-2xl">
                  <div className="grid gap-2">
                    {piczoPalettes.map((p) => (
                      <button key={p.name} onClick={() => { handleStyleChange('backgroundColor', p.bg); handleStyleChange('color', p.text); }} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg text-left">
                        <div className={`w-8 h-8 rounded ${p.bg} border flex items-center justify-center`}><span className={`${p.text} text-[10px] font-bold`}>Aa</span></div>
                        <span className="text-sm font-medium">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </TabsContent>

          {/* TAB 3: GLOBAL SITE SETTINGS */}
          <TabsContent value="site" className="space-y-8">
            {/* Global Theme */}
            <div className="space-y-4">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Vibe</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button variant={theme === 'modern' ? 'default' : 'outline'} onClick={() => setTheme('modern')} className="flex flex-col h-16 gap-1"><Sun size={16} /> <span className="text-[10px]">Modern</span></Button>
                <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')} className="flex flex-col h-16 gap-1"><Moon size={16} /> <span className="text-[10px]">Dark</span></Button>
                <Button variant={theme === 'retro' ? 'default' : 'outline'} onClick={() => setTheme('retro')} className="flex flex-col h-16 gap-1"><Zap size={16} /> <span className="text-[10px]">Retro</span></Button>
              </div>
            </div>

            {/* Background Effects (The part you requested) */}
            <div className="space-y-4">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={14} className="text-purple-500" /> Background Effect
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'none', label: 'Clean', icon: <Ban size={14} /> },
                  { id: 'hearts', label: 'Hearts', icon: <Heart size={14} /> },
                  { id: 'stars', label: 'Stars', icon: <Star size={14} /> },
                  { id: 'matrix', label: 'Matrix', icon: <Terminal size={14} /> }
                ].map((effect) => (
                  <Button
                    key={effect.id}
                    variant={bgEffect === effect.id ? 'default' : 'outline'}
                    onClick={() => setBgEffect(effect.id as BgEffect)}
                    className="justify-start gap-2 h-10"
                  >
                    {effect.icon}
                    {effect.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
  <div className="flex items-center gap-3">
    <Sparkles size={18} className="text-yellow-500" />
    <div className="flex flex-col">
      <span className="text-sm font-bold text-slate-700">Cursor Sparkles</span>
      <span className="text-[10px] text-slate-400 uppercase font-medium">Classic Piczo Magic</span>
    </div>
  </div>
  <input 
    type="checkbox" 
    checked={cursorEffect}
    onChange={(e) => setCursorEffect(e.target.checked)}
    className="w-5 h-5 accent-blue-600 cursor-pointer"
  />
</div>

            {/* Spotify */}
            <div className="space-y-4">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Music size={14} className="text-green-500" /> Site Soundtrack
              </Label>
              <input
                type="text"
                placeholder="Spotify Link..."
                className="w-full p-3 border rounded-xl text-sm bg-slate-50 outline-none"
                value={spotifyUrl}
                onChange={(e) => setSpotifyUrl(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};