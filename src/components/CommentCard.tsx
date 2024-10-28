import Image from "next/image";
import { Comment } from "./CommentDisplay";
import { revalidatePath } from "next/cache";
import connect from "@/utilities/connect";
import DeleteButton from "./DeleteButton";

type CommentCardProps = {
  comment: Comment;
  profile_image: string;
  username: string;
};

export default function CommentCard({
  comment,
  profile_image,
  username,
}: CommentCardProps) {
  return (
    <div
      key={comment.comment_id}
      className="flex gap-4 items-start mb-4 border-b pb-4 border-gray-300 relative"
    >
      <div className="w-10 h-10">
        <Image
          src={profile_image}
          alt="Profile"
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800">
          {username}
          {/* TODO add first and last name */}
        </p>

        <p className="text-sm text-gray-600 mt-1">{comment.body}</p>
      </div>
      <DeleteButton
        deleteFunc={handleDelete}
        postId={comment.comment_id}
        postType="comment"
      />
    </div>
  );
}

async function handleDelete(postId: number) {
  "use server";

  try {
    const db = connect();
    const result = await db.query(
      "DELETE FROM comments WHERE activity_id = $1",
      [postId]
    );
    console.log(result);
  } catch (e) {
    console.error(e);
  }

  revalidatePath(`/feed`); // TODO change this to current path
}
