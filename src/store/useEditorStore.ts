import { create } from 'zustand';
import { BuilderElement } from '../types/builder';
import { arrayMove } from '@dnd-kit/sortable';
import { supabase } from '@/lib/supabase';

// --- TYPES ---
export type SiteTheme = 'modern' | 'dark' | 'retro';
export type BgEffect = 'none' | 'hearts' | 'stars' | 'matrix';

interface EditorStore {
  // State
  elements: BuilderElement[];
  selectedElementId: string | null;
  isSaving: boolean;
  isLoading: boolean;
  theme: SiteTheme;
  bgEffect: BgEffect;
  isPropertiesModalOpen: boolean;
  spotifyUrl: string;
  cursorEffect: boolean;

  // Canvas Actions
  addElement: (element: BuilderElement) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, updates: Partial<BuilderElement>) => void;
  selectElement: (id: string | null) => void;
  reorderElements: (activeId: string, overId: string) => void;
  
  // UI & Vibe Actions
  setTheme: (theme: SiteTheme) => void;
  setBgEffect: (effect: BgEffect) => void;
  setPropertiesModalOpen: (isOpen: boolean) => void;
  setSpotifyUrl: (url: string) => void;
  setCursorEffect: (enabled: boolean) => void;
  
  // Database Actions
  loadPage: (siteId: string) => Promise<void>;
  savePage: (siteId: string) => Promise<void>;
}

// --- STORE IMPLEMENTATION ---
export const useEditorStore = create<EditorStore>((set, get) => ({
  // Initial State
  elements: [],
  selectedElementId: null,
  isSaving: false,
  isLoading: false,
  theme: 'modern',
  bgEffect: 'none',
  isPropertiesModalOpen: false,
  spotifyUrl: '',
  cursorEffect: false, // Added missing state

  // --- Element Management ---
  addElement: (element) => set((state) => ({ 
    elements: [...state.elements, element] 
  })),
  
  removeElement: (id) => set((state) => ({
    elements: state.elements.filter((el) => el.id !== id),
    selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
  })),
  
  updateElement: (id, updates) => set((state) => ({
    elements: state.elements.map((el) => el.id === id ? { ...el, ...updates } : el),
  })),
  
  selectElement: (id) => set({ selectedElementId: id }),
  
  reorderElements: (activeId, overId) => set((state) => {
    const oldIndex = state.elements.findIndex((el) => el.id === activeId);
    const newIndex = state.elements.findIndex((el) => el.id === overId);
    if (oldIndex !== -1 && newIndex !== -1) {
      return { elements: arrayMove(state.elements, oldIndex, newIndex) };
    }
    return state;
  }),

  // --- UI & Vibe Logic ---
  setTheme: (theme) => set({ theme }),
  
  setBgEffect: (bgEffect) => set({ bgEffect }),
  
  setPropertiesModalOpen: (isOpen) => set({ isPropertiesModalOpen: isOpen }),
  
  setSpotifyUrl: (url) => set({ spotifyUrl: url }),

  setCursorEffect: (enabled) => set({ cursorEffect: enabled }), // Added missing implementation

  // --- Database Sync (Supabase) ---
  loadPage: async (siteId) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('elements, theme, spotify_url, bg_effect, cursor_effect') // Added cursor_effect
        .eq('site_id', siteId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        set({ 
          elements: (data.elements as BuilderElement[]) || [],
          theme: (data.theme as SiteTheme) || 'modern',
          spotifyUrl: data.spotify_url || '',
          bgEffect: (data.bg_effect as BgEffect) || 'none',
          cursorEffect: data.cursor_effect || false // Load from DB
        });
      }
    } catch (error) {
      console.error('Failed to load page:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  savePage: async (siteId) => {
    const { elements, theme, spotifyUrl, bgEffect, cursorEffect } = get();
    set({ isSaving: true });
    try {
      const { error } = await supabase
        .from('pages')
        .upsert({ 
          site_id: siteId, 
          elements: elements,
          theme: theme,
          spotify_url: spotifyUrl,
          bg_effect: bgEffect,
          cursor_effect: cursorEffect, // Save to DB
          updated_at: new Date().toISOString()
        }, { onConflict: 'site_id' });

      if (error) throw error;
      console.log("Page saved successfully to Piczo cloud.");
    } catch (error) {
      console.error('Failed to save page:', error);
      alert('Failed to save page. Please try again.');
    } finally {
      set({ isSaving: false });
    }
  },
}));