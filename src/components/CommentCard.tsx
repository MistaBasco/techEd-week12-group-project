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
    <div className="flex gap-4 items-start mb-6 p-4 rounded-lg bg-gray-50 shadow-md relative">
      <div className="w-12 h-12">
        <Image
          src={profile_image}
          alt="Profile"
          width={48}
          height={48}
          className="rounded-full"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800">{username}</p>
          <DeleteButton
            deleteFunc={handleDelete}
            postId={comment.comment_id}
            postType="comment"
          />
        </div>
        <p className="text-sm text-gray-600 mt-1">{comment.body}</p>
      </div>
    </div>
  );
}

async function handleDelete(postId: number) {
  "use server";

  try {
    const db = connect();
    const result = await db.query(
      "DELETE FROM comments WHERE comment_id = $1",
      [postId]
    );
    console.log(result);
  } catch (e) {
    console.error(e);
  }

  revalidatePath(`/feed`); // TODO change this to current path
}
