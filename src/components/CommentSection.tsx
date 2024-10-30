import { Collapsible } from "@chakra-ui/react";
import { SignedIn } from "@clerk/nextjs";
import CommentForm from "./CommentForm";
import connect from "@/utilities/connect";
import { currentUser } from "@clerk/nextjs/server";
import { getUserIdByClerkId } from "@/utilities/getUserByClerkId";
import CommentDisplay, { Comment } from "./CommentDisplay";

export default async function CommentSection({
  activity_id,
}: {
  activity_id: number;
}) {
  return (
    <section className="bg-gray-50 p-4 rounded-lg shadow-md space-y-4">
      <SignedIn>
        <Collapsible.Root>
          <Collapsible.Trigger className="text-blue-600 font-semibold cursor-pointer hover:underline">
            Comment on this activity
          </Collapsible.Trigger>
          <Collapsible.Content className="mt-4">
            <CommentForm
              submitComment={submitComment}
              activity_id={activity_id}
            />
          </Collapsible.Content>
        </Collapsible.Root>
      </SignedIn>
      <div className="mt-4">
        <CommentDisplay comments={await getComments(activity_id)} />
      </div>
    </section>
  );
}

async function getComments(post_id: number) {
  const db = connect();
  const result = await db.query<Comment>(
    `SELECT * FROM comments WHERE activity_id = $1`,
    [post_id]
  );
  return result.rows;
}

async function submitComment(myData: string, activity_id: number) {
  "use server";
  try {
    const db = connect();
    const myUser = await currentUser();
    let myUserId;
    if (myUser) {
      myUserId = await getUserIdByClerkId(myUser!.id); // todo: use context when available
    }
    await db.query(
      `INSERT INTO comments (body, user_id, activity_id) VALUES ($1, $2, $3)`,
      [myData, myUserId, activity_id]
    );
    return;
  } catch (e) {
    console.error(e);
  }
}
