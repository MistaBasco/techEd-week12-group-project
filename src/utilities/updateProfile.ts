"use server";
import { currentUser } from "@clerk/nextjs/server";
import connect from "./connect";
import { getUserIdByClerkId } from "./getUserByClerkId";

type profileFields = {
  firstName: string;
  lastName: string;
  bio: string;
};

export async function updateProfile(formData: FormData) {
  "use server";
  const db = connect();
  const myUser = await currentUser();
  const myUserId = myUser ? await getUserIdByClerkId(myUser!.id) : null;

  const { firstName, lastName, bio } = Object.fromEntries(
    formData
  ) as profileFields;
  console.log(firstName, lastName, bio);
  try {
    const result = await db.query(
      "UPDATE users SET first_name = $1, last_name = $2, bio = $3 WHERE user_id = $4",
      [firstName, lastName, bio, myUserId]
    );
    console.log(result);
  } catch (error) {
    console.error("Error updating profile:", error);
  }
}
