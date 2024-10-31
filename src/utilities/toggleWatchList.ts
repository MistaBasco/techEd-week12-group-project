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

  try {
    await db.query("BEGIN");
    const checkQuery = `
    SELECT 1 
    FROM wtw_films
    WHERE user_id = $1 AND film_id = $2;
  `;
    const result = await db.query(checkQuery, [userId, filmId]);

    let action: "added" | "removed";

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
      action = "removed";
      console.log("Film removed from watchlist.");
    } else {
      // Film is not in the watchlist, add it
      const insertQuery = `
        INSERT INTO wtw_films (user_id, film_id)
        VALUES ($1, $2);
      `;
      await db.query(insertQuery, [userId, filmId]);
      action = "added";
      console.log("Film added to watchlist.");
    }
    await db.query("COMMIT");
    return action;
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  }
}
