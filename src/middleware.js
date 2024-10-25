import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: ["/signup", "/signin", "/api/clerk/webhooks/user-created"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
};
