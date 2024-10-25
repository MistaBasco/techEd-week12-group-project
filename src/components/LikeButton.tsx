"use client";
import { useState, useEffect } from "react";

export default function LikeButton({
  postId,
  userId,
  serverAction,
  checkIfLiked,
}) {
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    async function checkLikes() {
      const result = await checkIfLiked(postId, userId);
      setHasLiked(result);
    }
    checkLikes();
  }, [postId, userId]);

  

  async function handleClick() {
    serverAction(postId, userId, hasLiked);
    setHasLiked(!hasLiked);
  }

  return (
    <div>
      <button onClick={handleClick}>{hasLiked ? "Liked" : "Like"}</button>
    </div>
  );
}