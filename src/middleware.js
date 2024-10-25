import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: [
    //    Add public routes here!
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/api/review/:path*"],
};
