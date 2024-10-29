import getUsernameById from "@/utilities/getUsernameById";
import connect from "@/utilities/connect";
import CommentCard from "./CommentCard";

export type Comment = {
  comment_id: number;
  body: string;
  user_id: number;
  activity_id: number;
  created_at: Date;
};

type CommentDisplayProps = {
  comments: Comment[];
};

export default function CommentDisplay({ comments }: CommentDisplayProps) {
  return (
    <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Comments</h3>
      {comments.length > 0 ? (
        comments.map(async (comment: Comment) => {
          const username = await getUsernameById(comment.user_id);
          const db = connect();
          const result = await db.query<{ profile_image_url: string }>(
            `SELECT profile_image_url FROM users WHERE user_id = $1`,
            [comment.user_id]
          );
          const profile_image = result.rows[0].profile_image_url;
          return (
            <CommentCard
              key={comment.comment_id}
              comment={comment}
              profile_image={profile_image}
              username={username}
            />
          );
        })
      ) : (
        <p className="text-gray-500">No comments yet.</p>
      )}
    </div>
  );
}
