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
  // async function handleDelete(postId: number) {
  //   "use server";

  //   try {
  //     const db = connect();
  //     const result = await db.query(
  //       "DELETE FROM comments WHERE activity_id = $1",
  //       [postId]
  //     );
  //     console.log(result);
  //   } catch (e) {
  //     console.error(e);
  //   }

  //   revalidatePath(`/feed`);
  // }

  // async function updateLikes(
  //   postId: number,
  //   userId: number,
  //   hasLiked: boolean
  // ) {
  //   "use server";
  //   const db = connect();
  //   if (hasLiked == true) {
  //     await db.query(`DELETE FROM likes WHERE post_id = $1 AND user_id = $2`, [
  //       postId,
  //       userId,
  //     ]);
  //   } else {
  //     await db.query(`INSERT INTO likes (post_id, user_id) VALUES ($1, $2)`, [
  //       postId,
  //       userId,
  //     ]);
  //   }
  //   revalidatePath("/feed");
  // }

  // async function checkIfLiked(postId: number, userId: number) {
  //   "use server";
  //   const db = connect();
  //   const result = await db.query(
  //     `SELECT * FROM likes WHERE post_id = $1 AND user_id = $2`,
  //     [postId, userId]
  //   );
  //   return result.rows.length > 0;
  // }

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
