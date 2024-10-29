import connect from "@/utilities/connect";

type ToggleWatchlistProps = {
  userId: number;
  filmId: number;
};

export default async function toggleWatchlist({
  userId,
  filmId,
}: ToggleWatchlistProps) {
  const db = connect();

  const checkQuery = `
    SELECT 1 
    FROM wtw_films
    WHERE user_id = $1 AND film_id = $2;
  `;

  try {
    const result = await db.query(checkQuery, [userId, filmId]);

    if (
      result?.rowCount !== null &&
      result?.rowCount !== undefined &&
      result.rowCount > 0
    ) {
      // Film is already in the watchlist, remove it
      const deleteQuery = `
        DELETE FROM wtw_films
        WHERE user_id = $1 AND film_id = $2;
      `;
      await db.query(deleteQuery, [userId, filmId]);
      console.log("Film removed from watchlist.");
    } else {
      // Film is not in the watchlist, add it
      const insertQuery = `
        INSERT INTO wtw_films (user_id, film_id)
        VALUES ($1, $2);
      `;
      await db.query(insertQuery, [userId, filmId]);
      console.log("Film added to watchlist.");
    }
  } catch (err) {
    console.error("Error toggling film in watchlist:", err);
    throw new Error("Could not toggle film in watchlist."); // Optional: Rethrow for upstream error handling
  }
}
