import connect from "@/utilities/connect";

export default async function LikeCounter({
  activity_id,
}: {
  activity_id: number;
}) {
  const likes = await getLikes(activity_id);
  return (
    <p>
      {likes} {likes == 1 ? "like" : "likes"}
    </p>
  );
}

async function getLikes(activity_id: number): Promise<number> {
  const db = connect();
  const result = await db.query(
    `SELECT COUNT(*) FROM activity_likes WHERE activity_id = $1`,
    [activity_id]
  );
  return result.rows[0].count;
}
