"use client";
import {
  addToFollows,
  checkIfFollowing,
  deleteFromFollows,
} from "@/utilities/followFuncs";
import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function FollowButton({ user_id }: { user_id: number }) {
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    async function updateState() {
      setFollowing(await checkIfFollowing(user_id));
    }
    updateState();
  }, [user_id]);

  async function handleClick() {
    if (!following) {
      const result = await addToFollows(user_id);
      if (result) {
        setFollowing(true);
      }
      return;
    } else {
      const result = await deleteFromFollows(user_id);
      if (result) {
        setFollowing(false);
      }
      return;
    }
  }

  return (
    <Button onClick={handleClick}>{following ? "Following" : "Follow"}</Button>
  );
}
