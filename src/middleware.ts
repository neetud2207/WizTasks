export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/assignments/:path*', '/profile/:path*', '/settings/:path*'],
};
