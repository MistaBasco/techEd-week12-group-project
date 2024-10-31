"use client";

import { useState } from "react";
import { ButtonProps } from "@chakra-ui/react";
import { Button } from "./ui/button";
import { useUser } from "@clerk/nextjs";
type WatchedListButtonProps = {
  filmId: number;
  onStatusChange: (status: "added to watched" | "removed from watched") => void;
  isWatched: boolean;
} & ButtonProps;

export default function WatchedListButton(props: WatchedListButtonProps) {
  const { filmId, onStatusChange, isWatched, ...buttonProps } = props;
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  let postUserId = "0";
  if (user) {
    postUserId = user.id;
  }

  async function handleToggleWatched() {
    setLoading(true);
    try {
      const response = await fetch("/api/toggle-watched", {
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
      const newStatus = data.message.includes("added to watched")
        ? "added to watched"
        : "removed from watched";
      onStatusChange(newStatus);
      if (response.ok && newStatus === "added to watched") {
        // Log activity when a film is added to watched list
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/log-activity`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filmId,
            postUserId,
            activityType: "watch",
          }),
        });
      }
      console.log("newStatus: ", newStatus);
      if (newStatus === "added to watched") {
        // Ensure the film is removed from the watchlist if added to the watched list
        onStatusChange("removed from watched");
      } // Update parent component state
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Button onClick={handleToggleWatched} variant="outline" {...buttonProps}>
      {loading
        ? "Loading..."
        : isWatched
        ? "Remove from Watched List"
        : "Add to Watched List"}
    </Button>
  );
}
