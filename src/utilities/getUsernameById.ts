import connect from "./connect";

export default async function getUsernameById(
  user_id: number
): Promise<string> {
  const db = connect();
  const result = await db.query(
    `SELECT username FROM users WHERE user_id = $1`,
    [user_id]
  );
  const username = result.rows[0].username;
  return username as string;
}
