"use client";

import Link from "next/link";
import Image from "next/image";
import { Film } from "@/utilities/getFilmById";
import WatchlistButton from "./WatchListButton";
import WatchedListButton from "./WatchedListButton";
import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { getUserIdByClerkId } from "@/utilities/getUserByClerkId";
import { Grid } from "@chakra-ui/react";

type FilmCardProps = {
  film: Film;
};

export default function FilmCard({ film }: FilmCardProps) {
  // console.log("FilmCard film data:", film);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const { userId: clerkId } = useAuth();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const response = await fetch(
          `/api/check-watch-status?filmId=${film.film_id}`
        );
        const data = await response.json();
        setIsInWatchlist(data.isInWatchlist);
        setIsWatched(data.isWatched);
      } catch (error) {
        console.error("Error fetching film status:", error);
      }
    }

    fetchStatus();
  }, [film.film_id]);

  useEffect(() => {
    // Pull user ID from ClerkID -- Used to conditionally render buttons
    async function fetchUserId() {
      if (clerkId) {
        const dbUserId = await getUserIdByClerkId(clerkId);
        setUserId(dbUserId);
      }
    }
    fetchUserId();
  }, [clerkId]);

  const handleWatchlistUpdate = (status: "added" | "removed") =>
    setIsInWatchlist(status === "added");

  const handleWatchedUpdate = (
    status: "added to watched" | "removed from watched"
  ) => setIsWatched(status === "added to watched");

  const imageUrl = film.poster_path ? film.poster_path : "/placeholder.png";

  return (
    <div className="bg-white/20 rounded-lg shadow-md overflow-hidden w-64 m-4">
      <div className="relative h-96">
        <Image
          src={imageUrl}
          alt={film.title}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold">{film.title}</h2>
        <p className="text-sm text-white-500">
          Directed by: {film.director || "Unknown"}
        </p>
        <p className="text-white-500 text-sm mt-2">
          {film.overview
            ? `${film.overview.substring(0, 100)}...`
            : "No description available."}
        </p>
        <div className="flex items-center mt-3">
          <span className="text-[#eab308]">
            {"★".repeat(Math.round(film.vote_average / 2))}
            {"☆".repeat(5 - Math.round(film.vote_average / 2))}
          </span>
          <span className="text-white-500 text-sm ml-2">
            {typeof film.vote_average === "number"
              ? film.vote_average.toFixed(1)
              : parseFloat(film.vote_average as unknown as string).toFixed(1)}
            /10
          </span>
        </div>
        <Grid>
          {/* <div className="mt-4 px-2 flex justify-between"> */}
          {/* <button className="bg-green-500 text-white py-2 px-4 mr-2 rounded-md hover:bg-green-600">
            Add to Favorites
          </button> */}
          {userId && (
            <>
              <WatchlistButton
                filmId={film.film_id}
                isInWatchlist={isInWatchlist}
                onStatusChange={handleWatchlistUpdate}
              />
              <WatchedListButton
                filmId={film.film_id}
                isWatched={isWatched}
                onStatusChange={handleWatchedUpdate}
              />
            </>
          )}
          <Link href={`/films/${film.film_id}`}>
            <p className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 text-center">
              View Details
            </p>
          </Link>
          {/* </div> */}
        </Grid>
      </div>
    </div>
  );
}
