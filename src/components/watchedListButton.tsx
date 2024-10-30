"use client";

import { useState, useEffect } from "react";
import { Button, ButtonProps } from "@chakra-ui/react";
import { checkWatchedListStatus } from "@/utilities/checkWatchedListStatus";
import toggleWatchedList from "@/utilities/toggleWatchedList";

type WatchedListButtonProps = {
  userId: number;
  filmId: number;
} & ButtonProps;

export default function WatchedListButton({
  userId,
  filmId,
  ...rest
}: WatchedListButtonProps) {
  const [inWatchedList, setInWatchedList] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if the film is already in the user's watched list
    async function fetchStatus() {
      const status = await checkWatchedListStatus(userId, filmId);
      setInWatchedList(status);
    }
    fetchStatus();
  }, [userId, filmId]);

  async function handleToggle() {
    try {
      await toggleWatchedList({ userId, filmId });
      setInWatchedList((prev) => !prev); // Toggle the local state
    } catch (error) {
      console.error("Error toggling watched list:", error);
    }
  }

  if (inWatchedList === null) {
    return (
      <Button disabled {...rest}>
        Loading...
      </Button>
    );
  }

  return (
    <Button onClick={handleToggle} {...rest}>
      {inWatchedList ? "Remove from Watched List" : "Add to Watched List"}
    </Button>
  );
}
