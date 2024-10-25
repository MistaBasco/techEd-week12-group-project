import getUsernameById from "@/utilities/getUsernameById";
// import Image from "next/image";

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
        comments.map(async (comment) => {
          const username = await getUsernameById(comment.user_id);
          return (
            <div
              key={comment.comment_id}
              className="flex gap-4 items-start mb-4 border-b pb-4 border-gray-300"
            >
              <div className="w-10 h-10">
                {
                  /* <Image
                src={comment.profile_image}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full"
              /> */
                  // TODO get profile picture from clerk by user_id
                }
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {username}
                  {/* TODO add first and last name */}
                </p>

                <p className="text-sm text-gray-600 mt-1">{comment.body}</p>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500">No comments yet.</p>
      )}
    </div>
  );
}
