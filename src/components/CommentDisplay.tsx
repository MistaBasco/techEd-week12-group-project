"use client";
import { useState, useEffect } from "react";
// import Image from "next/image";

type Comment = {
  comment_id: number;
  body: string;
  user_id: number;
  activity_id: number;
  created_at: Date;
};

type CommentDisplayProps = {
  postId: number;
  getComments: (postId: number) => Comment[];
};

export default function CommentDisplay({
  postId,
  getComments,
}: CommentDisplayProps) {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    async function fetchComments() {
      const result = await getComments(postId);
      if (result && result.length > 0) {
        setComments(result);
        console.log("Comments state set:", result);
      }
    }
    fetchComments();
  }, [postId, getComments]);

  console.log("Current comments state:", comments);

  return (
    <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Comments</h3>
      {comments.length > 0 ? (
        comments.map((comment) => (
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
              {
                /* <p className="text-sm font-semibold text-gray-800">
                {comment.first_name} {comment.last_name}
              </p> */
                // TODO get first and last name from clerk by user_id
              }
              <p className="text-sm text-gray-600 mt-1">{comment.body}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No comments yet.</p>
      )}
    </div>
  );
}
