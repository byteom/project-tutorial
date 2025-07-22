
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';
import { getUserSubscription } from '../lib/firestore-subscriptions';
import type { Subscription } from '../lib/types';

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      setIsLoading(true);
      try {
        const sub = await getUserSubscription(user.uid);
        setSubscription(sub);
      } catch (error) {
        console.error("Failed to fetch subscription status:", error);
        setSubscription(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  return { subscription, isLoading };
}
