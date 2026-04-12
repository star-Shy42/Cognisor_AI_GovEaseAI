import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from './lib/auth.js';

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/api/govease') && !pathname.includes('/services')) {
    // govease requires auth
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || request.cookies.get('token')?.value;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    
    // Create new request with headers
    const newHeaders = new Headers(request.headers);
    newHeaders.set('x-user-id', payload.userId);
    newHeaders.set('x-user-email', payload.email);
    
    const newRequest = new NextRequest(request.url, {
      ...request,
      headers: newHeaders,
    });
    
    return NextResponse.next({
      request: newRequest,
    });
  }
  // Admin APIs public for demo - no auth
  else if (pathname.startsWith('/api/admin')) {
    console.log('Admin API access - public for demo');
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/govease/:path*',
    '/api/admin/:path*'
  ]
};

