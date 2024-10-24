import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: [
    // add public routes here!
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/api/review/:path*"],
};
