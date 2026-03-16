// src/app/[siteId]/page.tsx
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { BuilderElement } from '@/types/builder';
import { PublicBlockRenderer } from '@/components/public/PublicBlockRenderer';

export const revalidate = 60; 

export default async function PublishedSite({ 
  params 
}: { 
  params: Promise<{ siteId: string }> 
}) {
  const resolvedParams = await params;

  const { data, error } = await supabase
    .from('pages')
    .select('elements')
    .eq('site_id', resolvedParams.siteId)
    .single();

  if (error || !data) {
    notFound();
  }

  const elements = data.elements as BuilderElement[];
  const rootElements = elements.filter((el) => el.parentId === null);

  return (
    /* Ultra-modern public wrapper: 
       We use a clean, neutral background and a focused content area.
    */
    <div className="min-h-screen bg-white selection:bg-blue-100">
      <main className="max-w-5xl mx-auto px-6 py-12 md:py-24">
        <div className="flex flex-col gap-4">
          {rootElements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <p className="text-lg font-medium">This site is still under construction.</p>
            </div>
          ) : (
            rootElements.map((element) => (
              <PublicBlockRenderer 
                key={element.id} 
                element={element} 
                allElements={elements} 
              />
            ))
          )}
        </div>
      </main>

      {/* Subtle "Built with" badge - essential for that SaaS feel */}
      <footer className="py-12 flex justify-center">
        <a 
          href="/" 
          className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Made with Modern Piczo
        </a>
      </footer>
    </div>
  );
}