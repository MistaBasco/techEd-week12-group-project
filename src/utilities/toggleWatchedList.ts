import connect from "@/utilities/connect";

type ToggleWatchedListProps = {
  userId: number;
  filmId: number;
};

export default async function toggleWatchedList({
  userId,
  filmId,
}: ToggleWatchedListProps) {
  const db = connect();

  try {
    await db.query("BEGIN");
    // Step 1: Check if the film is in the watched list
    const watchedCheckQuery = `
      SELECT 1 
      FROM watched_films
      WHERE user_id = $1 AND film_id = $2;
    `;
    const watchedResult = await db.query(watchedCheckQuery, [userId, filmId]);

    let action: "added to watched" | "removed from watched"; //resume

    if (
      watchedResult?.rowCount !== null &&
      watchedResult?.rowCount !== undefined &&
      watchedResult.rowCount > 0
    ) {
      // Film is already in the watched list, remove it
      const deleteWatchedQuery = `
        DELETE FROM watched_films
        WHERE user_id = $1 AND film_id = $2;
      `;
      await db.query(deleteWatchedQuery, [userId, filmId]);
      action = "removed from watched";
      console.log("Film removed from watched list.");
    } else {
      // Step 2: Check if the film is in the want-to-watch (wtw) list
      const wtwCheckQuery = `
        SELECT 1 
        FROM wtw_films
        WHERE user_id = $1 AND film_id = $2;
      `;
      const wtwResult = await db.query(wtwCheckQuery, [userId, filmId]);

      if (
        wtwResult?.rowCount !== null &&
        wtwResult?.rowCount !== undefined &&
        wtwResult.rowCount > 0
      ) {
        // Film is in the wtw list, remove it from wtw and add to watched list
        const deleteWtwQuery = `
          DELETE FROM wtw_films
          WHERE user_id = $1 AND film_id = $2;
        `;
        await db.query(deleteWtwQuery, [userId, filmId]);
        console.log("Film removed from want-to-watch list.");

        const insertWatchedQuery = `
        INSERT INTO watched_films (user_id, film_id)
        VALUES ($1, $2);
      `;
        await db.query(insertWatchedQuery, [userId, filmId]);
        action = "added to watched";
        console.log("Film added to watched list.");
      } else {
        // Add the film to the watched list
        const insertWatchedQuery = `
        INSERT INTO watched_films (user_id, film_id)
        VALUES ($1, $2);
      `;
        await db.query(insertWatchedQuery, [userId, filmId]);
        action = "added to watched";
        console.log("Film added to watched list.");
      }
    }

    await db.query("COMMIT");
    return action;
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Error toggling film in watched list:", err);
    throw new Error("Failed to toggle watched status");
  }
}
