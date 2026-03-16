import { BuilderElement } from '@/types/builder';
import { TextBlock } from '../blocks/TextBlock';
import { ImageBlock } from '../blocks/ImageBlock';
import { ButtonBlock } from '../blocks/ButtonBlock';
import { ContainerBlock } from '../blocks/ContainerBlock';
import { ConfettiBlock } from './ConfettiBlock';

export const BlockRenderer = ({ element }: { element: BuilderElement }) => {
  switch (element.type) {
    case 'text':
      return <TextBlock element={element} />;
    case 'image':
      return <ImageBlock element={element} />;
    case 'button':
      return <ButtonBlock element={element} />;
      case 'confetti':
  return <ConfettiBlock element={element} />;
    case 'container':
      return <ContainerBlock element={element} />; // Hooked up!
    default:
      return <div className="p-4 bg-red-100 text-red-600">Unknown block type</div>;
  }
};