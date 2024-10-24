import { Webhook } from "svix";
import { headers } from "next/headers";
import connect from "@/utilities/connect";

export const runtime = "nodejs"; // or 'edge' depending on your needs
export const preferredRegion = "auto";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

export async function POST(req) {
  if (!WEBHOOK_SECRET) {
    throw new Error("Please add WEBHOOK_SECRET from Clerk Dashboard to .env");
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Ensure the necessary headers are present
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
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
  } catch (error) {
    console.error("Error verifying webhook:", error);
    return new Response("Webhook verification failed", { status: 400 });
  }

  const { type, data } = evt;

  if (type === "user.created") {
    const { id: clerk_id, email_addresses, username } = data;
    const email = email_addresses[0]?.email_address;

    try {
      const db = connect();
      // Insert the new user into the database
      await db.query(
        `INSERT INTO users (clerk_id, email, username)
         VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING`,
        [clerk_id, email, username || email]
      );
      return new Response("User added to database", { status: 200 });
    } catch (error) {
      console.error("Error adding user to database:", error);
      return new Response("Database error", { status: 500 });
    }
  } else {
    return new Response("Unhandled webhook event", { status: 400 });
  }
}
