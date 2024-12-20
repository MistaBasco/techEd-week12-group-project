import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: [
    "/signup",
    "/signin",
    "/api/clerk/webhooks/user-created",
    "/api/clerk/webhooks/user-updated",
  ],
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // all routes except Next.js internal and files
    "/api/clerk/webhooks/user-created",
    "/api/clerk/webhooks/user-updated",
  ],
};
