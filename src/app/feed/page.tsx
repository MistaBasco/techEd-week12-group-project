// import LikeButton from "@/components/LikeButton";
// import CommentDisplay from "@/components/CommentDisplay";
import connect from "@/utilities/connect";
// import { revalidatePath } from "next/cache";
import ActivityComponent from "@/components/ActivityComponent";

export type Activity = {
  activity_id: number;
  user_id: number;
  film_id: number;
  activity_body?: string;
  activity_type: "watch" | "wtw" | "watch_from_wtw";
  created_at: Date;
};

export default async function Feed() {
  async function getActivities(): Promise<Activity[]> {
    const db = connect();
    const result = await db.query<Activity>(
      `SELECT * FROM activities ORDER BY created_at DESC`
    );
    return result.rows;
  }

  return (
    <>
      {(await getActivities()).map((element) => {
        return (
          <ActivityComponent key={element.activity_id} activity={element} />
        );
      })}
    </>
  );
}
