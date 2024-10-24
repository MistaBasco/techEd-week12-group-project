"use server";
import connect from "@/utilities/connect";

export async function getUserIdByClerkId(clerkId: string): Promise<number> {
  const db = connect();

  try {
    const result = await db.query(
      "SELECT user_id FROM users WHERE clerk_id = $1",
      [clerkId]
    );

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    return result.rows[0].user_id;
  } catch (error) {
    console.error("Error fetching user_id:", error);
    throw new Error("Failed to retrieve user_id");
  }
}
