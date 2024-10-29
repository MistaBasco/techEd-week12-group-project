"use client";

import { useState, useEffect } from "react";
import { Button, ButtonProps } from "@chakra-ui/react";
import connect from "@/utilities/connect";
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
  const db = connect(); // Get the database pool instance once

  useEffect(() => {
    // Check if the film is already in the user's watched list
    const checkWatchedListStatus = async () => {
      try {
        const checkQuery = `
          SELECT 1 
          FROM watched_films
          WHERE user_id = $1 AND film_id = $2;
        `;
        const result = await db.query(checkQuery, [userId, filmId]);
        setInWatchedList(
          result?.rowCount !== null &&
            result?.rowCount !== undefined &&
            result.rowCount > 0
        );
      } catch (error) {
        console.error("Error fetching watched list status:", error);
      }
    };
    checkWatchedListStatus();
  }, [userId, filmId]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const handleToggle = async () => {
    try {
      await toggleWatchedList({ userId, filmId });
      setInWatchedList((prev) => !prev); // Toggle the local state
    } catch (error) {
      console.error("Error toggling watched list:", error);
    }
  };

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
