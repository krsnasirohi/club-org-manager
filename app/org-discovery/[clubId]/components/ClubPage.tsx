"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@/utils/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Club {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export default function ClubDetailPage() {
  const router = useRouter();
  const { clubId } = router.query;
  
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clubId) return;

    fetchClub();
  }, [clubId]);

  async function fetchClub() {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from('clubs')
        .select('*')
        .eq('id', clubId)
        .single();

      if (fetchError) throw fetchError;

      setClub(data);
    } catch (err: any) {
      console.error('Error fetching club:', err);
      setError(err.message || 'Failed to load club');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>Fetching club information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load club</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <button 
              onClick={() => router.push('/org')}
              className="text-sm underline"
            >
              Back to Clubs
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Club Not Found</CardTitle>
            <CardDescription>The club you're looking for doesn't exist</CardDescription>
          </CardHeader>
          <CardContent>
            <button 
              onClick={() => router.push('/org')}
              className="text-sm underline"
            >
              Back to Clubs
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <button 
        onClick={() => router.push('/org')}
        className="text-sm underline mb-4"
      >
        ← Back to Clubs
      </button>

      <Card>
        <CardHeader>
          <CardTitle>{club.name}</CardTitle>
          <CardDescription>
            Created on {new Date(club.created_at).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">
                {club.description || 'No description available'}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Club Details</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Club ID:</strong> {club.id}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}