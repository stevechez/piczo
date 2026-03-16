// src/types/builder.ts
export type ElementType = 'text' | 'image' | 'container' | 'button' | 'confetti';

export interface BuilderElement {
  id: string;
  type: ElementType; // This now includes 'confetti'
  content: string;
  parentId: string | null;
  styles: BuilderStyles;
}

export interface BuilderStyles {
  backgroundColor?: string;
  color?: string;
  fontSize?: string;
  textAlign?: string;
  padding?: string;
  gridTemplateColumns?: string;
  zIndex?: string;
  rotation?: string;
  scale?: string;
}

export interface DragItemData {
  type: ElementType;
  isSidebarTool?: boolean; // Helps dnd-kit know if we are dragging a NEW item or moving an EXISTING one
}