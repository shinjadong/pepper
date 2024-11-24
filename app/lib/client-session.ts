import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const supabaseClient = createClientComponentClient();

export async function getClientSession() {
  try {
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) throw error;
}
