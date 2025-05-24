import { NextRequest, NextResponse } from "next/server";

const excludedPaths = [
  '/forgot-password',
  '/reset-password',
];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const tokenCookie = req.cookies.get('token');
  const origin = req.nextUrl.origin;
  // const cookieStore = await cookies();

  // delete cookies if token is not present 
  // if(!tokenCookie) {
  //   const allCookies = cookieStore.getAll();
  //   if(allCookies.length > 0) {
  //     allCookies.forEach(cookie => {
  //       cookieStore.delete(cookie.name);
  //     })
  //   }
  // }

  // redirect to login page if cookie is not found
  if (!tokenCookie && (!excludedPaths.includes(pathname))) {
    return NextResponse.redirect(origin);
  }

  // do not let the user visit these pages if the user already has the token
  if (tokenCookie && (excludedPaths.includes(pathname))) {
    return NextResponse.redirect(`${origin}/dashboard`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/forgot-password', '/reset-password', '/budget/:path*', '/transactions']
}

// export default auth((req) => {
//   if (!req.auth && req.nextUrl.pathname !== "/sign-in") {
//     const newUrl = new URL("/sign-in", req.nextUrl.origin)
//     return Response.redirect(newUrl)
//   }
// })