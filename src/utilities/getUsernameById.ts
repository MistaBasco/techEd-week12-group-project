import connect from "./connect";

export default async function getUsernameById(
  user_id: number
): Promise<string> {
  const db = connect();
  const result = await db.query<{ username: string }>(
    `SELECT username FROM users WHERE user_id = $1`,
    [user_id]
  );
  if (result.rows.length === 0) {
    throw new Error("That user could not be found.");
  }
  const username = result.rows[0].username;
  return username;
}
