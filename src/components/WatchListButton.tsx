"use client";

import { useState } from "react";
import { Button, ButtonProps } from "@chakra-ui/react";

type WatchlistButtonProps = {
  filmId: number;
  isInWatchlist: boolean;
  onStatusChange: (status: "added" | "removed") => void;
} & ButtonProps;

export default function WatchlistButton(props: WatchlistButtonProps) {
  const { filmId, isInWatchlist, onStatusChange, ...buttonProps } = props;
  const [loading, setLoading] = useState(false);

  async function handleToggleWatchlist() {
    setLoading(true);
    try {
      const response = await fetch("/api/toggle-wtw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filmId }),
      });
      if (!response.ok) {
        console.error("Request failed with status:", response.status);
        return;
      }

      const data = await response.json();
      const newStatus = data.message.includes("added") ? "added" : "removed";
      onStatusChange(newStatus);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleToggleWatchlist} variant="outline" {...buttonProps}>
      {loading
        ? "Loading..."
        : isInWatchlist
        ? "Remove from Watchlist"
        : "Add to Watchlist"}
    </Button>
  );
}
