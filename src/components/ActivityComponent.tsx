import { Activity } from "@/app/feed/page";
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
import CommentSection from "./CommentSection";
import CommentCounter from "./CommentCounter";
import LikeCounter from "./LikeCounter";
import FollowButton from "./FollowButton";

export default async function ActivityComponent({
  activity,
  showComments = false,
}: {
  activity: Activity;
  showComments?: boolean;
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

  const filmLink = (
    <Link className="underline" href={`/films/${film_id}`}>
      {film.title}
    </Link>
  );

  // translate activity types to a phrase to display
  let verb = <></>;
  if (activity_type === "watch") {
    verb = <span>watched {filmLink}</span>;
  } else if (activity_type === "wtw") {
    verb = <span>added {filmLink} to their want-to-watch list</span>;
  } else if (activity_type === "watch_from_wtw") {
    verb = <span>watched {filmLink} from their want-to-watch list</span>;
  }

  return (
    <div className="bg-slate-400 rounded-xl p-4 m-1">
      <p id={`activity#${activity_id}`}>
        {username} {verb}
      </p>
      <Timestamp timestamp={created_at} />
      {activity_body ? (
        <p>
          {username}: {activity_body}
        </p>
      ) : null}
      <SignedIn>
        <LikeButton
          postId={activity_id}
          userId={myUserId!}
          likeFunc={updateLikes}
          checkIfLiked={checkIfLiked}
        />
      </SignedIn>
      <LikeCounter activity_id={activity_id} />
      <SignedIn>
        <div className="relative w-full h-full">
          <DeleteButton
            deleteFunc={handleDelete}
            postId={activity_id}
            postType="activity"
          />
        </div>
        <FollowButton user_id={user_id} />
        {showComments ? (
          <CommentSection activity_id={activity_id} />
        ) : (
          <CommentCounter activity_id={activity_id} />
        )}
      </SignedIn>
    </div>
  );
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
