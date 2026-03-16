// src/components/public/PublicBlockRenderer.tsx
import { BuilderElement } from '@/types/builder';
import { TextBlock } from '../blocks/TextBlock';
import { ImageBlock } from '../blocks/ImageBlock';
import { ButtonBlock } from '../blocks/ButtonBlock';
import { PublicContainer } from './PublicContainer';

interface RendererProps {
  element: BuilderElement;
  allElements: BuilderElement[];
}

export const PublicBlockRenderer = ({ element, allElements }: RendererProps) => {
  switch (element.type) {
    case 'text':
      return <TextBlock element={element} />;
    case 'image':
      return <ImageBlock element={element} />;
    case 'button':
      return <ButtonBlock element={element} />;
    case 'container':
      return <PublicContainer element={element} allElements={allElements} />;
    default:
      return null;
  }
};