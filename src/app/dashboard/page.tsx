// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Layout, ExternalLink, Edit3, Loader2, LogOut } from 'lucide-react';

// Define the shape of our fetched page data
interface SavedPage {
  site_id: string;
  updated_at: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [pages, setPages] = useState<SavedPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      // 1. Get the session AND the specific user details
      const { data: { session } } = await supabase.auth.getSession();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!session || !user) {
        router.push('/');
        return;
      }

      // 2. Fetch the list of saved sites filtered by the logged-in user
      const { data, error } = await supabase
        .from('pages')
        .select('site_id, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (!error && data) {
        setPages(data);
      }
      
      setIsLoading(false);
    };

    loadDashboard();
  }, [router]);

  const handleCreateNewSite = () => {
    // Simple prompt for the site name. In a production app, this would be a clean modal.
    const siteName = prompt('Enter a name for your new site (e.g., My Awesome Site):');
    
    if (siteName) {
      setIsCreating(true);
      // Slugify the name for the URL (e.g., "My Awesome Site" -> "my-awesome-site")
      const siteId = siteName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      
      // Send them directly into the builder. The row will be created in Supabase when they hit 'Save'.
      router.push(`/builder/${siteId}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
        <p className="text-slate-500 font-medium">Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Layout size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-slate-800">Workspace</span>
        </div>
        <Button variant="ghost" className="text-slate-500 hover:text-slate-800" onClick={handleLogout}>
          <LogOut size={16} className="mr-2" /> Logout
        </Button>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Sites</h1>
            <p className="text-slate-500 mt-1">Manage and edit your published pages.</p>
          </div>
          <Button onClick={handleCreateNewSite} disabled={isCreating} className="bg-blue-600 hover:bg-blue-700">
            {isCreating ? <Loader2 className="animate-spin mr-2" size={16} /> : <Plus className="mr-2" size={16} />}
            Create New Site
          </Button>
        </div>

        {/* Sites Grid */}
        {pages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <Layout size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">No sites yet</h3>
            <p className="text-slate-500 mb-6">Create your first site to get started.</p>
            <Button onClick={handleCreateNewSite} variant="outline">Create a site</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <Card key={page.site_id} className="flex flex-col hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg truncate">{page.site_id}</CardTitle>
                  <CardDescription>
                    Last updated: {new Date(page.updated_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-4 flex gap-3 border-t bg-slate-50/50">
                  <Button 
                    variant="default" 
                    className="flex-1 bg-slate-900"
                    onClick={() => router.push(`/builder/${page.site_id}`)}
                  >
                    <Edit3 size={16} className="mr-2" /> Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => window.open(`/${page.site_id}`, '_blank')}
                  >
                    <ExternalLink size={16} className="mr-2" /> View Live
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}