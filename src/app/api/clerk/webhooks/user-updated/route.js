import { Webhook } from "svix";
import { headers } from "next/headers";
import connect from "@/utilities/connect";

export const runtime = "nodejs"; // Specifies the runtime environment for the function. Use 'nodejs' or 'edge' depending on requirements.
export const preferredRegion = "auto"; // Determines the preferred region for executing the function. 'auto' allows the platform to select the optimal region.

const WEBHOOK_SECRET = process.env.USER_UPDATED_WEBHOOK_SECRET; // Fetch the webhook secret from environment variables for verifying incoming webhooks.

export async function POST(req) {
  // Ensure the WEBHOOK_SECRET is available
  if (!WEBHOOK_SECRET) {
    throw new Error("Please add WEBHOOK_SECRET from Clerk Dashboard to .env"); // Throws an error if the webhook secret is missing, indicating a configuration issue.
  }

  const headerPayload = headers(); // Retrieve headers from the incoming request.
  const svix_id = headerPayload.get("svix-id"); // Get the 'svix-id' header used to identify the request.
  const svix_timestamp = headerPayload.get("svix-timestamp"); // Get the 'svix-timestamp' header to timestamp the request.
  const svix_signature = headerPayload.get("svix-signature"); // Get the 'svix-signature' header to verify the authenticity of the request.

  // Ensure the necessary headers are present
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 }); // Return a 400 response if any required headers are missing.
  }

  const payload = await req.json(); // Parse the request body as JSON to get the webhook payload.
  const body = JSON.stringify(payload); // Convert the parsed payload back to a string for verification purposes.

  const wh = new Webhook(WEBHOOK_SECRET); // Create a new instance of the Webhook class using the secret for verification.

  let evt;

  // Verify the webhook payload
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }); // Attempt to verify the webhook using the payload and headers.
  } catch (error) {
    console.error("Error verifying webhook:", error); // Log any errors that occur during verification.
    return new Response("Webhook verification failed", { status: 400 }); // Return a 400 response if verification fails.
  }

  const { type, data } = evt; // Destructure the event type and data from the verified event object.

  if (type === "user.updated") {
    // Check if the event type is 'user.updated'.
    const { id: clerk_id, profile_image_url } = data; // Extract the necessary fields from the event data.

    if (!profile_image_url) {
      return new Response("No profile image to update", { status: 400 }); // Return a 400 response if there is no profile image to update.
    }

    try {
      const db = connect(); // Connect to the database.
      // Update the user's profile image URL in the database
      await db.query(
        `UPDATE users SET profile_image_url = $1 WHERE clerk_id = $2`,
        [profile_image_url, clerk_id]
      );
      return new Response("User profile image updated", { status: 200 }); // Return a 200 response if the user's profile image URL was successfully updated.
    } catch (error) {
      console.error("Error updating user profile image in database:", error); // Log any errors that occur while updating the user in the database.
      return new Response("Database error", { status: 500 }); // Return a 500 response if there was a database error.
    }
  } else {
    return new Response("Unhandled webhook event", { status: 400 }); // Return a 400 response if the event type is not handled.
  }
}
