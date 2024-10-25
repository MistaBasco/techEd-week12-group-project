import { Webhook } from "svix";
import { headers } from "next/headers";
import connect from "@/utilities/connect";

export const runtime = "nodejs";
export const preferredRegion = "auto";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

export async function POST(req) {
  console.log("Webhook received");

  // Check if the WEBHOOK_SECRET is available
  if (!WEBHOOK_SECRET) {
    console.error("Missing WEBHOOK_SECRET in environment variables.");
    throw new Error("Please add WEBHOOK_SECRET from Clerk Dashboard to .env");
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Log headers received
  console.log("Received headers:", {
    svix_id,
    svix_timestamp,
    svix_signature,
  });

  // Ensure the necessary headers are present
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing svix headers");
    return new Response("Missing svix headers", { status: 400 });
  }

  let payload;
  try {
    payload = await req.json();
    console.log("Parsed payload:", payload); // Log parsed payload
  } catch (error) {
    console.error("Error parsing request JSON:", error);
    return new Response("Invalid JSON format", { status: 400 });
  }

  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  // Verify the webhook payload
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
    console.log("Webhook verified successfully");
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return new Response("Webhook verification failed", { status: 400 });
  }

  const { type, data } = evt;
  console.log("Webhook type:", type);
  console.log("Event data:", data);

  if (type === "user.created") {
    const { id: clerk_id, email_addresses, username } = data;
    const email = email_addresses[0]?.email_address;
    console.log("Extracted user data:", { clerk_id, email, username });

    try {
      const db = connect();
      console.log("Database connection established");

      await db.query(
        `INSERT INTO users (clerk_id, email, username)
         VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING`,
        [clerk_id, email, username || email]
      );

      console.log("User added to database successfully");
      return new Response("User added to database", { status: 200 });
    } catch (error) {
      console.error("Error adding user to database:", error);
      return new Response("Database error", { status: 500 });
    }
  } else {
    console.warn("Unhandled webhook event type:", type);
    return new Response("Unhandled webhook event", { status: 400 });
  }
}
