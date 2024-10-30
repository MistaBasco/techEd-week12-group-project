import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserIdByClerkId } from "@/utilities/getUserByClerkId";
import connect from "@/utilities/connect";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filmId = searchParams.get("filmId");

  if (!filmId) {
    return NextResponse.json(
      { message: "Film ID is required" },
      { status: 400 }
    );
  }

  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = await getUserIdByClerkId(user.id);
    const db = connect();

    // Check if the film is in the watched list
    const watchedResult = await db.query(
      "SELECT 1 FROM watched_films WHERE user_id = $1 AND film_id = $2",
      [userId, Number(filmId)]
    );

    // Check if the film is in the watchlist
    const watchlistResult = await db.query(
      "SELECT 1 FROM wtw_films WHERE user_id = $1 AND film_id = $2",
      [userId, Number(filmId)]
    );

    return NextResponse.json({
      isWatched:
        watchedResult?.rowCount !== null &&
        watchedResult?.rowCount !== undefined &&
        watchedResult.rowCount > 0,
      isInWatchlist:
        watchlistResult?.rowCount !== null &&
        watchlistResult?.rowCount !== undefined &&
        watchlistResult.rowCount > 0,
    });
  } catch (error) {
    console.error("Error checking film status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
