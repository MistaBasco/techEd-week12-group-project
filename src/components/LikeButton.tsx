"use client";
import { useState, useEffect } from "react";

type LikeButtonProps = {
  postId: number;
  userId: number;
  likeFunc: (postId: number, userId: number, hasLiked: boolean) => void;
  checkIfLiked: (postId: number, userId: number) => boolean;
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
      const result = await checkIfLiked(postId, userId);
      setHasLiked(result);
    }
    checkLikes();
  }, [postId, userId, checkIfLiked]);

  async function handleClick() {
    likeFunc(postId, userId, hasLiked);
    setHasLiked(!hasLiked);
  }

  return (
    <div>
      <button onClick={handleClick}>{hasLiked ? "Liked" : "Like"}</button>
    </div>
  );
}
