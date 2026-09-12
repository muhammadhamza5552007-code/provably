import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Only use the AsyncStorage adapter on native. On web, Expo Router server-renders
// routes in Node (no `window`), and AsyncStorage's web shim touches window.localStorage
// unconditionally, which crashes SSR — Supabase's own default web storage already
// handles that environment safely.
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      ...(Platform.OS !== 'web' && { storage: AsyncStorage }),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
