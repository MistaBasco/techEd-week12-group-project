"use server";
import { currentUser } from "@clerk/nextjs/server";
import connect from "./connect";
import { getUserIdByClerkId } from "./getUserByClerkId";

export async function addToFollows(user_id: number): Promise<boolean> {
  const myUser = await currentUser();
  const myUserId = myUser ? await getUserIdByClerkId(myUser!.id) : null;

  if (myUserId && !(await checkIfFollowing(user_id))) {
    try {
      const db = connect();
      db.query(
        `INSERT INTO follows (follower_id, followed_id) VALUES ($1, $2)`,
        [myUserId, user_id]
      );
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export async function checkIfFollowing(user_id: number): Promise<boolean> {
  const myUser = await currentUser();
  const myUserId = myUser ? await getUserIdByClerkId(myUser!.id) : null;

  if (myUserId) {
    try {
      const db = connect();
      const result = db.query(
        `SELECT * FROM follows WHERE follower_id = $1 AND followed_id = $2`,
        [myUserId, user_id]
      );
      if ((await result).rows.length > 0) {
        return true;
      }
    } catch {
      return false;
    }
  }
  return false;
}

export async function deleteFromFollows(user_id: number): Promise<boolean> {
  const myUser = await currentUser();
  const myUserId = myUser ? await getUserIdByClerkId(myUser!.id) : null;

  if (myUserId && (await checkIfFollowing(user_id))) {
    try {
      const db = connect();
      db.query(
        `DELETE FROM follows WHERE follower_id = $1 AND followed_id = $2`,
        [myUserId, user_id]
      );
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export async function getAllFollows(user_id: number) {
  const db = connect();
  const result = await db.query<FollowRelation & User>(
    `SELECT * FROM follows INNER JOIN users ON followed_id = users.user_id WHERE follower_id = $1`,
    [user_id]
  );
  return result.rows;
}

export type FollowRelation = {
  following_id: number;
  follower_id: number;
  created_at: Date;
};

export type User = {
  user_id: number;
  username: string;
  clerk_id: string;
  profile_image_url?: string;
  first_name?: string;
  last_name?: string;
};
