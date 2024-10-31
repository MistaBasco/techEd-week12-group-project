import UserProfile from "@/components/UserProfile";
import { getUserIdByClerkId } from "@/utilities/getUserByClerkId";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function Profile() {
  const myUser = await currentUser();
  const myUserId = myUser ? await getUserIdByClerkId(myUser!.id) : null;
  if (myUserId === null) {
    notFound();
  }
  return <UserProfile user_id={myUserId} />;
}
