'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';

export default function AuthButton() {
  const router = useRouter();

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Error:', error.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="flex gap-4">
      <button onClick={handleSignIn} className="py-2 px-4 rounded-md bg-gray-800 text-white">
        Sign In with GitHub
      </button>
      <button onClick={handleSignOut} className="py-2 px-4 rounded-md bg-red-600 text-white">
        Sign Out
      </button>
    </div>
  );
}
