"use client";

import { useState } from "react";
import { Button, ButtonProps } from "@chakra-ui/react";

type WatchlistButtonProps = {
  filmId: number;
};

export default function WatchlistButton(
  props: WatchlistButtonProps & ButtonProps
) {
  const { filmId } = props;
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"added" | "removed" | null>(null);

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
        setStatus(null);
        return;
      }

      const data = await response.json();
      if (data && data.message) {
        setStatus(data.message.includes("added") ? "added" : "removed");
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleToggleWatchlist} colorScheme="teal">
      {loading
        ? "Loading..."
        : status === "added"
        ? "Remove from Watchlist"
        : "Add to Watchlist"}
    </Button>
  );
}
