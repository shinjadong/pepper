import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from './types/database';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  try {
    const supabase = createMiddlewareClient<Database>({ req, res });
    await supabase.auth.getSession();
  } catch (e) {
    console.error('Supabase middleware error:', e);
  }
  
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
