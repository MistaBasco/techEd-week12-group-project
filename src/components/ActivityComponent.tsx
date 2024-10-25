import { Activity } from "@/app/feed/page";
import CommentDisplay, { Comment } from "./CommentDisplay";
import getFilmById from "@/utilities/getFilmById";
import getUsernameById from "@/utilities/getUsernameById";
import Timestamp from "./Timestamp";
import connect from "@/utilities/connect";

export default async function ActivityComponent({
  activity,
}: {
  activity: Activity;
}) {
  const {
    activity_id,
    user_id,
    film_id,
    activity_body,
    activity_type,
    created_at,
  } = activity;

  const username = await getUsernameById(user_id);
  const film = await getFilmById(film_id);

  // translate activity types to a phrase to display
  let verb = "";
  if (activity_type === "watch") {
    verb = "watched";
  } else if (activity_type === "wtw") {
    verb = "added to their want-to-watch list";
  } else if (activity_type === "watch_from_wtw") {
    verb = "watched their wanted film";
  }

  return (
    <>
      <p id={`activity#${activity_id}`}>
        {username} {verb} {film.title}
      </p>
      <Timestamp timestamp={created_at} />
      {activity_body ? (
        <p>
          {username}: {activity_body}
        </p>
      ) : (
        <></>
      )}
      <CommentDisplay comments={await getComments(activity_id)} />
    </>
  );

  async function getComments(post_id: number) {
    const db = connect();
    const result = await db.query<Comment>(
      `SELECT * FROM comments WHERE activity_id = $1`,
      [post_id]
    );
    return result.rows;
  }
}
