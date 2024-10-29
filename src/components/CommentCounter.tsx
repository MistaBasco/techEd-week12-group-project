import connect from "@/utilities/connect";
import Link from "next/link";

export default async function CommentCounter({
  activity_id,
}: {
  activity_id: number;
}) {
  async function countComments(activity_id: number): Promise<number> {
    const db = connect();
    const result = await db.query(
      `SELECT COUNT(*) FROM comments WHERE activity_id = $1`,
      [activity_id]
    );
    return result.rows[0].count;
  }

  return (
    <p>
      <Link className="underline" href={`/feed/${activity_id}`}>
        {await countComments(activity_id)} comments
      </Link>
    </p>
  );
}
