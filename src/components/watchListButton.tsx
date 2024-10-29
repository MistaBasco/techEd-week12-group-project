"use client";

import { useState, useEffect } from "react";
import { Button, ButtonProps } from "@chakra-ui/react";
import connect from "@/utilities/connect";
import toggleWatchlist from "@/utilities/toggleWatchList";

type WatchlistButtonProps = {
  userId: number;
  filmId: number;
};

export default function WatchlistButton({
  userId,
  filmId,
  ...rest
}: WatchlistButtonProps & ButtonProps) {
  const [inWatchlist, setInWatchlist] = useState<boolean | null>(null);
  const db = connect(); // Get the database pool instance once

  useEffect(() => {
    // Check if the film is already in the user's watchlist
    const checkWatchlistStatus = async () => {
      try {
        const checkQuery = `
          SELECT 1 
          FROM wtw_films
          WHERE user_id = $1 AND film_id = $2;
        `;
        const result = await db.query(checkQuery, [userId, filmId]);

        // Add null/undefined safety check
        if (
          result?.rowCount !== null &&
          result?.rowCount !== undefined &&
          result.rowCount > 0
        ) {
          setInWatchlist(true);
        } else {
          setInWatchlist(false);
        }
      } catch (error) {
        console.error("Error fetching watchlist status:", error);
      }
    };
    checkWatchlistStatus();
  }, [userId, filmId]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const handleToggle = async () => {
    try {
      await toggleWatchlist({ userId, filmId });
      setInWatchlist((prev) => !prev); // Toggle the local state
    } catch (error) {
      console.error("Error toggling watchlist:", error);
    }
  };

  if (inWatchlist === null) {
    return (
      <Button disabled {...rest}>
        Loading...
      </Button>
    );
  }

  return (
    <Button onClick={handleToggle} {...rest}>
      {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
    </Button>
  );
}
