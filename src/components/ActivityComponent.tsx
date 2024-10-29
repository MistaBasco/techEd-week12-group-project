import { Activity } from "@/app/feed/page";
import CommentDisplay, { Comment } from "./CommentDisplay";
import getFilmById from "@/utilities/getFilmById";
import getUsernameById from "@/utilities/getUsernameById";
import Timestamp from "./Timestamp";
import connect from "@/utilities/connect";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import DeleteButton from "./DeleteButton";
import LikeButton from "./LikeButton";
import { currentUser } from "@clerk/nextjs/server";
import { getUserIdByClerkId } from "@/utilities/getUserByClerkId";
import { SignedIn } from "@clerk/nextjs";

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

  const username = await getUsernameById(user_id); // username of activity's owner
  const film = await getFilmById(film_id);

  const myUser = await currentUser();
  let myUserId;
  if (myUser) {
    myUserId = await getUserIdByClerkId(myUser!.id); // todo: use context when available
  }

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
    <div className="relative">
      <p id={`activity#${activity_id}`}>
        {username} {verb} {<Link href={`/films/${film_id}`}>{film.title}</Link>}
      </p>
      <Timestamp timestamp={created_at} />
      {activity_body ? (
        <p>
          {username}: {activity_body}
        </p>
      ) : (
        <></>
      )}
      <SignedIn>
        <LikeButton
          postId={activity_id}
          userId={myUserId!}
          likeFunc={updateLikes}
          checkIfLiked={checkIfLiked}
        />
        <DeleteButton
          deleteFunc={handleDelete}
          postId={activity_id}
          postType="activity"
        />
      </SignedIn>
      <CommentDisplay comments={await getComments(activity_id)} />
    </div>
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

async function handleDelete(postId: number) {
  "use server";

  try {
    const db = connect();
    const result = await db.query(
      "DELETE FROM activities WHERE activity_id = $1",
      [postId]
    );
    console.log(result);
  } catch (e) {
    console.error(e);
  }

  revalidatePath(`/feed`); // TODO change this to current path
}

async function updateLikes(
  postId: number,
  userId: number,
  hasLiked: boolean,
  postType: "activity" | "comment"
) {
  "use server";
  const db = connect();
  if (hasLiked == true) {
    await db.query(
      `DELETE FROM ${postType}_likes WHERE ${postType}_id = $1 AND user_id = $2`,
      [postId, userId]
    );
  } else {
    await db.query(
      `INSERT INTO ${postType}_likes (${postType}_id, user_id) VALUES ($1, $2)`,
      [postId, userId]
    );
  }
  revalidatePath("/feed");
}

async function checkIfLiked(
  postId: number,
  userId: number,
  postType: "activity" | "comment"
) {
  "use server";
  const db = connect();
  const result = await db.query(
    `SELECT * FROM ${postType}_likes WHERE ${postType}_id = $1 AND user_id = $2`,
    [postId, userId]
  );
  return result.rows.length > 0;
}
