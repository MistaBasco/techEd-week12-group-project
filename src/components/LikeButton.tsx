"use client";
import { useState, useEffect } from "react";

type LikeButtonProps = {
  postId: number;
  userId: number;
  likeFunc: (
    postId: number,
    userId: number,
    hasLiked: boolean,
    postType: "activity" | "comment"
  ) => void;
  checkIfLiked: (
    postId: number,
    userId: number,
    postType: "activity" | "comment"
  ) => Promise<boolean>;
};

export default function LikeButton({
  postId,
  userId,
  likeFunc,
  checkIfLiked,
}: LikeButtonProps) {
  const [hasLiked, setHasLiked] = useState<boolean>(false);

  useEffect(() => {
    async function checkLikes() {
      const result = await checkIfLiked(postId, userId, "activity");
      setHasLiked(result);
    }
    checkLikes();
  }, [postId, userId, checkIfLiked]);

  async function handleClick() {
    likeFunc(postId, userId, hasLiked, "activity");
    setHasLiked(!hasLiked);
  }

  return (
    <div>
      <button onClick={handleClick}>{hasLiked ? "Liked" : "Like"}</button>
    </div>
  );
}
