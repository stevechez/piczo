// src/app/[siteId]/page.tsx
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { BuilderElement } from '@/types/builder';
import { PublicBlockRenderer } from '@/components/public/PublicBlockRenderer';

// Next.js config to revalidate this page occasionally, or you can leave it completely dynamic
export const revalidate = 60; 

export default async function PublishedSite({ params }: { params: { siteId: string } }) {
  // 1. Fetch the flat JSON array from Postgres
  const { data, error } = await supabase
    .from('pages')
    .select('elements')
    .eq('site_id', params.siteId)
    .single();

  // 2. If the site doesn't exist, show a 404
  if (error || !data) {
    notFound();
  }

  const elements = data.elements as BuilderElement[];
  
  // 3. Find only the top-level blocks. The PublicContainer will handle the rest recursively.
  const rootElements = elements.filter((el) => el.parentId === null);

  return (
    <main className="min-h-screen bg-white">
      {/* We mirror the max-w from the editor so the layout matches exactly */}
      <div className="max-w-4xl mx-auto min-h-screen p-8 flex flex-col gap-2 shadow-sm">
        {rootElements.length === 0 ? (
          <div className="text-center text-slate-500 mt-20">
            This site has no content yet.
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
  );
}