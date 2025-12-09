
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase URL and Anon Key
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

const isValidUrl = (url: string) => {
  return url && (url.startsWith('http://') || url.startsWith('https://')) && url !== 'YOUR_SUPABASE_URL';
};

let client;

if (isValidUrl(supabaseUrl)) {
    client = createClient(supabaseUrl, supabaseKey);
} else {
    console.warn('Supabase credentials not found or invalid. Using mock client to prevent crash.');
    
    // Mock chainable builder for Supabase queries
    const mockBuilder = () => {
        const promise = Promise.resolve({ data: [], error: null });
        // Allow chaining .order()
        (promise as any).order = () => promise;
        return promise;
    };
    
    client = {
        from: () => ({
            select: mockBuilder,
            insert: () => Promise.resolve({ data: null, error: null }),
            update: () => Promise.resolve({ data: null, error: null }),
            delete: () => Promise.resolve({ data: null, error: null }),
        }),
        storage: {
            from: () => ({
                upload: () => Promise.resolve({ data: null, error: null }),
                getPublicUrl: () => ({ data: { publicUrl: '' } }),
            })
        },
        channel: () => ({
            on: () => ({
                subscribe: () => {}
            })
        }),
        removeChannel: () => {}
    };
}

export const supabase = client as any;
