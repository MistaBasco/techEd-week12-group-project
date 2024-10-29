import connect from "@/utilities/connect";
import ActivityComponent from "@/components/ActivityComponent";
import { getUserIdByClerkId } from "@/utilities/getUserByClerkId";
import { currentUser } from "@clerk/nextjs/server";

export type Activity = {
  activity_id: number;
  user_id: number;
  film_id: number;
  activity_body?: string;
  activity_type: "watch" | "wtw" | "watch_from_wtw";
  created_at: Date;
};

export default async function Feed({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  async function getActivities(): Promise<Activity[]> {
    const db = connect();
    const result = await db.query<Activity>(
      `SELECT * FROM activities ORDER BY created_at DESC`
    );
    return result.rows;
  }

  async function getFollowedActivities(): Promise<Activity[]> {
    const db = connect();

    const myUser = await currentUser();
    let myUserId;
    if (myUser) {
      myUserId = await getUserIdByClerkId(myUser!.id); // todo: use context when available
    }

    const result = await db.query<Activity>(
      `SELECT activity_id, user_id, film_id, activity_body, activity_type, activities.created_at FROM follows INNER JOIN activities ON followed_id = user_id WHERE follower_id = $1;`,
      [myUserId]
    );
    return result.rows;
  }

  const showFollowingOnly =
    (await searchParams).following === "true" ? true : false;

  return (
    <>
      {showFollowingOnly
        ? (await getFollowedActivities()).map((element) => {
            return (
              <ActivityComponent key={element.activity_id} activity={element} />
            );
          })
        : (await getActivities()).map((element) => {
            return (
              <ActivityComponent key={element.activity_id} activity={element} />
            );
          })}
      {}
    </>
  );
}
